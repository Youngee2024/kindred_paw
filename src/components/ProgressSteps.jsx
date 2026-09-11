const labels = ["Owner's information", "Pet's information", 'Completed']

export default function ProgressSteps({ current }) {
  return (
    <div className="mx-auto mb-12 max-w-4xl" aria-label={`Step ${current} of 3`}>
      <div className="flex items-center">
        {labels.map((label, index) => {
          const step = index + 1
          const done = step <= current
          return (
            <div key={label} className={`flex items-center ${index < labels.length - 1 ? 'flex-1' : ''}`}>
              <div className="relative flex flex-col items-center">
                <span className={`grid size-10 place-items-center rounded-full text-sm font-bold ${done ? 'bg-red-950 text-white' : 'bg-stone-200 text-stone-500'}`}>{done && step < current ? '✓' : step}</span>
                <span className="absolute top-12 w-28 text-center text-xs font-medium text-stone-600 sm:w-40 sm:text-sm">{label}</span>
              </div>
              {index < labels.length - 1 && <div className={`h-2 flex-1 ${step < current ? 'bg-red-950' : 'bg-stone-200'}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
