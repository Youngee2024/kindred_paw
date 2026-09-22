import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OnboardingShell from '../components/OnboardingShell'
import completed from '../../images/Completed.png'
import useApplication from '../context/useApplication'

function SummaryCard({ title, editTo, children }) {
  return (
    <section className="rounded-2xl border border-red-950/10 bg-[#fffaf2] p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-red-950">{title}</h2>
        <Link to={editTo} className="text-sm font-semibold text-red-900 underline">Edit</Link>
      </div>
      <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function Detail({ label, value }) {
  return <div><dt className="text-stone-500">{label}</dt><dd className="mt-1 font-semibold text-stone-900">{value || 'Not provided'}</dd></div>
}

export default function CompleteInfo() {
  const navigate = useNavigate()
  const { application, submitApplication, resetApplication } = useApplication()
  const [confirmed, setConfirmed] = useState(false)
  const { owner, pet, submitted, reference } = application
  const ownerComplete = owner.name && owner.email && owner.phone && owner.address
  const petComplete = pet.name && pet.type && pet.breed && pet.birthday && pet.weight && pet.medication

  const restart = () => {
    resetApplication()
    navigate('/')
  }

  if (!ownerComplete || !petComplete) {
    return (
      <OnboardingShell step={3} title="Finish your application" description="A few required details are still missing.">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="text-xl font-bold">Your application is not ready yet</h2>
          <p className="mt-2">Complete the sections below before submitting.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!ownerComplete && <Link to="/owner-info" className="rounded-xl bg-red-950 px-5 py-3 font-semibold text-white">Complete owner details</Link>}
            {!petComplete && <Link to="/pet-info" className="rounded-xl bg-red-950 px-5 py-3 font-semibold text-white">Complete pet details</Link>}
          </div>
        </div>
      </OnboardingShell>
    )
  }

  if (!submitted) {
    return (
      <OnboardingShell step={3} title="Review your application" description="Check everything carefully, then submit your details.">
        <div className="space-y-6">
          <SummaryCard title="Owner details" editTo="/owner-info">
            <Detail label="Full name" value={owner.name} />
            <Detail label="Email" value={owner.email} />
            <Detail label="Phone" value={owner.phone} />
            <Detail label="Address" value={owner.address} />
          </SummaryCard>
          <SummaryCard title="Pet details" editTo="/pet-info">
            <Detail label="Name" value={pet.name} />
            <Detail label="Type" value={pet.type} />
            <Detail label="Breed" value={pet.breed} />
            <Detail label="Birthday" value={pet.birthday} />
            <Detail label="Weight" value={`${pet.weight} kg`} />
            <Detail label="On medication" value={pet.medication} />
            {pet.medication === 'yes' && <Detail label="Medication details" value={pet.medicationDetails} />}
            <Detail label="Past surgery" value={pet.surgery || 'None reported'} />
          </SummaryCard>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-950/10 p-4 text-sm text-stone-700">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 size-5 accent-red-950" />
            <span>I confirm that the information above is complete and accurate.</span>
          </label>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => navigate('/pet-info')} className="rounded-xl border border-red-950/20 px-7 py-3.5 font-semibold text-red-950">Back</button>
            <button type="button" onClick={submitApplication} disabled={!confirmed} className="rounded-xl bg-red-950 px-7 py-3.5 font-semibold text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-40">Submit application</button>
          </div>
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell step={3} title="You’re all set" description="Your application has been submitted successfully.">
      <div className="flex flex-col items-center py-6 text-center">
        <div className="grid size-40 place-items-center rounded-full bg-green-50"><img src={completed} alt="Completed" className="w-28" /></div>
        <h2 className="mt-8 text-2xl font-bold text-red-950">Thanks for telling us about your pet.</h2>
        <p className="mt-3 max-w-lg leading-7 text-stone-600">We saved your application and will use it to help find thoughtful cover for {pet.name}.</p>
        <div className="mt-6 rounded-xl bg-[#fffaf2] px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Application reference</p>
          <p className="mt-1 text-xl font-bold tracking-wider text-red-950">{reference}</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-xl border border-red-950/20 px-7 py-3.5 font-semibold text-red-950">Return home</Link>
          <button type="button" onClick={restart} className="rounded-xl bg-red-950 px-7 py-3.5 font-semibold text-white">Start another application</button>
        </div>
      </div>
    </OnboardingShell>
  )
}
