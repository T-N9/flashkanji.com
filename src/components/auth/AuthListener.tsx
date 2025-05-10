'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthListener() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth changed:', event, session)
        // optionally send session info to your backend
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return null
}
