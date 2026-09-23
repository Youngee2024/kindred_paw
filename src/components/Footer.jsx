import { useState } from 'react'
import Brand from './Brand'
import instagram from '../../Icons/basil_instagram-solid.png'
import facebook from '../../Icons/ic_outline-facebook.png'
import twitter from '../../Icons/small mdi_twitter.png'

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
          <div className="mt-5 flex gap-4">
            {[instagram, facebook, twitter].map((icon, index) => <img key={icon} src={icon} alt={['Instagram', 'Facebook', 'Twitter'][index]} className="size-6 object-contain" />)}
          </div>
        </div>
        <div className="text-sm leading-7 text-stone-700">
          <p className="font-semibold text-[#25483a]">Talk to us</p>
          <a className="block hover:text-[#25483a]" href="tel:+2348035542112">+234 803 554 2112</a>
          <a className="block hover:text-[#25483a]" href="mailto:hello@kindredpaw.com">hello@kindredpaw.com</a>
        </div>
        <div className="text-sm leading-6 text-stone-700">
          <p className="mb-2 font-semibold text-[#25483a]">Visit us</p>
          <p>Plot 2 &amp; 3 Dapo Johnson Industrial Estate, Ogbomosho, Oyo State, Nigeria</p>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="newsletter" className="font-semibold text-[#25483a]">Subscribe to our newsletter</label>
          {subscribed ? <p className="mt-3 text-sm text-green-800">Thanks — you’re on the list!</p> : (
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
