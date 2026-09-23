import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import FormField from '../components/FormField'
import authImage from '../assets/kindredpaw-vet.jpg'
import useApplication from '../context/useApplication'

const providers = ['X', 'Facebook', 'LinkedIn', 'Google']

function ProviderIcon({ name }) {
  if (name === 'X') return <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m5 4 14 16M19 4 5 20" /></svg>
  if (name === 'Facebook') return <span className="text-lg font-black leading-none" aria-hidden="true">f</span>
  if (name === 'LinkedIn') return <span className="text-xs font-black leading-none" aria-hidden="true">in</span>
  return <span className="text-sm font-black leading-none" aria-hidden="true">G</span>
}

export default function AuthPage({ mode }) {
  const signup = mode === 'signup'
  const navigate = useNavigate()
  const { application, updateSection } = useApplication()
  const [form, setForm] = useState({ name: application.account.name, email: application.account.email, password: '' })
  const [notice, setNotice] = useState('')
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    updateSection('account', { name: form.name, email: form.email })
    if (signup) {
      updateSection('owner', (owner) => ({
        ...owner,
        name: owner.name || form.name,
        email: owner.email || form.email,
      }))
      navigate('/owner-info')
      return
    }
    if (application.applications.length || application.pets.length) navigate('/dashboard')
    else if (application.pet.name) navigate('/complete')
    else if (application.owner.name) navigate('/pet-info')
    else navigate('/owner-info')
  }

  const unavailable = (feature) => setNotice(`${feature} is not connected in this demo. Please continue with email.`)

  return (
    <main className="min-h-screen bg-[#f1e6d7] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#25483a] lg:block">
        <img src={authImage} alt="Veterinarian caring for a dog" className="absolute inset-0 size-full object-cover opacity-80 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#25483a] via-[#25483a]/20 to-transparent" />
        <div className="absolute left-10 top-8"><Brand light /></div>
        <div className="absolute bottom-12 left-10 max-w-lg text-white">
          <p className="text-4xl font-bold leading-tight">Good care begins with peace of mind.</p>
          <p className="mt-4 text-[#f1e6d7]">Create your profile and tell us a little about the pet you love.</p>
        </div>
      </section>
      <section className="flex min-h-screen items-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-10 lg:hidden"><Brand /></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">{signup ? 'Join KindredPaw' : 'Welcome back'}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#25483a]">{signup ? 'Create your account' : 'Log in to your account'}</h1>
          <p className="mt-3 text-stone-600">{signup ? 'Start protecting your companion in a few simple steps.' : 'Continue managing your pet’s protection.'}</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {signup && <FormField label="Full name" id="name" type="text" autoComplete="name" required placeholder="Adedotun Prisca" value={form.name} onChange={update('name')} />}
            <FormField label="Email address" id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={update('email')} />
            <FormField label="Password" id="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength="6" placeholder="At least 6 characters" value={form.password} onChange={update('password')} />
            {!signup && <div className="text-right"><button type="button" onClick={() => unavailable('Password recovery')} className="text-sm font-semibold text-[#9a4f2b] hover:underline">Forgot password?</button></div>}
            <button className="w-full rounded-xl bg-[#25483a] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#25483a]/15 transition hover:bg-[#1d392e]">{signup ? 'Create account' : 'Log in'}</button>
          </form>
          <p className="my-7 text-center text-sm text-stone-600">or continue with</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {providers.map((name) => <button key={name} type="button" onClick={() => unavailable(`${name} sign-in`)} aria-label={`Continue with ${name}`} className="flex items-center justify-center gap-2 rounded-xl border border-[#25483a]/10 bg-white px-3 py-3 text-sm font-semibold text-[#25483a] shadow-sm transition hover:border-[#25483a]/30 hover:bg-[#f8ebdd]"><span className="grid size-6 place-items-center rounded-full bg-[#f3dec8]"><ProviderIcon name={name} /></span><span className="hidden sm:inline">{name}</span></button>)}
          </div>
          {notice && <p role="status" className="mt-4 rounded-xl border border-[#9a4f2b]/20 bg-[#f8ebdd] px-4 py-3 text-sm text-[#6f381f]">{notice}</p>}
          <p className="mt-8 text-center text-stone-600">
            {signup ? 'Already have an account?' : 'New to KindredPaw?'}{' '}
            <Link to={signup ? '/login' : '/signup'} className="font-semibold text-[#25483a] hover:underline">{signup ? 'Log in' : 'Sign up'}</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
