'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Cookies from 'js-cookie'
import { checkUserExists } from '@/api/usersRoute'
import { CircleNotch } from '@phosphor-icons/react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      const accessToken = session?.access_token
      const user = session?.user

      if (!user || !accessToken) {
        router.push('/login')
        return
      }

      Cookies.set('sb-access-token', accessToken, { expires: 1 })

      try {
        const result = await checkUserExists(user.id)
        if (result.exists) {
          router.push('/')
        } else {
          router.push('/create-profile')
        }
      } catch (error) {
        console.error("User check failed", error)
        router.push('/login')
      }
    }

    handleSession()
  }, [router])

  return <section className='h-screen flex justify-center items-center'>
    <CircleNotch className='animate-spin' size={32} />
  </section>
}
