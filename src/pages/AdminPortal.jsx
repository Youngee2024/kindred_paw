import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import FormField from '../components/FormField'
import useApplication from '../context/useApplication'
import { breedsByType, petTypes, weights } from '../utils/petOptions'

const sections = [
  ['overview', 'Overview'],
  ['applications', 'Applications'],
  ['claims', 'Claims'],
  ['customers', 'Customers'],
  ['pets', 'Pets'],
  ['plans', 'Plans'],
  ['payments', 'Payments'],
  ['reports', 'Reports'],
]

const formatCurrency = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(value || 0))
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Not available'

function Status({ value }) {
  const good = ['Active', 'Approved', 'Paid', 'success', 'Reconciled'].includes(value)
  const bad = ['Rejected', 'Declined', 'Suspended', 'failed', 'Needs review'].includes(value)
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${good ? 'bg-[#dce8dc] text-[#25483a]' : bad ? 'bg-[#f8ebdd] text-[#8a3e24]' : 'bg-[#f3dec8] text-[#6f381f]'}`}>{value || 'Pending'}</span>
}

function Heading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25483a] sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>}</div>
      {action}
    </div>
  )
}

function Empty({ title, text }) {
  return <div className="rounded-3xl border border-dashed border-[#25483a]/20 bg-white px-6 py-12 text-center"><p className="font-bold text-[#25483a]">{title}</p><p className="mt-2 text-sm text-stone-500">{text}</p></div>
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[#172c24]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}><div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="text-2xl font-bold text-[#25483a]">{title}</h2><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-stone-100 text-xl" aria-label="Close">&times;</button></div>{children}</div></div>
}

function downloadCsv(name, rows) {
  if (!rows.length) return false
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `kindredpaw-${name}-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
  return true
}

