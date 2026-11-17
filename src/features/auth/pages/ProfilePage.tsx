
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../useAuth'
import { supabase } from '../../../lib/supabase'

interface ProfileData {
  full_name: string
  phone: string | null
  role: string
  created_at: string
  avatar_url: string | null
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getAvatarStoragePath(url: string | null) {
  if (!url) return null

  const marker = '/storage/v1/object/public/avatars/'
  const markerIndex = url.indexOf(marker)

  if (markerIndex === -1) return null

  const path = url.slice(markerIndex + marker.length).split('?')[0]

  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [removingAvatar, setRemovingAvatar] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Redirect logged-out users
  useEffect(() => {
    if (!authLoading && !user) {
      void navigate({ to: '/login' })
    }
  }, [authLoading, user, navigate])

  // Load profile
  useEffect(() => {
    let active = true

    async function fetchProfile() {
      if (!user) return

      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('full_name, phone, role, created_at, avatar_url')
        .eq('id', user.id)
        .single()

      if (!active) return

      if (fetchError) {
        setError(fetchError.message)
      } else {
        const profileData = data as ProfileData

        setProfile(profileData)
        setFullName(profileData.full_name ?? '')
        setPhone(profileData.phone ?? '')
      }

      setLoading(false)
    }

    if (user) {
      void fetchProfile()
    }

    return () => {
      active = false
    }
  }, [user])

  // Create and clean up local image preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  // Select avatar
  function handleAvatarSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setError('')
    setSuccess('')

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError('Image size must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  // Upload or replace avatar
  async function handleAvatarUpload() {
    if (!user || !selectedFile || !profile) return

    setUploadingAvatar(true)
    setError('')
    setSuccess('')

    let uploadedPath: string | null = null

    try {
      const extensionByType: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }

      const extension = extensionByType[selectedFile.type]

      if (!extension) {
        throw new Error('Unsupported image format.')
      }

      const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          contentType: selectedFile.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      uploadedPath = filePath

      const publicUrl = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath).data.publicUrl

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .select('full_name, phone, role, created_at, avatar_url')
        .single()

      if (updateError) throw updateError

      const updatedProfile = data as ProfileData
      setProfile(updatedProfile)

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      })

      const oldPath = getAvatarStoragePath(profile.avatar_url)

