
import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-bold tracking-widest text-emerald-700">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">
        Page not found
      </h1>
      <p className="mt-3 text-slate-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="mt-7 rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        Back to Home
      </Link>
    </section>
  )
}
