import { useState } from 'react'
import Brand from './Brand'

const socialIcons = [
  ['Instagram', <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>],
  ['Facebook', <path d="M14.5 8H17V4.2c-.6-.1-1.9-.2-3.5-.2C10.3 4 8 5.9 8 9.5V12H5v4h3v8h4v-8h3.3l.7-4h-4V9.9c0-1.2.4-1.9 2.5-1.9Z" fill="currentColor" stroke="none" />],
  ['X', <path d="m5 4 14 16M19 4 5 20" />],
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer id="contact" className="bg-[#e9dfd0]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Brand />
          <div className="mt-5 flex gap-3 text-[#25483a]">
            {socialIcons.map(([name, icon]) => (
              <span key={name} role="img" aria-label={name} className="grid size-10 place-items-center rounded-full border border-[#25483a]/15 bg-white/50">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
              </span>
            ))}
          </div>
        </div>
        <div className="text-sm leading-7 text-stone-700">
          <p className="font-semibold text-[#25483a]">Talk to us</p>
          <a className="block transition hover:text-[#9a4f2b]" href="tel:+2347005463733">+234 700 KINDRED</a>
          <a className="block hover:text-[#25483a]" href="mailto:hello@kindredpaw.com">hello@kindredpaw.com</a>
        </div>
        <div className="text-sm leading-6 text-stone-700">
          <p className="mb-2 font-semibold text-[#25483a]">Visit us</p>
          <p>24 Palm Grove Avenue, Ikoyi, Lagos, Nigeria</p>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="newsletter" className="font-semibold text-[#25483a]">Subscribe to our newsletter</label>
          {subscribed ? <p className="mt-3 text-sm font-medium text-[#25483a]">Thanks — you’re on the list!</p> : (
            <div className="mt-3 flex">
              <input id="newsletter" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email" className="min-w-0 flex-1 rounded-l-xl border border-[#25483a]/20 bg-white px-3 py-2.5 outline-none focus:border-[#25483a]" />
              <button className="rounded-r-xl bg-[#25483a] px-4 text-sm font-semibold text-white">Subscribe</button>
            </div>
          )}
        </form>
      </div>
    </footer>
  )
}
