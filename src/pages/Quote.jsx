import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OnboardingShell from '../components/OnboardingShell'
import useApplication from '../context/useApplication'
import { calculateQuotes } from '../utils/quoteCalculator'

const formatCurrency = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value)

export default function Quote() {
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const { pet, quote } = application
  const result = useMemo(() => calculateQuotes(pet), [pet])
  const [billing, setBilling] = useState(quote.billing || 'monthly')
  const [selectedId, setSelectedId] = useState(quote.planId || '')
  const petComplete = pet.name && pet.type && pet.breed && pet.birthday && pet.weight && pet.medication

  if (!petComplete) {
    return (
      <OnboardingShell step={3} title="Get your quote" description="Complete your pet’s information before comparing cover.">
        <div className="rounded-2xl bg-[#f8ebdd] p-6 text-[#6f381f]">
          <p className="font-bold">Pet details are incomplete.</p>
          <Link to="/pet-info" className="mt-4 inline-flex rounded-xl bg-[#25483a] px-5 py-3 font-semibold text-white">Complete pet details</Link>
        </div>
      </OnboardingShell>
    )
  }

  const choosePlan = (plan) => {
    setSelectedId(plan.id)
    updateSection('quote', {
      planId: plan.id,
      planName: plan.name,
      billing,
      monthlyPremium: plan.monthlyPremium,
      annualPremium: plan.annualPremium,
      annualLimit: plan.annualLimit,
      reimbursement: plan.reimbursement,
      deductible: plan.deductible,
      calculatedAt: new Date().toISOString(),
      ageAtQuote: result.age,
      riskFactor: result.riskFactor,
    })
  }

  const changeBilling = (value) => {
    setBilling(value)
    if (selectedId) {
      const plan = result.plans.find((item) => item.id === selectedId)
      updateSection('quote', (current) => ({ ...current, billing: value, monthlyPremium: plan.monthlyPremium, annualPremium: plan.annualPremium }))
    }
  }

  return (
    <OnboardingShell step={3} title={`Choose cover for ${pet.name}`} description="Compare benefits and select the protection that fits your priorities.">
      <div className="rounded-2xl border border-[#25483a]/10 bg-[#faf6ee] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="text-sm font-bold text-[#25483a]">Your personalised estimate</p><p className="mt-1 text-sm text-stone-600">Based on {pet.name}’s age, breed and health information.</p></div>
          <div className="inline-flex self-start rounded-xl bg-white p-1 shadow-sm">
            {['monthly', 'annual'].map((value) => <button key={value} type="button" onClick={() => changeBilling(value)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${billing === value ? 'bg-[#25483a] text-white' : 'text-stone-600'}`}>{value}{value === 'annual' && <span className="ml-1 text-[10px]">-10%</span>}</button>)}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {result.plans.map((plan) => {
          const selected = selectedId === plan.id
          const price = billing === 'monthly' ? plan.monthlyPremium : plan.annualPremium
          return (
            <article key={plan.id} className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 transition ${selected ? 'border-[#25483a] shadow-xl shadow-[#25483a]/10' : 'border-[#25483a]/10 hover:border-[#25483a]/30'}`}>
              {plan.popular && <span className="absolute -top-3 left-6 rounded-full bg-[#9a4f2b] px-3 py-1 text-xs font-bold text-white">Most popular</span>}
              <h2 className="text-xl font-bold text-[#25483a]">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">{plan.description}</p>
              <div className="mt-5 border-y border-[#25483a]/10 py-5">
                <p className="text-3xl font-bold text-[#25483a]">{formatCurrency(price)}</p>
                <p className="mt-1 text-xs text-stone-500">per {billing === 'monthly' ? 'month' : 'year'} {billing === 'annual' && '— billed annually'}</p>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-stone-500">Annual limit</dt><dd className="mt-1 font-bold">{plan.annualLimit}</dd></div>
                <div><dt className="text-stone-500">We reimburse</dt><dd className="mt-1 font-bold">{plan.reimbursement}</dd></div>
                <div className="col-span-2"><dt className="text-stone-500">Annual deductible</dt><dd className="mt-1 font-bold">{plan.deductible}</dd></div>
              </dl>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-stone-700">
                {plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><span className="font-bold text-[#9a4f2b]">✓</span>{benefit}</li>)}
              </ul>
              <button type="button" onClick={() => choosePlan(plan)} className={`mt-7 w-full rounded-xl px-5 py-3 font-bold transition ${selected ? 'bg-[#25483a] text-white' : 'border border-[#25483a]/20 text-[#25483a] hover:bg-[#f3dec8]'}`}>{selected ? 'Selected' : `Choose ${plan.name}`}</button>
            </article>
          )
        })}
      </div>

      <details className="mt-7 rounded-2xl border border-[#25483a]/10 bg-white p-5">
        <summary className="cursor-pointer font-bold text-[#25483a]">How we estimated this quote</summary>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {result.factors.map(([label, detail, factor]) => <div key={`${label}-${detail}`} className="rounded-xl bg-[#faf6ee] p-3"><p className="text-stone-500">{label}</p><p className="mt-1 font-semibold">{detail} <span className="text-xs text-stone-400">×{factor}</span></p></div>)}
        </div>
      </details>

      <div className="mt-7 rounded-2xl bg-[#f8ebdd] p-4 text-xs leading-5 text-[#6f381f]">
        This is an illustrative estimate for the KindredPaw prototype, not a binding insurance offer. Final pricing, eligibility, exclusions and waiting periods require underwriting review.
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={() => navigate('/pet-info')} className="rounded-xl border border-[#25483a]/20 px-7 py-3.5 font-semibold text-[#25483a]">Back to pet details</button>
        <button type="button" onClick={() => navigate('/complete')} disabled={!selectedId} className="rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Continue with selected plan</button>
      </div>
    </OnboardingShell>
  )
}
