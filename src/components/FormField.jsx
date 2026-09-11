const controlClass = 'mt-2 w-full rounded-xl border border-red-950/20 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-red-900 focus:ring-4 focus:ring-red-950/5'

export default function FormField({ label, id, as = 'input', options, ...props }) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
      {label}
      {as === 'select' ? (
        <select id={id} className={controlClass} {...props}>
          {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={id} className={`${controlClass} min-h-28 resize-y`} {...props} />
      ) : <input id={id} className={controlClass} {...props} />}
    </label>
  )
}
