import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 font-semibold ${light ? 'text-white' : 'text-red-950'}`}>
      <span className={`grid size-10 place-items-center rounded-xl text-sm font-bold ${light ? 'bg-white text-red-950' : 'bg-red-950 text-white'}`}>MI</span>
      <span className="text-lg tracking-tight">Maya Insurance</span>
    </Link>
  )
}
