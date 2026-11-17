
import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { AuthContext } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession)
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return

      if (error) {
        console.error('Unable to retrieve session:', error.message)
      }

      setSession(data.session)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
