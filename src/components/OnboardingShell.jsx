import Brand from './Brand'
import ProgressSteps from './ProgressSteps'

export default function OnboardingShell({ step, title, description, children }) {
  return (
    <main className="min-h-screen bg-[#fffaf2] px-5 py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Brand />
        <div className="py-12 sm:py-16">
          <ProgressSteps current={step} />
          <div className="mx-auto mt-20 max-w-5xl rounded-3xl border border-red-950/10 bg-white p-6 shadow-xl shadow-red-950/5 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">Step {step} of 3</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-red-950 sm:text-4xl">{title}</h1>
              {description && <p className="mt-3 max-w-2xl text-stone-600">{description}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
