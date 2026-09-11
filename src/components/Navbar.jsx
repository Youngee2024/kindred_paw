import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'

const links = [
  ['Home', '/'],
  ['Services', '/#services'],
  ['Testimonies', '/#testimonies'],
  ['Contact', '/#contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const linkClass = 'rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-red-50 hover:text-red-950'

  return (
    <header className="sticky top-0 z-50 border-b border-red-950/10 bg-[#fffaf2]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
        <Brand />
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => href === '/' ? (
            <NavLink key={label} to={href} className={({ isActive }) => `${linkClass} ${isActive ? 'text-red-950' : ''}`}>{label}</NavLink>
          ) : <a key={label} href={href} className={linkClass}>{label}</a>)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-red-950">Log in</Link>
          <Link to="/signup" className="rounded-xl bg-red-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-900">Get started</Link>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-xl border border-red-950/15 text-2xl text-red-950 md:hidden" aria-label="Toggle navigation" aria-expanded={open}>☰</button>
      </nav>
      {open && (
        <div className="border-t border-red-950/10 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className={linkClass}>{label}</a>)}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/login" className="rounded-xl border border-red-950 px-4 py-2.5 text-center font-semibold text-red-950">Log in</Link>
              <Link to="/signup" className="rounded-xl bg-red-950 px-4 py-2.5 text-center font-semibold text-white">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
