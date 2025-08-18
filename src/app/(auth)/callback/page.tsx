'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Cookies from 'js-cookie'
import { checkUserExists } from '@/api/usersRoute'
import { CircleNotch } from '@phosphor-icons/react'
import { useUserStore } from '@/store/userState'
import RamenLoading from '@/components/common/RamenLoading'

export default function AuthCallback() {
  const router = useRouter()

  const { setUser } = useUserStore()

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      const accessToken = session?.access_token
      const user = session?.user

      if (!user || !accessToken) {
        // router.push('/login')
        return
      }

      if (user) {
        setUser({
          email: user.email,
          avatarUrl: user.user_metadata.avatar_url,
        })
      }

      Cookies.set('sb-access-token', accessToken, { expires: 1 })

      try {
        const result = await checkUserExists(user.id)
        if (result.exists) {
          setUser({
            userId: user.id,
            username: result?.user?.username,
            japanese_level: result?.user?.japanese_level,
            created_at: result?.user?.created_at,
            currentStreak: result?.user?.current_streak,
            longestStreak: result?.user?.longest_streak,
            totalLearned: result?.user?.total_learned,
            totalHours: result?.user?.total_hours,
            lives: result?.user?.lives,
            xp_points: result?.user?.experience_points,
            rank: result?.user?.rank,
            resume_learning_section: result.user?.resume_learning_section
          })
          router.push('/flashboard')
        } else {
          router.push('/create-profile')
        }
      } catch (error) {
        console.error("User check failed", error)
        // router.push('/login')
      }
    }

    handleSession()
  }, [router])

  return <section className='h-screen flex justify-center items-center'>
    <RamenLoading />
  </section>
}
