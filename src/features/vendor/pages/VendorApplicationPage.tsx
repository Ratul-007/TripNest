
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '../../auth/useAuth'

import {
  getVendorApplicationData,
  submitVendorApplication,
} from '../services/vendorApplicationService'

import type {
  VendorApplication,
  VendorApplicationFormData,
} from '../types/vendorApplication'

const initialForm: VendorApplicationFormData = {
  business_name: '',
  contact_phone: '',
  business_address: '',
  business_description: '',
}

export function VendorApplicationPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [application, setApplication] =
    useState<VendorApplication | null>(null)

  const [role, setRole] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      void navigate({ to: '/login' })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (authLoading || !user) return

    let active = true

    async function loadApplication() {
      try {
        setPageLoading(true)

        const result = await getVendorApplicationData(user!.id)

        if (!active) return

        setRole(result.role)
        setApplication(result.application)
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Could not load vendor application.',
          )
        }
      } finally {
        if (active) setPageLoading(false)
      }
    }

    void loadApplication()

    return () => {
      active = false
    }
  }, [authLoading, user])

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!user || role !== 'customer') return

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const result = await submitVendorApplication(user.id, form)

      setApplication(result)
      setForm(initialForm)
      setSuccess('Your vendor application was submitted successfully.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your application.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || pageLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        Loading vendor application...
      </main>
    )
  }

  if (!user) return null

  if (error && !role) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  if (role === 'vendor') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">
          Vendor Account Active
        </h1>
        <p className="mt-3 text-gray-600">
          Your account has vendor access.
        </p>
      </main>
    )
  }

  if (role !== 'customer') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">
          Vendor Application
        </h1>
        <p className="mt-3 text-gray-600">
          Your account is not eligible to submit a vendor application.
        </p>
      </main>
    )
  }

  if (application?.status === 'pending') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border p-8">
          <h1 className="text-2xl font-bold">
            Application Under Review
          </h1>

          <p className="mt-3 text-gray-600">
            Your vendor application has been submitted and is
            waiting for admin approval.
          </p>

          <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-yellow-800">
            Status: Pending
          </div>

          <p className="mt-4 font-medium">
            Business: {application.business_name}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold">
          Become a TripNest Partner
        </h1>

        <p className="mt-3 text-gray-600">
          Submit your business information to apply for a
          TripNest vendor account. Our admin team will review
          your application.
        </p>

        {application?.status === 'rejected' && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            <p className="font-semibold">
              Previous application rejected
            </p>
            {application.rejection_reason && (
              <p className="mt-2">
                Reason: {application.rejection_reason}
              </p>
            )}
            <p className="mt-2">
              You may submit a new application.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="business_name"
              className="mb-2 block font-medium"
            >
              Business Name *
            </label>
            <input
              id="business_name"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={150}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Your hotel or business name"
            />
          </div>

          <div>
            <label
              htmlFor="contact_phone"
              className="mb-2 block font-medium"
            >
              Contact Phone *
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              value={form.contact_phone}
              onChange={handleChange}
              required
              maxLength={30}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="+880..."
            />
          </div>

          <div>
            <label
              htmlFor="business_address"
              className="mb-2 block font-medium"
            >
              Business Address *
            </label>
            <textarea
              id="business_address"
              name="business_address"
              value={form.business_address}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Full business address"
            />
          </div>

          <div>
            <label
              htmlFor="business_description"
              className="mb-2 block font-medium"
            >
              Business Description
            </label>
            <textarea
              id="business_description"
              name="business_description"
              value={form.business_description}
              onChange={handleChange}
              maxLength={2000}
              rows={4}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Tell us about your business..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Submitting...'
              : 'Submit Vendor Application'}
          </button>
        </form>
      </div>
    </main>
  )
}
