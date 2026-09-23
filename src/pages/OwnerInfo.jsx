import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DraftStatus from '../components/DraftStatus'
import FormField from '../components/FormField'
import PhotoUpload from '../components/PhotoUpload'
import OnboardingShell from '../components/OnboardingShell'
import useApplication from '../context/useApplication'
import { validateOwner, validateOwnerField } from '../utils/formValidation'

export default function OwnerInfo() {
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const form = application.owner
  const [errors, setErrors] = useState({})

  const update = (field) => (event) => {
    updateSection('owner', (current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validateField = (field) => () => {
    setErrors((current) => ({ ...current, [field]: validateOwnerField(field, form[field]) }))
  }

  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (form.photo?.startsWith('blob:')) URL.revokeObjectURL(form.photo)
    updateSection('owner', (current) => ({ ...current, photo: URL.createObjectURL(file) }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateOwner(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    navigate('/pet-info')
  }

  return (
    <OnboardingShell step={1} title="Tell us about you" description="We’ll use these details to create your policy profile and stay in touch.">
      <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <PhotoUpload label="Upload your photo" preview={form.photo} onChange={choosePhoto} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormField label="Owner’s full name" id="owner-name" required autoComplete="name" value={form.name} onChange={update('name')} onBlur={validateField('name')} error={errors.name} placeholder="Adedotun Prisca" /></div>
          <FormField label="Email address" id="owner-email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} onBlur={validateField('email')} error={errors.email} placeholder="you@example.com" />
          <FormField label="Phone number" id="owner-phone" type="tel" required autoComplete="tel" inputMode="tel" value={form.phone} onChange={update('phone')} onBlur={validateField('phone')} error={errors.phone} hint="Nigerian mobile format: 08012345678 or +2348012345678" placeholder="080 1234 5678" />
          <div className="sm:col-span-2"><FormField label="Home address" id="owner-address" as="textarea" required autoComplete="street-address" value={form.address} onChange={update('address')} onBlur={validateField('address')} error={errors.address} placeholder="Enter your full address" /></div>
          <div className="sm:col-span-2 flex flex-col-reverse items-end justify-between gap-4 sm:flex-row sm:items-center"><DraftStatus value={form} /><button className="w-full rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white sm:w-auto">Save and continue</button></div>
        </div>
      </form>
    </OnboardingShell>
  )
}
