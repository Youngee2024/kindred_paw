import { useDeferredValue } from 'react'

export default function DraftStatus({ value }) {
  const deferredValue = useDeferredValue(value)
  const status = deferredValue !== value ? 'Saving draft…' : 'Draft saved automatically'

  return <p role="status" className="text-xs font-semibold text-stone-500"><span className="mr-1 text-[#25483a]">●</span>{status}</p>
}
