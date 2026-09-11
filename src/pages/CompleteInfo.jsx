import { Link } from 'react-router-dom'
import OnboardingShell from '../components/OnboardingShell'
import completed from '../../images/Completed.png'

export default function CompleteInfo() {
  return (
    <OnboardingShell step={3} title="You’re all set">
      <div className="flex flex-col items-center py-6 text-center">
        <div className="grid size-40 place-items-center rounded-full bg-green-50"><img src={completed} alt="Completed" className="w-28" /></div>
        <h2 className="mt-8 text-2xl font-bold text-red-950">Thanks for telling us about your pet.</h2>
        <p className="mt-3 max-w-lg leading-7 text-stone-600">Your information has been saved. We’re ready to help you find thoughtful cover for the care they deserve.</p>
        <Link to="/" className="mt-8 rounded-xl bg-red-950 px-7 py-3.5 font-semibold text-white">Return home</Link>
      </div>
    </OnboardingShell>
  )
}
