import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import FormField from '../components/FormField'
import authImage from '../../images/Female veterinarian with dog(1).jpg'
import twitter from '../../Icons/mdi_twitter.png'
import facebook from '../../Icons/ri_facebook-fill.png'
import linkedin from '../../Icons/ri_linkedin-fill.png'
import google from '../../Icons/flat-color-icons_google.png'
import useApplication from '../context/useApplication'

const providers = [['Twitter', twitter], ['Facebook', facebook], ['LinkedIn', linkedin], ['Google', google]]

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
    if (application.pet.name) navigate('/complete')
    else if (application.owner.name) navigate('/pet-info')
    else navigate('/owner-info')
  }

  const unavailable = (feature) => setNotice(`${feature} is not connected in this demo. Please continue with email.`)

  return (
    <main className="min-h-screen bg-[#f3e9e7] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-red-950 lg:block">
        <img src={authImage} alt="Veterinarian caring for a dog" className="absolute inset-0 size-full object-cover opacity-80 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/20 to-transparent" />
        <div className="absolute left-10 top-8"><Brand light /></div>
        <div className="absolute bottom-12 left-10 max-w-lg text-white">
          <p className="text-4xl font-bold leading-tight">Good care begins with peace of mind.</p>
          <p className="mt-4 text-red-100">Create your profile and tell us a little about the pet you love.</p>
        </div>
      </section>
      <section className="flex min-h-screen items-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-10 lg:hidden"><Brand /></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">{signup ? 'Join Maya' : 'Welcome back'}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-red-950">{signup ? 'Create your account' : 'Log in to your account'}</h1>
          <p className="mt-3 text-stone-600">{signup ? 'Start protecting your companion in a few simple steps.' : 'Continue managing your pet’s protection.'}</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {signup && <FormField label="Full name" id="name" type="text" autoComplete="name" required placeholder="Adedotun Prisca" value={form.name} onChange={update('name')} />}
            <FormField label="Email address" id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={update('email')} />
            <FormField label="Password" id="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength="6" placeholder="At least 6 characters" value={form.password} onChange={update('password')} />
            {!signup && <div className="text-right"><button type="button" onClick={() => unavailable('Password recovery')} className="text-sm font-semibold text-red-900 hover:underline">Forgot password?</button></div>}
            <button className="w-full rounded-xl bg-red-950 px-5 py-3.5 font-semibold text-white shadow-lg shadow-red-950/15 transition hover:bg-red-900">{signup ? 'Create account' : 'Log in'}</button>
          </form>
          <p className="my-7 text-center text-sm text-stone-600">or continue with</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {providers.map(([name, icon]) => <button key={name} type="button" onClick={() => unavailable(`${name} sign-in`)} aria-label={`Continue with ${name}`} className="flex items-center justify-center gap-2 rounded-xl border border-red-950/10 bg-white px-3 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-red-950/30"><img src={icon} alt="" className="size-5 object-contain" /><span className="hidden sm:inline">{name}</span></button>)}
          </div>
          {notice && <p role="status" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
          <p className="mt-8 text-center text-stone-600">
            {signup ? 'Already have an account?' : 'New to Maya?'}{' '}
            <Link to={signup ? '/login' : '/signup'} className="font-semibold text-red-950 hover:underline">{signup ? 'Log in' : 'Sign up'}</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
