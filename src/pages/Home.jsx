import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroImage from '../assets/kindredpaw-hero.jpg'
import vetImage from '../assets/kindredpaw-vet.jpg'

const trustPoints = [
  ['Clear cover', 'Know what is included before you choose.'],
  ['Flexible protection', 'Select care that fits your pet and budget.'],
  ['Human support', 'Get help from people who understand pet care.'],
]

const steps = [
  ['01', 'Tell us about your pet', 'Share a few details about their age, breed and health.'],
  ['02', 'Choose your protection', 'Review straightforward options and select the right level of cover.'],
  ['03', 'Care with confidence', 'Keep their policy details close whenever veterinary care is needed.'],
]

const services = [
  ['✚', 'Accidents and illness', 'Support for unexpected injuries, infections, allergies and ongoing conditions.'],
  ['⌁', 'Surgery and hospital stays', 'Help with eligible procedures, emergency treatment and overnight care.'],
  ['◇', 'Medication and tests', 'Cover for eligible prescriptions, blood tests, X-rays and ultrasound scans.'],
  ['♡', 'Specialist therapies', 'Support for eligible rehabilitation, physiotherapy and hereditary conditions.'],
]

const faqs = [
  ['What pets can I cover?', 'KindredPaw is designed for cats and dogs. Available cover may depend on your pet’s age, breed and medical history.'],
  ['Can I use my regular veterinarian?', 'The experience is designed to let you continue using your trusted licensed veterinarian, subject to the terms of your selected plan.'],
  ['Are existing conditions covered?', 'Pre-existing conditions are normally reviewed separately. Your final policy documents will clearly explain exclusions and waiting periods.'],
  ['How long does an application take?', 'The online application only takes a few minutes. You can save your progress, review every detail and submit when you are ready.'],
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-stone-900">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden border-b border-[#25483a]/10">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_20%,#ead9c5_0%,transparent_38%),linear-gradient(135deg,#faf6ee_0%,#f1e6d7_100%)]" />
          <div className="absolute -right-24 top-16 -z-10 size-[520px] rounded-full border-[80px] border-white/40" />
          <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#25483a]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#25483a] shadow-sm">
                <span className="size-2 rounded-full bg-[#9a4f2b]" />
                Thoughtful cover for cats and dogs
              </div>
              <h1 className="mt-7 text-5xl font-bold leading-[1.03] tracking-[-0.04em] text-[#25483a] sm:text-6xl lg:text-7xl">More care. Less worry. More life together.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">Simple pet insurance for the everyday mishaps and bigger moments—so decisions about their care can stay focused on what matters.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className="rounded-xl bg-[#25483a] px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-[#25483a]/15 transition hover:-translate-y-0.5 hover:bg-[#1d392e]">Get my pet covered</Link>
                <a href="#how-it-works" className="rounded-xl border border-[#25483a]/20 bg-white/70 px-7 py-3.5 text-center font-semibold text-[#25483a] transition hover:bg-white">See how it works</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-600">
                <span className="flex items-center gap-2"><span className="text-[#9a4f2b]">✓</span> Takes only a few minutes</span>
                <span className="flex items-center gap-2"><span className="text-[#9a4f2b]">✓</span> Save and continue later</span>
              </div>
            </div>

            <div className="relative mx-auto min-h-[500px] w-full max-w-xl lg:min-h-[590px]">
              <div className="absolute bottom-16 left-4 z-20 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur sm:left-0">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-[#dce8dc] text-[#25483a]">✓</span>
                  <div><p className="font-bold text-[#25483a]">Easy to start</p><p className="text-xs text-stone-500">One clear application</p></div>
                </div>
              </div>
              <div className="absolute right-2 top-20 z-20 rounded-2xl bg-[#25483a] px-5 py-4 text-white shadow-xl sm:right-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#e9c7aa]">Made for</p>
                <p className="mt-1 text-lg font-bold">Cats + dogs</p>
              </div>
              <img src={heroImage} alt="Pet owner relaxing at home with her dog and cat" className="absolute inset-0 h-full w-full rounded-[2.5rem] object-cover shadow-2xl" />
            </div>
          </div>
        </section>

        <section aria-label="KindredPaw benefits" className="border-b border-[#25483a]/10 bg-white">
          <div className="mx-auto grid max-w-7xl divide-y divide-[#25483a]/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            {trustPoints.map(([title, text]) => (
              <div key={title} className="py-7 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <p className="font-bold text-[#25483a]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">How it works</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#25483a] sm:text-5xl">Protection in three simple steps.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">No confusing paperwork maze. Tell us about your companion, review your details and finish your application online.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <article key={number} className="relative overflow-hidden rounded-3xl border border-[#25483a]/10 bg-white p-7 shadow-sm">
                <span className="absolute right-5 top-2 text-7xl font-black text-[#25483a]/5">{number}</span>
                <span className="grid size-12 place-items-center rounded-2xl bg-[#25483a] font-bold text-white">{number}</span>
                <h3 className="mt-8 text-xl font-bold text-[#25483a]">{title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="bg-[#f1e6d7] px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">What cover can help with</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#25483a] sm:text-5xl">Care for more of life’s unexpected moments.</h2>
              <p className="mt-5 leading-7 text-stone-600">Available benefits and limits depend on the plan you select. We keep the important details visible before you commit.</p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(([icon, title, text]) => (
                <article key={title} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#25483a]/5 transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#f3dec8] text-2xl font-bold text-[#25483a]" aria-hidden="true">{icon}</span>
                  <h3 className="mt-6 text-xl font-bold text-[#25483a]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-xs leading-5 text-stone-500">Coverage is subject to eligibility, waiting periods, limits and exclusions shown in your policy documents.</p>
          </div>
        </section>

        <section id="why-kindredpaw" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2.5rem] bg-[#25483a]/10" />
            <img src={vetImage} alt="Veterinarian comforting a dog" className="h-[440px] w-full rounded-[2rem] bg-white object-cover shadow-xl sm:h-[560px]" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">Why KindredPaw</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#25483a] sm:text-5xl">Built around better care decisions.</h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">Insurance should make a difficult day easier—not add another layer of uncertainty. KindredPaw is designed around clarity, continuity and support.</p>
            <ul className="mt-8 space-y-5">
              {[
                ['Plain-language protection', 'Understand the essentials without decoding industry jargon.'],
                ['Your information stays with you', 'Save progress and return whenever you are ready to continue.'],
                ['A complete view of your pet', 'Keep health and application details together in one simple journey.'],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#dce8dc] text-sm font-bold text-[#25483a]">✓</span>
                  <div><p className="font-bold text-[#25483a]">{title}</p><p className="mt-1 leading-6 text-stone-600">{text}</p></div>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="mt-9 inline-flex rounded-xl bg-[#25483a] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1d392e]">Start an application</Link>
          </div>
        </section>

        <section id="faq" className="border-y border-[#25483a]/10 bg-white px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a4f2b]">Common questions</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#25483a] sm:text-5xl">Know before you begin.</h2>
              <p className="mt-5 leading-7 text-stone-600">A few quick answers about the application experience.</p>
            </div>
            <div className="divide-y divide-[#25483a]/10 border-y border-[#25483a]/10">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-[#25483a]">
                    {question}<span className="text-2xl font-light transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pr-10 pt-3 leading-7 text-stone-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#25483a] px-6 py-16 text-center text-white sm:px-12">
            <div className="absolute -left-20 -top-32 size-80 rounded-full border-[60px] border-white/5" />
            <div className="absolute -bottom-36 -right-20 size-80 rounded-full border-[60px] border-white/5" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e9c7aa]">Ready when you are</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Give their next adventure a little more protection.</h2>
              <p className="mt-5 text-lg leading-8 text-[#f1e6d7]">Create your profile, add your pet and review everything before submitting.</p>
              <Link to="/signup" className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-bold text-[#25483a] transition hover:bg-[#faf6ee]">Get started now</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
