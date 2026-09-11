import { useRef } from 'react'

export default function PhotoUpload({ label, preview, onChange }) {
  const input = useRef(null)
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => input.current?.click()} className="grid aspect-square w-48 place-items-center overflow-hidden rounded-full border-2 border-dashed border-red-900/40 bg-red-50 text-center text-sm font-semibold text-red-950 transition hover:bg-red-100 lg:w-60">
        {preview ? <img src={preview} alt="Selected upload preview" className="size-full object-cover" /> : <span className="px-8"><span className="mb-2 block text-3xl">＋</span>{label}</span>}
      </button>
      <input ref={input} type="file" accept="image/*" onChange={onChange} className="sr-only" />
      {preview && <button type="button" onClick={() => input.current?.click()} className="mt-3 text-sm font-semibold text-red-950 underline">Change photo</button>}
    </div>
  )
}
