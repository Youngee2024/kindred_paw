import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import PhotoUpload from '../components/PhotoUpload'
import OnboardingShell from '../components/OnboardingShell'
import useApplication from '../context/useApplication'

const petTypes = [['', 'Select pet type'], ['dog', 'Dog'], ['cat', 'Cat']]
const dogBreeds = [['', 'Select breed'], ['german-shepherd', 'German Shepherd'], ['bulldog', 'Bulldog'], ['mixed', 'Mixed breed'], ['other', 'Other']]
const weights = [['', 'Select weight'], ['0-10', 'Up to 10 kg'], ['11-15', '11–15 kg'], ['16-20', '16–20 kg'], ['21-25', '21–25 kg'], ['25+', 'Over 25 kg']]

export default function PetInfo() {
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const form = application.pet
  const update = (field) => (event) => updateSection('pet', (current) => ({ ...current, [field]: event.target.value }))
  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    if (file) updateSection('pet', (current) => ({ ...current, photo: URL.createObjectURL(file) }))
  }
  const submit = (event) => { event.preventDefault(); navigate('/complete') }

  return (
    <OnboardingShell step={2} title="Now, meet your pet" description="A few health details help us understand the right protection for your companion.">
      <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <PhotoUpload label="Upload pet photo" preview={form.photo} onChange={choosePhoto} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Pet’s name" id="pet-name" required value={form.name} onChange={update('name')} placeholder="e.g. Milo" />
          <FormField label="Pet type" id="pet-type" as="select" required options={petTypes} value={form.type} onChange={update('type')} />
          <FormField label="Breed" id="pet-breed" as="select" required options={dogBreeds} value={form.breed} onChange={update('breed')} />
          <FormField label="Birthday" id="pet-birthday" type="date" required value={form.birthday} onChange={update('birthday')} />
          <FormField label="Weight" id="pet-weight" as="select" required options={weights} value={form.weight} onChange={update('weight')} />
          <FormField label="Currently on medication?" id="pet-medication" as="select" required options={[['', 'Select an option'], ['yes', 'Yes'], ['no', 'No']]} value={form.medication} onChange={update('medication')} />
          {form.medication === 'yes' && <div className="sm:col-span-2"><FormField label="Medication details" id="medication-details" as="textarea" required value={form.medicationDetails} onChange={update('medicationDetails')} placeholder="Tell us the medicine and dosage" /></div>}
          <div className="sm:col-span-2"><FormField label="Any surgery in the past?" id="pet-surgery" as="textarea" value={form.surgery} onChange={update('surgery')} placeholder="Add details, or leave blank if none" /></div>
          <div className="sm:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate('/owner-info')} className="rounded-xl border border-[#25483a]/20 px-7 py-3.5 font-semibold text-[#25483a]">Back</button>
            <button className="rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white">Save and continue</button>
          </div>
        </div>
      </form>
    </OnboardingShell>
  )
}