      if (oldPath && oldPath !== filePath) {
        await supabase.storage.from('avatars').remove([oldPath])
      }

      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      if (metadataError) {
        setError(
          'Your photo was uploaded, but Navbar synchronization failed. Please refresh the page.',
        )
      } else {
        setSuccess('Profile photo updated successfully.')
      }
    } catch (err) {
      if (uploadedPath) {
        await supabase.storage.from('avatars').remove([uploadedPath])
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to upload your photo. Please try again.',
      )
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Remove avatar
  async function handleRemoveAvatar() {
    if (!user || !profile?.avatar_url) return

    setRemovingAvatar(true)
    setError('')
    setSuccess('')

    try {
      const oldPath = getAvatarStoragePath(profile.avatar_url)

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)
        .select('full_name, phone, role, created_at, avatar_url')
        .single()

      if (updateError) throw updateError

      setProfile(data as ProfileData)

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      })

      if (oldPath) {
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove([oldPath])

        if (removeError) {
          console.error('Unable to delete old avatar:', removeError.message)
        }
      }

      if (metadataError) {
        setError(
          'Photo removed from your profile, but Navbar synchronization failed. Please refresh.',
        )
      } else {
        setSuccess('Profile photo removed successfully.')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove your photo. Please try again.',
      )
    } finally {
      setRemovingAvatar(false)
    }
  }

  // Save personal information
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) return

    const trimmedName = fullName.trim()
    const trimmedPhone = phone.trim()

    if (trimmedName.length < 2) {
      setError('Full name must contain at least 2 characters.')
      return
    }

    if (trimmedName.length > 100) {
      setError('Full name cannot exceed 100 characters.')
      return
    }

    if (trimmedPhone.length > 20) {
      setError('Phone number cannot exceed 20 characters.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: trimmedName,
          phone: trimmedPhone || null,
        })
        .eq('id', user.id)
        .select('full_name, phone, role, created_at, avatar_url')
        .single()

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error(
            'This phone number is already being used by another account.',
          )
        }

        throw updateError
      }

      const updatedProfile = data as ProfileData

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: updatedProfile.full_name,
        },
      })

      setProfile(updatedProfile)
      setFullName(updatedProfile.full_name)
      setPhone(updatedProfile.phone ?? '')

      if (metadataError) {
        setError(
          'Your profile was saved, but the Navbar name could not be synchronized. Please refresh and try again.',
        )
        return
      }

      setSuccess('Your profile has been updated successfully.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update your profile. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  // Change password
  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.email) {
      setPasswordError('Your account email could not be found.')
      return
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please complete all password fields.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must contain at least 8 characters.')
      return
    }

    if (newPassword.length > 72) {
      setPasswordError('Password cannot exceed 72 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('Your new password must be different from the current password.')
      return
    }

    setChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      // Verify current password
      const { error: verificationError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        })

      if (verificationError) {
        throw new Error('Your current password is incorrect.')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)

      setPasswordSuccess('Your password has been changed successfully.')
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : 'Unable to change your password. Please try again.',
      )
    } finally {
      setChangingPassword(false)
    }
  }

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Checking your account...
        </p>
      </div>
    )
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading your profile...
        </p>
      </div>
    )
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="font-bold text-red-800">
            Unable to load your profile
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error || 'Your profile could not be found.'}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  const formattedDate = new Date(profile.created_at).toLocaleDateString(
    'en-BD',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )

  const displayedAvatar = previewUrl || profile.avatar_url

  return (
    <section className="min-h-screen bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile header and avatar */}
        <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative h-24 w-24 shrink-0">
              {displayedAvatar ? (
                <img
                  src={displayedAvatar}
                  alt="Profile avatar"
                  className="h-24 w-24 rounded-full border-4 border-emerald-50 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <UserRound size={40} />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar || removingAvatar}
                aria-label="Choose profile photo"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-700 text-white shadow transition hover:bg-emerald-800 disabled:opacity-50"
              >
                <Camera size={17} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-slate-900">
                {profile.full_name || 'TripNest User'}
              </h2>

              <p className="mt-1 truncate text-sm text-slate-500">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                  {profile.role}
                </span>

                {user.email_confirmed_at && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <BadgeCheck size={14} />
                    Verified email
                  </span>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarSelection}
            className="hidden"
          />

          <div className="mt-6 border-t border-stone-100 pt-5">
            <p className="text-sm font-semibold text-slate-800">
              Profile Photo
            </p>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or WebP. Maximum file size: 2 MB.
            </p>

            {selectedFile && (
              <p className="mt-2 truncate text-sm text-emerald-700">
                Selected: {selectedFile.name}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar || removingAvatar}
                className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                <Camera size={16} />
                {profile.avatar_url ? 'Change Photo' : 'Choose Photo'}
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar || removingAvatar}
                  className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                </button>
              )}

              {profile.avatar_url && !selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar || removingAvatar}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {removingAvatar ? 'Removing...' : 'Remove Photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal information */}
        <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information associated with your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="profileName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="profileName"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profileEmail"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="profileEmail"
                  type="email"
                  value={user.email ?? ''}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-slate-500 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Email address cannot be changed from this page.
              </p>
            </div>

            <div>
              <label
                htmlFor="profilePhone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="profilePhone"
                  type="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+880 1XXXXXXXXX"
                  className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-4">
              <CalendarDays size={20} className="text-slate-500" />

              <div>
                <p className="text-xs text-slate-500">Member since</p>
                <p className="text-sm font-semibold text-slate-800">
                  {formattedDate}
                </p>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                {success}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-6">
              <Link
                to="/"
                className="text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
              >
                Back to Home
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password and security */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <LockKeyhole size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Password & Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Change your password to keep your TripNest account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* Current password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Current Password
              </label>

              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showCurrentPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters. Avoid reusing your old password.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your new password again"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                {passwordSuccess}
              </p>
            )}

            <div className="border-t border-stone-100 pt-6">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <LockKeyhole size={17} />
                {changingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
