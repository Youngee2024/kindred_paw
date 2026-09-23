import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import PhotoUpload from '../components/PhotoUpload'
import OnboardingShell from '../components/OnboardingShell'
import useApplication from '../context/useApplication'

export default function OwnerInfo() {
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const form = application.owner
  const update = (field) => (event) => updateSection('owner', (current) => ({ ...current, [field]: event.target.value }))
  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    if (file) updateSection('owner', (current) => ({ ...current, photo: URL.createObjectURL(file) }))
  }
  const submit = (event) => { event.preventDefault(); navigate('/pet-info') }

  return (
    <OnboardingShell step={1} title="Tell us about you" description="We’ll use these details to create your policy profile and stay in touch.">
      <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <PhotoUpload label="Upload your photo" preview={form.photo} onChange={choosePhoto} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormField label="Owner’s full name" id="owner-name" required value={form.name} onChange={update('name')} placeholder="Adedotun Prisca" /></div>
          <FormField label="Email address" id="owner-email" type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
          <FormField label="Phone number" id="owner-phone" type="tel" required value={form.phone} onChange={update('phone')} placeholder="070 3443 3744" />
          <div className="sm:col-span-2"><FormField label="Home address" id="owner-address" as="textarea" required value={form.address} onChange={update('address')} placeholder="Enter your address" /></div>
          <div className="sm:col-span-2 flex justify-end"><button className="w-full rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white sm:w-auto">Save and continue</button></div>
        </div>
      </form>
    </OnboardingShell>
  )
}
