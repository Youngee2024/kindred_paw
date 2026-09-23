import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import useApplication from '../context/useApplication'

const formatCurrency = (value, currency = 'NGN') => new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
const formatDate = (value) => new Intl.DateTimeFormat('en-NG', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))

export default function Receipt() {
  const { reference } = useParams()
  const { application } = useApplication()
  const payment = application.payments.find((item) => item.reference === reference)

  if (!payment) return <main className="min-h-screen bg-[#faf6ee] px-5 py-8"><div className="mx-auto max-w-3xl"><Brand /><div className="mt-20 rounded-3xl bg-white p-8 text-center"><h1 className="text-3xl font-bold text-[#25483a]">Receipt not found</h1><p className="mt-3 text-stone-600">This receipt is not stored in this browser.</p><Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-[#25483a] px-6 py-3 font-semibold text-white">Return to dashboard</Link></div></div></main>

  return (
    <main className="min-h-screen bg-[#f6f1e8] p-5 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden"><Brand /><div className="flex gap-3"><Link to="/dashboard" className="rounded-xl border border-[#25483a]/20 px-4 py-2 text-sm font-semibold text-[#25483a]">Dashboard</Link><button type="button" onClick={() => window.print()} className="rounded-xl bg-[#25483a] px-4 py-2 text-sm font-semibold text-white">Print / Save PDF</button></div></div>
        <article className="rounded-3xl bg-white p-7 shadow-sm print:rounded-none print:shadow-none sm:p-12">
          <div className="flex flex-col justify-between gap-6 border-b border-[#25483a]/10 pb-8 sm:flex-row sm:items-start">
            <div><p className="text-2xl font-bold text-[#25483a]">KindredPaw</p><p className="mt-1 text-sm text-stone-500">Payment receipt</p></div>
            <div className="sm:text-right"><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Receipt number</p><p className="mt-1 font-bold text-[#25483a]">{payment.receiptNumber}</p></div>
          </div>
          <div className="py-10 text-center"><p className="text-sm text-stone-500">Amount paid</p><p className="mt-2 text-5xl font-bold text-[#25483a]">{formatCurrency(payment.amount, payment.currency)}</p><span className="mt-4 inline-flex rounded-full bg-[#dce8dc] px-4 py-1.5 text-xs font-bold text-[#25483a]">Payment successful</span></div>
          <dl className="grid gap-x-8 gap-y-6 border-y border-[#25483a]/10 py-8 text-sm sm:grid-cols-2">
            <div><dt className="text-stone-500">Payment reference</dt><dd className="mt-1 font-bold">{payment.reference}</dd></div>
            <div><dt className="text-stone-500">Payment date</dt><dd className="mt-1 font-bold">{formatDate(payment.paidAt || payment.recordedAt)}</dd></div>
            <div><dt className="text-stone-500">Customer email</dt><dd className="mt-1 font-bold">{payment.customerEmail}</dd></div>
            <div><dt className="text-stone-500">Payment channel</dt><dd className="mt-1 font-bold capitalize">{payment.channel}</dd></div>
            <div><dt className="text-stone-500">Pet</dt><dd className="mt-1 font-bold">{payment.petName}</dd></div>
            <div><dt className="text-stone-500">Coverage</dt><dd className="mt-1 font-bold">{payment.planName} · <span className="capitalize">{payment.billing}</span></dd></div>
          </dl>
          <div className="pt-8 text-xs leading-5 text-stone-500"><p>KindredPaw · 24 Palm Grove Avenue, Ikoyi, Lagos, Nigeria</p><p>Questions? hello@kindredpaw.com · +234 700 KINDRED</p></div>
        </article>
      </div>
    </main>
  )
}
