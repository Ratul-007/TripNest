
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { signUp } from '../authService'

export function SignupPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const data = await signUp(fullName.trim(), email.trim(), password)

      if (data.session) {
        await navigate({ to: '/' })
      } else {
        setSuccess(
          'Your account has been created. Please check your email to verify your account before logging in.',
        )
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create your account. Please try again.',
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
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Join TripNest and make every booking easier.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}
