import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 font-semibold ${light ? 'text-white' : 'text-[#25483a]'}`}>
      <span className={`grid size-10 place-items-center rounded-full text-sm font-bold ${light ? 'bg-white text-[#25483a]' : 'bg-[#25483a] text-white'}`}>KP</span>
      <span className="text-lg tracking-tight">KindredPaw</span>
    </Link>
  )
}
