import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import useApplication from '../context/useApplication'

const formatCurrency = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value)

export default function Payment() {
  const navigate = useNavigate()
  const { application, recordPayment, submitApplication } = useApplication()
  const { owner, account, pet, quote } = application
  const [email, setEmail] = useState(owner.email || account.email || '')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [error, setError] = useState('')
  const livePaymentsEnabled = import.meta.env.VITE_ENABLE_LIVE_PAYMENTS === 'true'
  const amount = quote.billing === 'annual' ? quote.annualPremium : quote.monthlyPremium
  const ready = pet.name && quote.planId && amount

  const recordSuccessfulPayment = () => {
    const reference = `DEMO-${Date.now().toString(36).toUpperCase()}`
    recordPayment({
      reference,
      receiptNumber: `RCP-${reference.slice(-8)}`,
      status: 'success',
      amount,
      currency: 'NGN',
      paidAt: new Date().toISOString(),
      channel: 'demo',
      customerEmail: email,
      planId: quote.planId,
      planName: quote.planName,
      billing: quote.billing,
      petName: pet.name,
    })
    submitApplication()
    setLoading(false)
    setPaymentComplete(true)
    window.setTimeout(() => navigate('/dashboard'), 1600)
  }

  const beginPayment = async () => {
    setLoading(true)
    setError('')

    if (!livePaymentsEnabled) {
      await new Promise((resolve) => window.setTimeout(resolve, 650))
      recordSuccessfulPayment()
      return
    }

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pet, planId: quote.planId, billing: quote.billing }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to start payment.')
      sessionStorage.setItem('kindredpaw-pending-payment', JSON.stringify({ reference: payload.reference, startedAt: new Date().toISOString() }))
      window.location.assign(payload.authorizationUrl)
    } catch (paymentError) {
      setError(paymentError.message)
      setLoading(false)
    }
  }

  if (!ready) {
    return <main className="min-h-screen bg-[#faf6ee] px-5 py-8"><div className="mx-auto max-w-4xl"><Brand /><div className="mt-20 rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-3xl font-bold text-[#25483a]">Your checkout is not ready</h1><p className="mt-3 text-stone-600">Choose a coverage plan before continuing to payment.</p><Link to="/quote" className="mt-6 inline-flex rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">Return to quotes</Link></div></div></main>
  }

  if (paymentComplete) {
    return <main className="grid min-h-screen place-items-center bg-[#faf6ee] p-5"><div className="w-full max-w-xl rounded-3xl bg-white p-9 text-center shadow-xl"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#dce8dc] text-4xl font-bold text-[#25483a]">✓</div><p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#9a4f2b]">Payment successful</p><h1 className="mt-2 text-3xl font-bold text-[#25483a]">{pet.name} is all set</h1><p className="mt-3 leading-7 text-stone-600">Your test payment was recorded and the application was submitted. Taking you to your dashboard…</p><div className="mx-auto mt-7 h-1.5 w-40 overflow-hidden rounded-full bg-[#f1e6d7]"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#25483a]" /></div></div></main>
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-5 py-7 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Brand />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="rounded-3xl border border-[#25483a]/10 bg-white p-6 shadow-sm sm:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4f2b]">Secure checkout</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#25483a]">Activate {pet.name}’s cover</h1>
            <p className="mt-3 text-stone-600">{livePaymentsEnabled ? 'Payment is handled securely by Paystack. KindredPaw never receives or stores your card details.' : 'This checkout is in presentation mode. No real charge will be made.'}</p>

            <div className="mt-8">
              <label htmlFor="payment-email" className="text-sm font-semibold text-stone-800">Receipt email</label>
              <input id="payment-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#25483a]/20 px-4 py-3 outline-none focus:border-[#25483a] focus:ring-4 focus:ring-[#25483a]/5" />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#25483a]/10 bg-[#faf6ee] p-4 text-sm leading-6 text-stone-700">
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 size-5 accent-[#25483a]" />
              <span>{livePaymentsEnabled ? `I authorize a recurring ${quote.billing} payment of ${formatCurrency(amount)} for the selected plan. I understand that cover begins only after payment verification and underwriting approval.` : `I confirm this ${quote.billing} test payment of ${formatCurrency(amount)}. No card will be charged in presentation mode.`}</span>
            </label>

            {error && <p role="alert" className="mt-5 rounded-xl border border-[#9a4f2b]/20 bg-[#f8ebdd] px-4 py-3 text-sm text-[#6f381f]">{error}</p>}

            <button type="button" onClick={beginPayment} disabled={!accepted || !email || loading} className="mt-7 w-full rounded-xl bg-[#25483a] px-6 py-4 font-bold text-white transition hover:bg-[#1d392e] disabled:cursor-not-allowed disabled:opacity-40">{loading ? 'Processing payment…' : livePaymentsEnabled ? `Pay ${formatCurrency(amount)} securely` : `Complete ${formatCurrency(amount)} test payment`}</button>
            <button type="button" onClick={() => navigate('/complete')} className="mt-5 w-full text-sm font-semibold text-stone-500 hover:text-[#25483a]">Back to application review</button>
          </section>

          <aside className="rounded-3xl bg-[#25483a] p-6 text-white shadow-xl lg:sticky lg:top-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9c7aa]">Order summary</p>
            <h2 className="mt-3 text-2xl font-bold">{quote.planName}</h2>
            <p className="mt-1 text-sm text-[#f1e6d7]">For {pet.name} · <span className="capitalize">{quote.billing} billing</span></p>
            <dl className="mt-7 space-y-4 border-y border-white/15 py-6 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-[#f1e6d7]">Premium</dt><dd className="font-bold">{formatCurrency(amount)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#f1e6d7]">Annual limit</dt><dd className="font-bold">{quote.annualLimit}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#f1e6d7]">Reimbursement</dt><dd className="font-bold">{quote.reimbursement}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#f1e6d7]">Deductible</dt><dd className="font-bold">{quote.deductible}</dd></div>
            </dl>
            <div className="mt-6 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-white/10">✓</span><p className="text-xs leading-5 text-[#f1e6d7]">{livePaymentsEnabled ? 'Transaction verification happens on the server before your application is submitted.' : 'Presentation mode records a successful test payment without charging a card.'}</p></div>
          </aside>
        </div>
      </div>
    </main>
  )
}
