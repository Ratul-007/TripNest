
import { useEffect } from 'react'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  useEffect(() => {
    document.title = `${title} | TripNest`

    const meta = document.querySelector('meta[name="description"]')

    if (meta) {
      meta.setAttribute('content', description)
    } else {
      const element = document.createElement('meta')
      element.name = 'description'
      element.content = description
      document.head.appendChild(element)
    }
  }, [title, description])

  return (
    <section className="mx-auto flex min-h-[55vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">
      <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
        TripNest
      </span>

      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-4 max-w-xl leading-7 text-slate-500">
        {description}
      </p>

      <p className="mt-6 text-sm text-slate-400">
        This section is currently under development.
      </p>
    </section>
  )
}
