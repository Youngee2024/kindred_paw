import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroImage from '../../images/young woman sitting on ground and petting dog(1).jpg'
import accidentImage from '../../images/cat lies on document(1).jpg'
import surgeryImage from '../../images/thermometer showing 37 celsius.jpg'
import medicationImage from '../../images/pill(1).jpg'
import therapyImage from '../../images/cat on books plant(2).jpg'
import avatar from '../../images/person female.png'

const services = [
  ['Accident and illness', 'Cover for broken bones, cuts, foreign-object ingestion, allergies, infections and more.', accidentImage],
  ['Surgery and hospitalization', 'Support for emergency and planned procedures, including extended veterinary stays.', surgeryImage],
  ['Medication and tests', 'Prescription medicine and diagnostics including X-rays, blood tests and ultrasounds.', medicationImage],
  ['Hereditary conditions and therapies', 'Care for genetic conditions and therapies such as physiotherapy and acupuncture.', therapyImage],
]

const testimonials = [
  'Maya made a stressful vet visit feel manageable. The process was clear from the very first step.',
  'I found the right cover for my dog in minutes, and the team answered every question with care.',
  'Simple, thoughtful and transparent. It feels good knowing my pet is protected when it matters.',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fffaf2] text-stone-900">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-red-950/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf2] via-[#f8eee6] to-[#e8cecc]" />
          <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-red-800">Care without compromise</p>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-red-950 sm:text-6xl lg:text-7xl">Their best life deserves your best protection.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">Straightforward pet insurance that helps your furry family get the care they deserve—from everyday surprises to major treatment.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/signup" className="rounded-xl bg-red-950 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-950/15 transition hover:bg-red-900">Get started</Link>
                <a href="#services" className="rounded-xl border border-red-950/20 bg-white/60 px-6 py-3.5 font-semibold text-red-950 transition hover:bg-white">Explore cover</a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 rotate-3 rounded-[3rem] bg-red-950/10" />
              <img src={heroImage} alt="Pet owner enjoying time with her dog" className="relative h-[460px] w-full rounded-[3rem] object-cover shadow-2xl sm:h-[560px]" />
              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white p-4 shadow-xl sm:left-6">
                <p className="text-2xl font-bold text-red-950">Simple cover</p>
                <p className="text-sm text-stone-600">For the pets you love most</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">What we do</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-red-950 sm:text-5xl">Protection through every chapter</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map(([title, text, image]) => (
              <article key={title} className="group overflow-hidden rounded-3xl border border-red-950/10 bg-[#f3e9e7]">
                <img src={image} alt="" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-7">
                  <h3 className="text-xl font-bold text-red-950">{title}</h3>
                  <p className="mt-3 leading-7 text-stone-700">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonies" className="bg-red-950 px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">Testimonies</p>
            <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Loved by people who love their pets.</h2>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((text) => (
                <figure key={text} className="flex flex-col rounded-3xl bg-white/10 p-7 ring-1 ring-white/15">
                  <blockquote className="flex-1 text-lg leading-8 text-red-50">“{text}”</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3">
                    <img src={avatar} alt="" className="size-11 rounded-full border-2 border-red-200 object-cover" />
                    <div><p className="font-semibold">Alamu Gold</p><p className="text-sm text-red-200">Pet parent</p></div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
