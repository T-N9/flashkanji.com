'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Cookies from 'js-cookie'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession()
      const accessToken = data.session?.access_token

      if (accessToken) {
        Cookies.set('sb-access-token', accessToken, { expires: 1 })
        router.push('/') // redirect to home or dashboard
      }
    }

    handleSession()
  }, [router])

  return <p>Redirecting...</p>
}
