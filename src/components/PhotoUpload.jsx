import { useId, useRef, useState } from 'react'
import { acceptedImageTypes, validateImage } from '../utils/formValidation'

export default function PhotoUpload({ label, preview, onChange }) {
  const input = useRef(null)
  const id = useId()
  const [error, setError] = useState('')

  const validateAndChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const nextError = validateImage(file)
    setError(nextError)
    if (nextError) {
      event.target.value = ''
      return
    }
    onChange(event)
  }

  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => input.current?.click()} className={`grid aspect-square w-48 place-items-center overflow-hidden rounded-full border-2 border-dashed bg-[#f8ebdd] text-center text-sm font-semibold text-[#25483a] transition hover:bg-[#f3dec8] lg:w-60 ${error ? 'border-[#a84425]' : 'border-[#25483a]/40'}`} aria-describedby={`${id}-${error ? 'error' : 'hint'}`}>
        {preview ? <img src={preview} alt="Selected upload preview" className="size-full object-cover" /> : <span className="px-8"><span className="mb-2 block text-3xl">+</span>{label}</span>}
      </button>
      <input ref={input} type="file" accept={acceptedImageTypes.join(',')} onChange={validateAndChange} className="sr-only" />
      {preview && <button type="button" onClick={() => input.current?.click()} className="mt-3 text-sm font-semibold text-[#25483a] underline">Change photo</button>}
      {error ? <p id={`${id}-error`} role="alert" className="mt-3 max-w-56 text-center text-xs font-semibold text-[#a84425]">{error}</p> : <p id={`${id}-hint`} className="mt-3 max-w-56 text-center text-xs leading-5 text-stone-500">JPG, PNG, or WebP. Maximum 5 MB.</p>}
    </div>
  )
}
