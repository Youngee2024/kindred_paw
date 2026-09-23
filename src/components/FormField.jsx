const controlClass = 'mt-2 w-full rounded-xl border border-[#25483a]/20 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#25483a] focus:ring-4 focus:ring-[#25483a]/5'

export default function FormField({ label, id, as = 'input', options, error, hint, ...props }) {
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  const classes = `${controlClass} ${error ? 'border-[#a84425] bg-[#fffaf7] focus:border-[#a84425] focus:ring-[#a84425]/10' : ''}`
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
      {label}
      {as === 'select' ? (
        <select id={id} className={classes} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props}>
          {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={id} className={`${classes} min-h-28 resize-y`} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />
      ) : <input id={id} className={classes} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />}
      {error && <span id={`${id}-error`} className="mt-2 block text-xs font-semibold text-[#a84425]">{error}</span>}
      {!error && hint && <span id={`${id}-hint`} className="mt-2 block text-xs font-normal leading-5 text-stone-500">{hint}</span>}
    </label>
  )
}
