import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DraftStatus from '../components/DraftStatus'
import FormField from '../components/FormField'
import PhotoUpload from '../components/PhotoUpload'
import OnboardingShell from '../components/OnboardingShell'
import useApplication from '../context/useApplication'
import { today, validatePet, validatePetField, yearsAgo } from '../utils/formValidation'
import { breedsByType, petTypes, weights } from '../utils/petOptions'

export default function PetInfo() {
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const form = application.pet
  const [errors, setErrors] = useState({})
  const breedOptions = breedsByType[form.type] || [['', 'Choose a pet type first']]

  const update = (field) => (event) => {
    const value = event.target.value
    updateSection('pet', (current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const changeType = (event) => {
    const type = event.target.value
    updateSection('pet', (current) => ({ ...current, type, breed: '' }))
    setErrors((current) => ({ ...current, type: '', breed: '' }))
  }

  const validateField = (field) => () => {
    setErrors((current) => ({ ...current, [field]: validatePetField(field, form[field], form) }))
  }

  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (form.photo?.startsWith('blob:')) URL.revokeObjectURL(form.photo)
    updateSection('pet', (current) => ({ ...current, photo: URL.createObjectURL(file) }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validatePet(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    navigate('/quote')
  }

  return (
    <OnboardingShell step={2} title="Now, meet your pet" description="A few health details help us understand the right protection for your companion.">
      <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <PhotoUpload label="Upload pet photo" preview={form.photo} onChange={choosePhoto} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Pet’s name" id="pet-name" required maxLength="40" value={form.name} onChange={update('name')} onBlur={validateField('name')} error={errors.name} placeholder="e.g. Milo" />
          <FormField label="Pet type" id="pet-type" as="select" required options={petTypes} value={form.type} onChange={changeType} onBlur={validateField('type')} error={errors.type} />
          <FormField label="Breed" id="pet-breed" as="select" required disabled={!form.type} options={breedOptions} value={form.breed} onChange={update('breed')} onBlur={validateField('breed')} error={errors.breed} />
          <FormField label="Birthday" id="pet-birthday" type="date" required min={yearsAgo(40)} max={today()} value={form.birthday} onChange={update('birthday')} onBlur={validateField('birthday')} error={errors.birthday} hint="Future dates and dates over 40 years ago are not accepted." />
          <FormField label="Weight" id="pet-weight" as="select" required options={weights} value={form.weight} onChange={update('weight')} onBlur={validateField('weight')} error={errors.weight} />
          <FormField label="Currently on medication?" id="pet-medication" as="select" required options={[["", "Select an option"], ["yes", "Yes"], ["no", "No"]]} value={form.medication} onChange={update('medication')} onBlur={validateField('medication')} error={errors.medication} />
          {form.medication === 'yes' && <div className="sm:col-span-2"><FormField label="Medication details" id="medication-details" as="textarea" required maxLength="500" value={form.medicationDetails} onChange={update('medicationDetails')} onBlur={validateField('medicationDetails')} error={errors.medicationDetails} hint="Include the medication name and dosage." placeholder="Tell us the medicine and dosage" /></div>}
          <div className="sm:col-span-2"><FormField label="Any surgery in the past?" id="pet-surgery" as="textarea" maxLength="500" value={form.surgery} onChange={update('surgery')} placeholder="Add details, or leave blank if none" /></div>
          <div className="sm:col-span-2 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <DraftStatus value={form} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => navigate('/owner-info')} className="rounded-xl border border-[#25483a]/20 px-7 py-3.5 font-semibold text-[#25483a]">Back</button><button className="rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white">Save and continue</button></div>
          </div>
        </div>
      </form>
    </OnboardingShell>
  )
}
