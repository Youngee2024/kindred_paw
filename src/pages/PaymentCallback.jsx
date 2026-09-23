import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Brand from '../components/Brand'
import useApplication from '../context/useApplication'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const { recordPayment, submitApplication } = useApplication()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Confirming your payment with Paystack…')
  const reference = searchParams.get('reference') || searchParams.get('trxref') || ''

  useEffect(() => {
    if (!reference) return
    let active = true
    const verify = async () => {
      try {
        const response = await fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`)
        const payment = await response.json()
        if (!response.ok) throw new Error(payment.error || 'Payment verification failed.')
        if (!active) return
        recordPayment({ ...payment, receiptNumber: `RCP-${payment.reference.slice(-8)}` })
        submitApplication()
        sessionStorage.removeItem('kindredpaw-pending-payment')
        setStatus('success')
        setMessage('Payment verified and your application has been submitted.')
      } catch (error) {
        if (!active) return
        setStatus('error')
        setMessage(error.message)
      }
    }
    verify()
    return () => { active = false }
  }, [recordPayment, reference, submitApplication])

  if (!reference) {
    return <main className="min-h-screen bg-[#faf6ee] px-5 py-8"><div className="mx-auto max-w-3xl"><Brand /><div className="mt-20 rounded-3xl bg-white p-8 text-center"><h1 className="text-3xl font-bold text-[#25483a]">Payment reference missing</h1><Link to="/payment" className="mt-6 inline-flex rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">Return to payment</Link></div></div></main>
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#faf6ee] p-5">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className={`mx-auto grid size-20 place-items-center rounded-full text-3xl ${status === 'error' ? 'bg-[#f8ebdd] text-[#9a4f2b]' : 'bg-[#dce8dc] text-[#25483a]'}`}>{status === 'verifying' ? '…' : status === 'success' ? '✓' : '!'}</div>
        <h1 className="mt-6 text-3xl font-bold text-[#25483a]">{status === 'verifying' ? 'Verifying payment' : status === 'success' ? 'Payment successful' : 'Verification issue'}</h1>
        <p className="mt-3 leading-7 text-stone-600">{message}</p>
        <p className="mt-4 text-xs text-stone-400">Reference: {reference}</p>
        {status === 'success' && <div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/complete" className="rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">View confirmation</Link><Link to={`/receipt/${encodeURIComponent(reference)}`} className="rounded-xl border border-[#25483a]/20 px-6 py-3 font-semibold text-[#25483a]">View receipt</Link></div>}
        {status === 'error' && <div className="mt-7 flex justify-center gap-3"><Link to="/payment" className="rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">Try again</Link><a href="mailto:hello@kindredpaw.com" className="rounded-xl border border-[#25483a]/20 px-6 py-3 font-semibold text-[#25483a]">Get help</a></div>}
      </div>
    </main>
  )
}
