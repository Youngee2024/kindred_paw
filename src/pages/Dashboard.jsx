import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import FormField from '../components/FormField'
import useApplication from '../context/useApplication'

const sections = [
  ['overview', 'Overview'],
  ['applications', 'Applications'],
  ['pets', 'My pets'],
  ['claims', 'Claims'],
  ['payments', 'Payments'],
  ['profile', 'Personal details'],
]

const emptyPet = { name: '', type: '', breed: '', birthday: '', weight: '' }
const emptyClaim = { petId: '', type: '', amount: '', visitDate: '', notes: '' }

const formatDate = (value) => value ? new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : '—'
const formatCurrency = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(value || 0))

function StatusPill({ children, tone = 'neutral' }) {
  const tones = {
    good: 'bg-[#dce8dc] text-[#25483a]',
    warm: 'bg-[#f3dec8] text-[#6f381f]',
    neutral: 'bg-stone-100 text-stone-600',
  }
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}

function EmptyState({ title, text, action, onAction }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#25483a]/25 bg-[#faf6ee] px-6 py-12 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#f3dec8] text-xl text-[#25483a]">+</div>
      <h3 className="mt-4 text-lg font-bold text-[#25483a]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">{text}</p>
      {action && <button type="button" onClick={onAction} className="mt-5 rounded-xl bg-[#25483a] px-5 py-3 text-sm font-semibold text-white">{action}</button>}
    </div>
  )
}

