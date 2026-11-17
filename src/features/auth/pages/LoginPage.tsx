
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { signIn } from '../authService'

export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email.trim(), password)
      await navigate({ to: '/' })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to log in. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-stone-50 px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-emerald-700">
            TripNest<span className="text-amber-500">.</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in to continue your journey with TripNest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}
