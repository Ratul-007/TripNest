
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Menu,
  X,
  LogOut,
  UserRound,
  ChevronDown,
} from 'lucide-react'

import { useAuth } from '../../features/auth/useAuth'
import { signOut } from '../../features/auth/authService'

const navItems = [
  { label: 'Explore', to: '/explore' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Flights', to: '/flights' },
  { label: 'Bus & Train', to: '/bus' },
  { label: 'Tours', to: '/tours' },
  { label: 'Appointments', to: '/appointments' },
]

interface ProfileAvatarProps {
  avatarUrl: string | null
  mobile?: boolean
}

// Reusable Profile Avatar
function ProfileAvatar({
  avatarUrl,
  mobile = false,
}: ProfileAvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700 ${
        mobile ? 'h-10 w-10' : 'h-8 w-8'
      }`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound size={mobile ? 20 : 17} />
      )}
    </div>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const fullName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'My Account'

  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === 'string'
      ? user.user_metadata.avatar_url
      : null

  // Logout
  async function handleLogout() {
    setError('')
    setLoggingOut(true)

    try {
      await signOut()
      setMenuOpen(false)
      await navigate({ to: '/' })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log out. Please try again.',
      )
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-emerald-700"
          onClick={() => setMenuOpen(false)}
        >
          TripNest<span className="text-slate-900">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (
            <>
              {user ? (
                <>
                  {/* Desktop Profile */}
                  <Link
                    to="/profile"
                    className="group flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 transition hover:bg-emerald-100"
                  >
                    <ProfileAvatar avatarUrl={avatarUrl} />

                    <span className="max-w-36 truncate text-sm font-semibold text-emerald-800">
                      {fullName}
                    </span>

                    <ChevronDown
                      size={15}
                      className="text-emerald-700 transition group-hover:translate-y-0.5"
                    />
                  </Link>

                  {/* Desktop Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {loggingOut ? 'Logging out...' : 'Log out'}
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700"
                  >
                    Log in
                  </Link>

                  {/* Signup */}
                  <Link
                    to="/signup"
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Authentication Error */}
      {error && (
        <div
          role="alert"
          className="border-t border-red-100 bg-red-50 px-5 py-2 text-center text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">

            {/* Mobile Nav Links */}
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-100" />

            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Mobile Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3 transition hover:bg-emerald-100"
                    >
                      <ProfileAvatar
                        avatarUrl={avatarUrl}
                        mobile
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500">
                          My Profile
                        </p>

                        <p className="truncate text-sm font-semibold text-emerald-800">
                          {fullName}
                        </p>
                      </div>

                      <ChevronDown
                        size={17}
                        className="-rotate-90 text-emerald-700"
                      />
                    </Link>

                    {/* Mobile Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={17} />
                      {loggingOut ? 'Logging out...' : 'Log out'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Mobile Login */}
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                    >
                      Log in
                    </Link>

                    {/* Mobile Signup */}
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-emerald-700 px-3 py-3 text-center text-sm font-semibold text-white"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