export default function AdminPortal() {
  const { application, decideApplication, decideClaim, updateProfile, updateCustomerStatus, updatePet, removePet, updatePlan, updatePaymentRecord } = useApplication()
  const { owner, account, applications, claims, pets, plans, payments, customerStatus } = application
  const [section, setSection] = useState('overview')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [petEditing, setPetEditing] = useState(null)
  const [planEditing, setPlanEditing] = useState(null)
  const [customer, setCustomer] = useState({ name: owner.name || account.name, email: owner.email || account.email, phone: owner.phone, address: owner.address })
  const query = search.trim().toLowerCase()
  const adminBreedOptions = petEditing?.type ? [...(breedsByType[petEditing.type] || [['', 'Select breed']])] : [['', 'Choose a pet type first']]
  if (petEditing?.breed && !adminBreedOptions.some(([value]) => value === petEditing.breed)) adminBreedOptions.push([petEditing.breed, petEditing.breed])
  const adminWeightOptions = [...weights]
  if (petEditing?.weight && !adminWeightOptions.some(([value]) => value === petEditing.weight)) adminWeightOptions.push([petEditing.weight, `${petEditing.weight} kg`])

  const filteredApplications = useMemo(() => applications.filter((item) => !query || [item.reference, item.petName, item.plan, item.status, item.policyStatus].some((value) => String(value || '').toLowerCase().includes(query))), [applications, query])
  const filteredClaims = useMemo(() => claims.filter((item) => !query || [item.reference, item.type, item.status].some((value) => String(value || '').toLowerCase().includes(query))), [claims, query])
  const pendingApplications = applications.filter((item) => ['Submitted', 'Under review'].includes(item.status) || item.policyStatus === 'Under review').length
  const pendingClaims = claims.filter((item) => !['Approved', 'Declined', 'Paid'].includes(item.status)).length
  const revenue = payments.filter((item) => item.status === 'success').reduce((total, item) => total + Number(item.amount || 0), 0)

  const decide = (type, id, decision) => {
    if (type === 'application') decideApplication(id, decision)
    else decideClaim(id, decision)
    setNotice(`${type === 'application' ? 'Application' : 'Claim'} ${decision === 'approve' ? 'approved' : 'rejected'}.`)
  }

  const saveCustomer = (event) => {
    event.preventDefault()
    updateProfile(customer)
    setNotice('Customer details updated.')
  }

  const savePet = (event) => {
    event.preventDefault()
    updatePet(petEditing.id, petEditing)
    setPetEditing(null)
    setNotice('Pet profile updated.')
  }

  const savePlan = (event) => {
    event.preventDefault()
    updatePlan(planEditing.id, { ...planEditing, basePremium: Number(planEditing.basePremium) })
    setPlanEditing(null)
    setNotice('Plan draft updated in this browser.')
  }

  const exportReport = (type) => {
    const datasets = {
      applications: applications.map((item) => ({ reference: item.reference, customer: owner.name || account.name, pet: item.petName, plan: item.plan, submitted: item.submittedAt, applicationStatus: item.status, policyStatus: item.policyStatus, paymentStatus: item.paymentStatus })),
      claims: claims.map((item) => ({ reference: item.reference, pet: pets.find((pet) => pet.id === item.petId)?.name, type: item.type, amount: item.amount, visitDate: item.visitDate, submitted: item.submittedAt, status: item.status })),
      payments: payments.map((item) => ({ reference: item.reference, customerEmail: item.customerEmail, pet: item.petName, plan: item.planName, billing: item.billing, amount: item.amount, currency: item.currency, paidAt: item.paidAt, status: item.status, reconciliation: item.reconciliation || 'Unreviewed' })),
      customers: [{ name: owner.name || account.name, email: owner.email || account.email, phone: owner.phone, address: owner.address, status: customerStatus, pets: pets.length, applications: applications.length }],
    }
    const exported = downloadCsv(type, datasets[type])
    setNotice(exported ? `${type[0].toUpperCase()}${type.slice(1)} report exported.` : `There are no ${type} records to export yet.`)
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900">
      <header className="sticky top-0 z-50 border-b border-[#25483a]/10 bg-[#17382d] text-white shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-5"><Brand light /><span className="hidden h-7 w-px bg-white/20 sm:block" /><span className="hidden text-sm font-semibold text-[#e9c7aa] sm:block">Administration</span></div>
          <div className="flex items-center gap-3"><Link to="/dashboard" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 sm:block">Customer view</Link><div className="grid size-10 place-items-center rounded-full bg-[#e9c7aa] text-sm font-bold text-[#25483a]">AD</div></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden min-h-[calc(100vh-73px)] border-r border-[#25483a]/10 bg-white p-5 lg:block">
          <p className="px-4 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">Workspace</p>
          <nav className="space-y-1" aria-label="Admin navigation">{sections.map(([id, label]) => <button key={id} type="button" onClick={() => setSection(id)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${section === id ? 'bg-[#25483a] text-white' : 'text-stone-600 hover:bg-[#f3dec8] hover:text-[#25483a]'}`}><span>{label}</span>{id === 'applications' && pendingApplications > 0 && <span className="rounded-full bg-[#9a4f2b] px-2 py-0.5 text-[10px] text-white">{pendingApplications}</span>}{id === 'claims' && pendingClaims > 0 && <span className="rounded-full bg-[#9a4f2b] px-2 py-0.5 text-[10px] text-white">{pendingClaims}</span>}</button>)}</nav>
          <div className="mt-8 rounded-2xl bg-[#f8ebdd] p-4 text-xs leading-5 text-[#6f381f]"><p className="font-bold">Prototype environment</p><p className="mt-1">Changes are stored in this browser. Production access requires administrator authentication and a database.</p></div>
        </aside>

        <main className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          <nav className="-mx-5 mb-7 flex gap-2 overflow-x-auto px-5 pb-2 lg:hidden" aria-label="Admin navigation">{sections.map(([id, label]) => <button key={id} type="button" onClick={() => setSection(id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${section === id ? 'bg-[#25483a] text-white' : 'bg-white text-stone-600'}`}>{label}</button>)}</nav>
          {notice && <div role="status" className="mb-6 flex items-center justify-between rounded-2xl bg-[#dce8dc] px-5 py-4 text-sm font-semibold text-[#25483a]"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss">&times;</button></div>}

          {section === 'overview' && <div><Heading eyebrow="Operations" title="Administration overview" description="Review queues, customer activity and payment performance from one workspace." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
            ['Applications to review', pendingApplications, `${applications.length} total applications`],
            ['Open claims', pendingClaims, `${claims.length} total claims`],
            ['Customers', owner.email || account.email ? 1 : 0, customerStatus],
            ['Collected premiums', formatCurrency(revenue), `${payments.length} payments`],
          ].map(([label, value, detail]) => <article key={label} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-stone-500">{label}</p><p className="mt-3 text-3xl font-bold text-[#25483a]">{value}</p><p className="mt-2 text-xs text-stone-500">{detail}</p></article>)}</div>
          <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-[#25483a]">Application queue</h2><button type="button" onClick={() => setSection('applications')} className="text-sm font-bold text-[#9a4f2b]">Review all</button></div>{applications.length ? <div className="mt-4 divide-y divide-[#25483a]/10">{applications.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-bold">{item.petName}</p><p className="mt-1 text-xs text-stone-500">{item.reference} &middot; {item.plan}</p></div><Status value={item.policyStatus} /></div>)}</div> : <p className="mt-6 text-sm text-stone-500">No applications have been submitted.</p>}</section><section className="rounded-3xl bg-[#25483a] p-6 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9c7aa]">Priority work</p><h2 className="mt-3 text-2xl font-bold">Keep decisions moving</h2><div className="mt-6 space-y-3"><button type="button" onClick={() => setSection('applications')} className="flex w-full justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#25483a]"><span>Review applications</span><span>{pendingApplications}</span></button><button type="button" onClick={() => setSection('claims')} className="flex w-full justify-between rounded-xl border border-white/20 px-4 py-3 text-sm font-bold"><span>Review claims</span><span>{pendingClaims}</span></button><button type="button" onClick={() => setSection('reports')} className="w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-bold">Export operations report</button></div></section></div></div>}

          {section === 'applications' && <div><Heading eyebrow="Underwriting" title="Applications" description="Approve eligible applications or reject those that require a different outcome." action={<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" className="rounded-xl border border-[#25483a]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#25483a]" />} />{filteredApplications.length ? <div className="space-y-4">{filteredApplications.map((item) => <article key={item.id} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold text-[#25483a]">{item.petName}</h2><Status value={item.policyStatus} /></div><p className="mt-2 text-sm text-stone-500">{item.reference} &middot; {item.plan} &middot; submitted {formatDate(item.submittedAt)}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm"><span><span className="text-stone-500">Billing:</span> <b className="capitalize">{item.billing || 'Not recorded'}</b></span><span><span className="text-stone-500">Premium:</span> <b>{formatCurrency(item.billing === 'annual' ? item.annualPremium : item.monthlyPremium)}</b></span><span><span className="text-stone-500">Payment:</span> <b>{item.paymentStatus || 'Not recorded'}</b></span></div></div><div className="flex shrink-0 gap-3"><button type="button" onClick={() => decide('application', item.id, 'reject')} disabled={item.status === 'Rejected'} className="rounded-xl border border-[#9a4f2b]/25 px-5 py-3 text-sm font-bold text-[#9a4f2b] disabled:opacity-40">Reject</button><button type="button" onClick={() => decide('application', item.id, 'approve')} disabled={item.status === 'Approved'} className="rounded-xl bg-[#25483a] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">Approve policy</button></div></div></article>)}</div> : <Empty title="No matching applications" text="New customer applications will appear here for review." />}</div>}

          {section === 'claims' && <div><Heading eyebrow="Claims operations" title="Claims review" description="Review submitted expenses and record a clear claims decision." action={<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search claims" className="rounded-xl border border-[#25483a]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#25483a]" />} />{filteredClaims.length ? <div className="overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white shadow-sm"><div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 bg-[#f1e6d7] px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-500 lg:grid"><span>Claim</span><span>Pet / type</span><span>Submitted</span><span>Amount</span><span>Decision</span></div>{filteredClaims.map((claim) => <div key={claim.id} className="grid gap-4 border-t border-[#25483a]/10 px-6 py-5 first:border-t-0 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-center"><div><p className="font-bold text-[#25483a]">{claim.reference}</p><div className="mt-1"><Status value={claim.status} /></div></div><div><p className="font-semibold">{pets.find((pet) => pet.id === claim.petId)?.name || 'Unknown pet'}</p><p className="text-xs text-stone-500">{claim.type}</p></div><p className="text-sm">{formatDate(claim.submittedAt)}</p><p className="font-bold">{formatCurrency(claim.amount)}</p><div className="flex gap-2"><button type="button" onClick={() => decide('claim', claim.id, 'reject')} className="rounded-lg border border-[#9a4f2b]/25 px-3 py-2 text-xs font-bold text-[#9a4f2b]">Reject</button><button type="button" onClick={() => decide('claim', claim.id, 'approve')} className="rounded-lg bg-[#25483a] px-3 py-2 text-xs font-bold text-white">Approve</button></div></div>)}</div> : <Empty title="No claims to review" text="Submitted customer claims will appear in this queue." />}</div>}

          {section === 'customers' && <div><Heading eyebrow="Customer management" title="Customer account" description="Update customer contact details and control account access." /><div className="grid gap-6 xl:grid-cols-[1fr_320px]"><form onSubmit={saveCustomer} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><FormField id="admin-customer-name" label="Full name" required value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} /></div><FormField id="admin-customer-email" label="Email" type="email" required value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} /><FormField id="admin-customer-phone" label="Phone" required value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} /><div className="sm:col-span-2"><FormField id="admin-customer-address" label="Address" as="textarea" required value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} /></div></div><div className="mt-6 flex justify-end"><button className="rounded-xl bg-[#25483a] px-6 py-3 font-bold text-white">Save customer</button></div></form><aside className="rounded-3xl bg-[#25483a] p-6 text-white"><p className="text-xs font-bold uppercase tracking-wider text-[#e9c7aa]">Account status</p><div className="mt-4"><Status value={customerStatus} /></div><p className="mt-5 text-sm leading-6 text-white/75">Suspending an account records the administrative status in this prototype. Production enforcement belongs in the authentication service.</p><select value={customerStatus} onChange={(event) => { updateCustomerStatus(event.target.value); setNotice(`Customer account marked ${event.target.value.toLowerCase()}.`) }} className="mt-6 w-full rounded-xl border border-white/20 bg-white px-4 py-3 font-semibold text-[#25483a]"><option>Active</option><option>Suspended</option><option>Under review</option></select><dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 text-sm"><div><dt className="text-white/60">Pets</dt><dd className="mt-1 text-xl font-bold">{pets.length}</dd></div><div><dt className="text-white/60">Applications</dt><dd className="mt-1 text-xl font-bold">{applications.length}</dd></div></dl></aside></div></div>}

          {section === 'pets' && <div><Heading eyebrow="Portfolio" title="Pet records" description="Review and maintain pet information associated with customer policies and claims." />{pets.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{pets.map((pet) => <article key={pet.id} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-full bg-[#f3dec8] text-xl font-bold text-[#25483a]">{pet.name?.slice(0, 1).toUpperCase()}</div><div><h2 className="text-xl font-bold text-[#25483a]">{pet.name}</h2><p className="text-sm capitalize text-stone-500">{pet.breed || pet.type}</p></div></div><dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#25483a]/10 py-5 text-sm"><div><dt className="text-stone-500">Type</dt><dd className="mt-1 font-bold capitalize">{pet.type}</dd></div><div><dt className="text-stone-500">Weight</dt><dd className="mt-1 font-bold">{pet.weight || 'N/A'} kg</dd></div><div className="col-span-2"><dt className="text-stone-500">Birthday</dt><dd className="mt-1 font-bold">{formatDate(pet.birthday)}</dd></div></dl><div className="mt-5 flex gap-3"><button type="button" onClick={() => setPetEditing({ ...pet })} className="flex-1 rounded-xl bg-[#25483a] px-4 py-2.5 text-sm font-bold text-white">Edit</button><button type="button" onClick={() => { if (window.confirm(`Remove ${pet.name}'s profile?`)) { removePet(pet.id); setNotice('Pet profile removed.') } }} className="rounded-xl border border-[#9a4f2b]/25 px-4 py-2.5 text-sm font-bold text-[#9a4f2b]">Remove</button></div></article>)}</div> : <Empty title="No pet records" text="Customer pet profiles will appear here." />}</div>}

          {section === 'plans' && <div><Heading eyebrow="Product catalogue" title="Insurance plans" description="Maintain plan presentation, pricing drafts and availability. Publishing these settings to live checkout requires backend catalogue storage." /> <div className="grid gap-5 xl:grid-cols-3">{plans.map((plan) => <article key={plan.id} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#9a4f2b]">{plan.id}</p><h2 className="mt-2 text-xl font-bold text-[#25483a]">{plan.name}</h2></div><Status value={plan.status} /></div><p className="mt-3 min-h-12 text-sm leading-6 text-stone-500">{plan.description}</p><p className="mt-6 text-3xl font-bold text-[#25483a]">{formatCurrency(plan.basePremium)}<span className="text-xs font-medium text-stone-400"> / base month</span></p><dl className="mt-5 space-y-3 border-t border-[#25483a]/10 pt-5 text-sm"><div className="flex justify-between"><dt className="text-stone-500">Annual limit</dt><dd className="font-bold">{plan.annualLimit}</dd></div><div className="flex justify-between"><dt className="text-stone-500">Reimbursement</dt><dd className="font-bold">{plan.reimbursement}</dd></div><div className="flex justify-between"><dt className="text-stone-500">Deductible</dt><dd className="font-bold">{plan.deductible}</dd></div></dl><button type="button" onClick={() => setPlanEditing({ ...plan })} className="mt-6 w-full rounded-xl border border-[#25483a]/20 px-4 py-3 text-sm font-bold text-[#25483a] hover:bg-[#faf6ee]">Manage plan</button></article>)}</div></div>}

          {section === 'payments' && <div><Heading eyebrow="Finance" title="Payments" description="Review successful charges, reconcile records and open customer receipts." />{payments.length ? <div className="overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white shadow-sm"><div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#f1e6d7] px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-500 lg:grid"><span>Reference</span><span>Customer</span><span>Plan</span><span>Amount</span><span>Status</span><span>Receipt</span></div>{payments.map((payment) => <div key={payment.reference} className="grid gap-4 border-t border-[#25483a]/10 px-6 py-5 first:border-t-0 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] lg:items-center"><div><p className="font-bold text-[#25483a]">{payment.reference}</p><p className="text-xs text-stone-500">{formatDate(payment.paidAt || payment.recordedAt)}</p></div><p className="truncate text-sm">{payment.customerEmail}</p><div><p className="font-semibold">{payment.planName}</p><p className="text-xs capitalize text-stone-500">{payment.billing}</p></div><p className="font-bold">{formatCurrency(payment.amount)}</p><select aria-label={`Reconciliation for ${payment.reference}`} value={payment.reconciliation || 'Unreviewed'} onChange={(event) => { updatePaymentRecord(payment.reference, { reconciliation: event.target.value }); setNotice('Payment reconciliation updated.') }} className="rounded-lg border border-[#25483a]/15 bg-white px-3 py-2 text-xs font-bold text-[#25483a]"><option>Unreviewed</option><option>Reconciled</option><option>Needs review</option></select><Link to={`/receipt/${encodeURIComponent(payment.reference)}`} className="rounded-lg bg-[#f3dec8] px-4 py-2 text-center text-xs font-bold text-[#25483a]">Receipt</Link></div>)}</div> : <Empty title="No payment records" text="Verified Paystack transactions will appear here." />}</div>}

          {section === 'reports' && <div><Heading eyebrow="Data export" title="Reports" description="Download operational data as CSV for analysis, reconciliation or audit workflows." /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{[
            ['applications', 'Applications report', `${applications.length} records`, 'Policy decisions and payment status'],
            ['claims', 'Claims report', `${claims.length} records`, 'Claim values, dates and outcomes'],
            ['payments', 'Payments report', `${payments.length} records`, 'Transactions and reconciliation'],
            ['customers', 'Customer report', owner.email || account.email ? '1 record' : '0 records', 'Contact and portfolio summary'],
          ].map(([id, title, count, description]) => <article key={id} className="flex flex-col rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm"><div className="grid size-12 place-items-center rounded-2xl bg-[#f3dec8] text-lg font-bold text-[#25483a]">CSV</div><h2 className="mt-5 text-lg font-bold text-[#25483a]">{title}</h2><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#9a4f2b]">{count}</p><p className="mt-3 flex-1 text-sm leading-6 text-stone-500">{description}</p><button type="button" onClick={() => exportReport(id)} className="mt-6 rounded-xl bg-[#25483a] px-4 py-3 text-sm font-bold text-white">Export CSV</button></article>)}</div><div className="mt-6 rounded-2xl border border-[#25483a]/10 bg-[#faf6ee] p-5 text-sm leading-6 text-stone-600"><strong className="text-[#25483a]">Data handling:</strong> exports are generated locally from records in this browser. Review downloaded files before sharing because they may contain personal and financial information.</div></div>}
        </main>
      </div>

      {petEditing && <Modal title={`Edit ${petEditing.name}`} onClose={() => setPetEditing(null)}><form onSubmit={savePet} className="grid gap-5 sm:grid-cols-2"><FormField id="admin-pet-name" label="Pet name" required value={petEditing.name} onChange={(event) => setPetEditing((current) => ({ ...current, name: event.target.value }))} /><FormField id="admin-pet-type" label="Type" as="select" required options={petTypes} value={petEditing.type} onChange={(event) => setPetEditing((current) => ({ ...current, type: event.target.value, breed: '' }))} /><FormField id="admin-pet-breed" label="Breed" as="select" required disabled={!petEditing.type} options={adminBreedOptions} value={petEditing.breed} onChange={(event) => setPetEditing((current) => ({ ...current, breed: event.target.value }))} /><FormField id="admin-pet-weight" label="Weight" as="select" required options={adminWeightOptions} value={petEditing.weight} onChange={(event) => setPetEditing((current) => ({ ...current, weight: event.target.value }))} /><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setPetEditing(null)} className="rounded-xl border border-[#25483a]/20 px-5 py-3 font-bold text-[#25483a]">Cancel</button><button className="rounded-xl bg-[#25483a] px-5 py-3 font-bold text-white">Save pet</button></div></form></Modal>}

      {planEditing && <Modal title={`Manage ${planEditing.name}`} onClose={() => setPlanEditing(null)}><form onSubmit={savePlan} className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><FormField id="admin-plan-name" label="Plan name" required value={planEditing.name} onChange={(event) => setPlanEditing((current) => ({ ...current, name: event.target.value }))} /></div><FormField id="admin-plan-premium" label="Base monthly premium (NGN)" type="number" min="0" required value={planEditing.basePremium} onChange={(event) => setPlanEditing((current) => ({ ...current, basePremium: event.target.value }))} /><FormField id="admin-plan-status" label="Status" as="select" options={[["Active", "Active"], ["Paused", "Paused"], ["Draft", "Draft"]]} value={planEditing.status} onChange={(event) => setPlanEditing((current) => ({ ...current, status: event.target.value }))} /><FormField id="admin-plan-limit" label="Annual limit" required value={planEditing.annualLimit} onChange={(event) => setPlanEditing((current) => ({ ...current, annualLimit: event.target.value }))} /><FormField id="admin-plan-reimbursement" label="Reimbursement" required value={planEditing.reimbursement} onChange={(event) => setPlanEditing((current) => ({ ...current, reimbursement: event.target.value }))} /><div className="sm:col-span-2"><FormField id="admin-plan-description" label="Description" as="textarea" required value={planEditing.description} onChange={(event) => setPlanEditing((current) => ({ ...current, description: event.target.value }))} /></div><div className="sm:col-span-2 rounded-xl bg-[#f8ebdd] p-4 text-xs leading-5 text-[#6f381f]">This prototype stores catalogue edits locally. Live quote and Paystack pricing remain controlled by server-side configuration until a catalogue database is connected.</div><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setPlanEditing(null)} className="rounded-xl border border-[#25483a]/20 px-5 py-3 font-bold text-[#25483a]">Cancel</button><button className="rounded-xl bg-[#25483a] px-5 py-3 font-bold text-white">Save plan draft</button></div></form></Modal>}
    </div>
  )
}
