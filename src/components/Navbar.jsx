import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'

const links = [
  ['Home', '/'],
  ['How it works', '/#how-it-works'],
  ['Coverage', '/#services'],
  ['FAQ', '/#faq'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const linkClass = 'rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-[#f8ebdd] hover:text-[#25483a]'

  return (
    <header className="sticky top-0 z-50 border-b border-[#25483a]/10 bg-[#faf6ee]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
        <Brand />
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => href === '/' ? (
            <NavLink key={label} to={href} className={({ isActive }) => `${linkClass} ${isActive ? 'text-[#25483a]' : ''}`}>{label}</NavLink>
          ) : <a key={label} href={href} className={linkClass}>{label}</a>)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-[#25483a]">Log in</Link>
          <Link to="/signup" className="rounded-xl bg-[#25483a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d392e]">Get started</Link>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-xl border border-[#25483a]/15 text-[#25483a] md:hidden" aria-label="Toggle navigation" aria-expanded={open}>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
          </span>
        </button>
      </nav>
      {open && (
        <div className="border-t border-[#25483a]/10 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className={linkClass}>{label}</a>)}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/login" className="rounded-xl border border-[#25483a] px-4 py-2.5 text-center font-semibold text-[#25483a]">Log in</Link>
              <Link to="/signup" className="rounded-xl bg-[#25483a] px-4 py-2.5 text-center font-semibold text-white">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
