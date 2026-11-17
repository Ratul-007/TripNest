
import { Link } from '@tanstack/react-router'

export function HomePage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="mx-auto flex min-h-[580px] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center">
        <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
          Your journey starts here
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Wherever Life Takes You,{' '}
          <span className="text-emerald-700">Book It.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Discover stays, journeys, experiences and services — all in one place.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/explore"
            className="rounded-xl bg-emerald-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Explore TripNest
          </Link>

          <Link
            to="/partner"
            className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            Become a Partner
          </Link>
        </div>
      </div>
    </section>
  )
}
