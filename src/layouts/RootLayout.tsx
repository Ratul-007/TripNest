
import { Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/navigation/Navbar'
import { Footer } from '../components/navigation/Footer'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