function Modal({ title, description, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#172c24]/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div><h2 className="text-2xl font-bold text-[#25483a]">{title}</h2>{description && <p className="mt-2 text-sm text-stone-600">{description}</p>}</div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-100 text-xl text-stone-600" aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4f2b]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25483a] sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-stone-600">{description}</p>}
      </div>
      {action && <button type="button" onClick={onAction} className="shrink-0 rounded-xl bg-[#25483a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d392e]">{action}</button>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { application, addPet, updatePet, removePet, updateProfile, submitClaim, resetApplication } = useApplication()
  const { owner, account, pets, applications, claims, payments } = application
  const [section, setSection] = useState('overview')
  const [petModal, setPetModal] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [petForm, setPetForm] = useState(emptyPet)
  const [claimModal, setClaimModal] = useState(false)
  const [claimForm, setClaimForm] = useState(emptyClaim)
  const [profile, setProfile] = useState({ name: owner.name || account.name, email: owner.email || account.email, phone: owner.phone, address: owner.address })
  const [notice, setNotice] = useState('')

  const activePolicies = applications.filter((item) => item.policyStatus === 'Active').length
  const openClaims = claims.filter((item) => !['Paid', 'Declined'].includes(item.status)).length
  const firstName = (owner.name || account.name || 'there').split(' ')[0]

  const startApplication = () => {
    resetApplication()
    navigate('/owner-info')
  }

  const openPetModal = (pet = null) => {
    setEditingPet(pet)
    setPetForm(pet ? { name: pet.name, type: pet.type, breed: pet.breed, birthday: pet.birthday, weight: pet.weight } : emptyPet)
    setPetModal(true)
  }

  const savePet = (event) => {
    event.preventDefault()
    if (editingPet) updatePet(editingPet.id, petForm)
    else addPet(petForm)
    setPetModal(false)
    setEditingPet(null)
    setPetForm(emptyPet)
  }

  const deletePet = (pet) => {
    if (window.confirm(`Remove ${pet.name} from your profile? Existing application records will remain available.`)) removePet(pet.id)
  }

  const saveClaim = (event) => {
    event.preventDefault()
    const reference = submitClaim(claimForm)
    setClaimForm(emptyClaim)
    setClaimModal(false)
    setNotice(`Claim ${reference} was submitted successfully.`)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    updateProfile(profile)
    setNotice('Your personal information has been updated.')
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900">
      <header className="sticky top-0 z-50 border-b border-[#25483a]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <Brand />
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-[#f3dec8] hover:text-[#25483a] sm:block">View website</Link>
            <div className="grid size-10 place-items-center rounded-full bg-[#25483a] text-sm font-bold text-white">{firstName.slice(0, 1).toUpperCase()}</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
        <aside className="hidden min-h-[calc(100vh-73px)] border-r border-[#25483a]/10 bg-white p-5 lg:block">
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {sections.map(([id, label]) => (
              <button key={id} type="button" onClick={() => setSection(id)} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${section === id ? 'bg-[#25483a] text-white' : 'text-stone-600 hover:bg-[#f3dec8] hover:text-[#25483a]'}`}>{label}</button>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl bg-[#f1e6d7] p-4">
            <p className="text-sm font-bold text-[#25483a]">Need help?</p>
            <p className="mt-1 text-xs leading-5 text-stone-600">Our care team can help with policies and claims.</p>
            <a href="mailto:hello@kindredpaw.com" className="mt-3 inline-block text-xs font-bold text-[#9a4f2b]">Contact support →</a>
          </div>
        </aside>

        <main className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          <nav className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-2 lg:hidden" aria-label="Dashboard navigation">
            {sections.map(([id, label]) => <button key={id} type="button" onClick={() => setSection(id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${section === id ? 'bg-[#25483a] text-white' : 'bg-white text-stone-600'}`}>{label}</button>)}
          </nav>

          {notice && <div role="status" className="mb-6 flex items-center justify-between rounded-2xl bg-[#dce8dc] px-5 py-4 text-sm font-semibold text-[#25483a]"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}

          {section === 'overview' && (
            <div>
              <SectionHeading eyebrow="Customer dashboard" title={`Welcome back, ${firstName}`} description="Everything about your pets, applications and claims in one place." />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Pets', pets.length, 'Your saved companions'],
                  ['Applications', applications.length, `${activePolicies} active policies`],
                  ['Open claims', openClaims, claims.length ? `${claims.length} claims in total` : 'No claims submitted'],
                ].map(([label, value, detail]) => (
                  <article key={label} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-stone-500">{label}</p>
                    <p className="mt-3 text-4xl font-bold text-[#25483a]">{value}</p>
                    <p className="mt-2 text-sm text-stone-500">{detail}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
                <section className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-[#25483a]">Recent applications</h2><button type="button" onClick={() => setSection('applications')} className="text-sm font-bold text-[#9a4f2b]">View all</button></div>
                  {applications.length ? <div className="mt-5 divide-y divide-[#25483a]/10">{applications.slice(0, 3).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-bold text-stone-800">{item.petName}</p><p className="mt-1 text-xs text-stone-500">{item.plan || 'Legacy plan'} · {item.reference} · {formatDate(item.submittedAt)}</p></div><StatusPill tone="warm">{item.policyStatus}</StatusPill></div>)}</div> : <div className="mt-5"><EmptyState title="No applications yet" text="Complete your first pet insurance application to track it here." /></div>}
                </section>
                <section className="rounded-3xl bg-[#25483a] p-6 text-white shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#e9c7aa]">Quick actions</p>
                  <h2 className="mt-3 text-2xl font-bold">What would you like to do?</h2>
                  <div className="mt-6 space-y-3">
                    <button type="button" onClick={() => openPetModal()} className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-bold text-[#25483a]">+ Add another pet</button>
                    <button type="button" onClick={() => pets.length ? setClaimModal(true) : setSection('pets')} className="w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">Submit a claim</button>
                    <button type="button" onClick={startApplication} className="block w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">Start new application</button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {section === 'applications' && (
            <div>
              <SectionHeading eyebrow="Policies" title="Applications and cover" description="Follow each application from submission through policy activation." action="New application" onAction={startApplication} />
              {applications.length ? <div className="space-y-4">{applications.map((item) => (
                <article key={item.id} className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-[#f3dec8] text-lg font-bold text-[#25483a]">{item.petName.slice(0, 1)}</div><div><h2 className="text-xl font-bold text-[#25483a]">{item.petName}</h2><p className="text-sm text-stone-500">{item.plan}</p></div></div></div>
                    <StatusPill tone={item.policyStatus === 'Active' ? 'good' : 'warm'}>{item.policyStatus}</StatusPill>
                  </div>
                  <div className="mt-6 grid gap-4 border-t border-[#25483a]/10 pt-5 text-sm sm:grid-cols-2 xl:grid-cols-4"><div><p className="text-stone-500">Reference</p><p className="mt-1 font-bold">{item.reference}</p></div><div><p className="text-stone-500">Submitted</p><p className="mt-1 font-bold">{formatDate(item.submittedAt)}</p></div><div><p className="text-stone-500">Application status</p><p className="mt-1 font-bold">{item.status}</p></div><div><p className="text-stone-500">Selected premium</p><p className="mt-1 font-bold">{item.monthlyPremium ? `${formatCurrency(item.billing === 'annual' ? item.annualPremium : item.monthlyPremium)} / ${item.billing === 'annual' ? 'year' : 'month'}` : 'Not recorded'}</p></div></div>
                  <div className="mt-6 flex items-center gap-3"><span className="size-3 rounded-full bg-[#9a4f2b]" /><div className="h-1 flex-1 rounded-full bg-[#f3dec8]"><div className="h-full w-1/3 rounded-full bg-[#9a4f2b]" /></div><span className="text-xs font-semibold text-stone-500">Review in progress</span></div>
                </article>
              ))}</div> : <EmptyState title="No submitted applications" text="Once you submit an application, its review and policy status will appear here." action="Start an application" onAction={startApplication} />}
            </div>
          )}

          {section === 'pets' && (
            <div>
              <SectionHeading eyebrow="Pet profiles" title="Your companions" description="Add pets and keep their basic details up to date." action="Add a pet" onAction={() => openPetModal()} />
              {pets.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{pets.map((pet) => (
                <article key={pet.id} className="overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white shadow-sm">
                  <div className="flex items-center gap-4 bg-[#f1e6d7] p-6"><div className="grid size-16 place-items-center rounded-full bg-white text-2xl font-bold text-[#25483a]">{pet.name.slice(0, 1).toUpperCase()}</div><div><h2 className="text-xl font-bold text-[#25483a]">{pet.name}</h2><p className="capitalize text-sm text-stone-600">{pet.breed || pet.type}</p></div></div>
                  <dl className="grid grid-cols-2 gap-4 p-6 text-sm"><div><dt className="text-stone-500">Type</dt><dd className="mt-1 font-semibold capitalize">{pet.type}</dd></div><div><dt className="text-stone-500">Weight</dt><dd className="mt-1 font-semibold">{pet.weight ? `${pet.weight} kg` : '—'}</dd></div><div className="col-span-2"><dt className="text-stone-500">Birthday</dt><dd className="mt-1 font-semibold">{formatDate(pet.birthday)}</dd></div></dl>
                  <div className="flex border-t border-[#25483a]/10"><button type="button" onClick={() => openPetModal(pet)} className="flex-1 px-4 py-3 text-sm font-bold text-[#25483a] hover:bg-[#faf6ee]">Edit</button><button type="button" onClick={() => deletePet(pet)} className="flex-1 border-l border-[#25483a]/10 px-4 py-3 text-sm font-bold text-[#9a4f2b] hover:bg-[#faf6ee]">Remove</button></div>
                </article>
              ))}</div> : <EmptyState title="No pets added" text="Create a pet profile to begin an application or submit a claim." action="Add your first pet" onAction={() => openPetModal()} />}
            </div>
          )}

          {section === 'claims' && (
            <div>
              <SectionHeading eyebrow="Claims centre" title="Claims" description="Submit veterinary expenses and track progress from receipt to payment." action={pets.length ? 'Submit a claim' : undefined} onAction={() => setClaimModal(true)} />
              {!pets.length ? <EmptyState title="Add a pet before claiming" text="Claims need to be connected to one of your pet profiles." action="Add a pet" onAction={() => { setSection('pets'); openPetModal() }} /> : claims.length ? <div className="overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white shadow-sm"><div className="hidden grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-[#f1e6d7] px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-500 sm:grid"><span>Claim</span><span>Pet</span><span>Amount</span><span>Status</span></div>{claims.map((claim) => { const pet = pets.find((item) => item.id === claim.petId); return <div key={claim.id} className="grid gap-3 border-t border-[#25483a]/10 px-6 py-5 first:border-t-0 sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-center"><div><p className="font-bold text-[#25483a]">{claim.reference}</p><p className="text-xs text-stone-500">{formatDate(claim.submittedAt)}</p></div><p className="font-semibold">{pet?.name || 'Pet profile removed'}</p><p>{formatCurrency(claim.amount)}</p><div><StatusPill tone="warm">{claim.status}</StatusPill></div></div>})}</div> : <EmptyState title="No claims submitted" text="When you need to claim for eligible veterinary care, start here and follow its status." action="Submit your first claim" onAction={() => setClaimModal(true)} />}
            </div>
          )}

          {section === 'payments' && (
            <div>
              <SectionHeading eyebrow="Billing" title="Payments and receipts" description="Review successful premium payments and open printable receipts." />
              {payments.length ? <div className="overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white shadow-sm"><div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 bg-[#f1e6d7] px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-500 md:grid"><span>Reference</span><span>Cover</span><span>Date</span><span>Amount</span><span>Receipt</span></div>{payments.map((payment) => <div key={payment.reference} className="grid gap-3 border-t border-[#25483a]/10 px-6 py-5 first:border-t-0 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-center"><div><p className="font-bold text-[#25483a]">{payment.reference}</p><p className="text-xs capitalize text-stone-500">{payment.channel}</p></div><div><p className="font-semibold">{payment.planName}</p><p className="text-xs capitalize text-stone-500">{payment.petName} · {payment.billing}</p></div><p className="text-sm">{formatDate(payment.paidAt || payment.recordedAt)}</p><p className="font-bold">{formatCurrency(payment.amount)}</p><Link to={`/receipt/${encodeURIComponent(payment.reference)}`} className="rounded-lg bg-[#f3dec8] px-4 py-2 text-center text-xs font-bold text-[#25483a]">View receipt</Link></div>)}</div> : <EmptyState title="No payment history" text="Verified premium payments and receipts will appear here." />}
            </div>
          )}

          {section === 'profile' && (
            <div>
              <SectionHeading eyebrow="Account" title="Personal information" description="Keep your contact information current so we can reach you about applications and claims." />
              <form onSubmit={saveProfile} className="max-w-3xl rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2"><FormField label="Full name" id="profile-name" required value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></div>
                  <FormField label="Email address" id="profile-email" type="email" required value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
                  <FormField label="Phone number" id="profile-phone" type="tel" required value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
                  <div className="sm:col-span-2"><FormField label="Home address" id="profile-address" as="textarea" required value={profile.address} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} /></div>
                </div>
                <div className="mt-6 flex justify-end"><button className="rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">Save changes</button></div>
              </form>
            </div>
          )}
        </main>
      </div>

      {petModal && <Modal title={editingPet ? `Edit ${editingPet.name}` : 'Add a pet'} description="Save the details you will use for applications and claims." onClose={() => setPetModal(false)}><form onSubmit={savePet} className="grid gap-5 sm:grid-cols-2"><FormField label="Pet name" id="dashboard-pet-name" required value={petForm.name} onChange={(event) => setPetForm((current) => ({ ...current, name: event.target.value }))} /><FormField label="Pet type" id="dashboard-pet-type" as="select" required options={[['', 'Select type'], ['dog', 'Dog'], ['cat', 'Cat']]} value={petForm.type} onChange={(event) => setPetForm((current) => ({ ...current, type: event.target.value }))} /><FormField label="Breed" id="dashboard-pet-breed" required value={petForm.breed} onChange={(event) => setPetForm((current) => ({ ...current, breed: event.target.value }))} /><FormField label="Birthday" id="dashboard-pet-birthday" type="date" required value={petForm.birthday} onChange={(event) => setPetForm((current) => ({ ...current, birthday: event.target.value }))} /><div className="sm:col-span-2"><FormField label="Weight (kg)" id="dashboard-pet-weight" type="number" min="0.1" step="0.1" required value={petForm.weight} onChange={(event) => setPetForm((current) => ({ ...current, weight: event.target.value }))} /></div><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setPetModal(false)} className="rounded-xl border border-[#25483a]/20 px-5 py-3 font-semibold text-[#25483a]">Cancel</button><button className="rounded-xl bg-[#25483a] px-5 py-3 font-semibold text-white">{editingPet ? 'Save changes' : 'Add pet'}</button></div></form></Modal>}

      {claimModal && <Modal title="Submit a claim" description="Tell us about the veterinary visit. Supporting document upload can be added when the claims backend is connected." onClose={() => setClaimModal(false)}><form onSubmit={saveClaim} className="grid gap-5 sm:grid-cols-2"><FormField label="Pet" id="claim-pet" as="select" required options={[['', 'Select pet'], ...pets.map((pet) => [pet.id, pet.name])]} value={claimForm.petId} onChange={(event) => setClaimForm((current) => ({ ...current, petId: event.target.value }))} /><FormField label="Claim type" id="claim-type" as="select" required options={[['', 'Select type'], ['Veterinary consultation', 'Veterinary consultation'], ['Medication', 'Medication'], ['Diagnostic tests', 'Diagnostic tests'], ['Surgery', 'Surgery'], ['Other', 'Other']]} value={claimForm.type} onChange={(event) => setClaimForm((current) => ({ ...current, type: event.target.value }))} /><FormField label="Amount (NGN)" id="claim-amount" type="number" min="1" required value={claimForm.amount} onChange={(event) => setClaimForm((current) => ({ ...current, amount: event.target.value }))} /><FormField label="Visit date" id="claim-date" type="date" required value={claimForm.visitDate} onChange={(event) => setClaimForm((current) => ({ ...current, visitDate: event.target.value }))} /><div className="sm:col-span-2"><FormField label="What happened?" id="claim-notes" as="textarea" required value={claimForm.notes} onChange={(event) => setClaimForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Briefly describe the treatment and expense" /></div><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setClaimModal(false)} className="rounded-xl border border-[#25483a]/20 px-5 py-3 font-semibold text-[#25483a]">Cancel</button><button className="rounded-xl bg-[#25483a] px-5 py-3 font-semibold text-white">Submit claim</button></div></form></Modal>}
    </div>
  )
}
