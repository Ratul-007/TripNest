
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-extrabold text-white">
            TripNest.
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
            One platform for stays, journeys, experiences and everyday services.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/hotels" className="hover:text-white">Hotels</Link>
            <Link to="/flights" className="hover:text-white">Flights</Link>
            <Link to="/tours" className="hover:text-white">Tours</Link>
            <Link to="/appointments" className="hover:text-white">Appointments</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Company</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/about" className="hover:text-white">About us</Link>
            <Link to="/partner" className="hover:text-white">Become a partner</Link>
            <Link to="/help" className="hover:text-white">Help center</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Legal</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of service</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        © 2026 TripNest. All rights reserved.
      </div>
    </footer>
  )
}
