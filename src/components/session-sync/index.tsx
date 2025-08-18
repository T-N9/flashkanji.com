// src/components/SessionSync.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userState'
import { supabase } from '@/lib/supabaseClient' // ✅ UPDATED
import { checkUserExists } from '@/api/usersRoute' // ✅ UPDATED
import RamenLoading from '../common/RamenLoading'
import Cookies from "js-cookie";
const AUTH_ROUTES = ['/login', '/create-profile', '/']

const SessionSync = () => {
  const { userId, setUser, username } = useUserStore() // ✅ UPDATED (grab setUser)
  const router = useRouter()
  const [loading, setLoading] = useState(true) // ✅ UPDATED
  const pathname = usePathname()


  // useEffect(() => {
  //   const token = Cookies.get("sb-access-token");
  //   const localCheck = localStorage.getItem('fk-user')
  //   const localUser = localCheck && JSON.parse(localCheck)
  //   console.log({ token, localUser })
  //   if (token && !localUser) {
  //     router.push('/login')
  //   }
  // }, []);

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname)) {
      setLoading(false)
      return
    }
    // ✅ UPDATED: subscribe to Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const result = await checkUserExists(session.user.id)
            if (result.exists) {
              setUser({
                userId: session.user.id,
                email: session.user.email,
                avatarUrl: session.user.user_metadata.avatar_url,
                username: result.user?.username,
                japanese_level: result.user?.japanese_level,
                created_at: result.user?.created_at,
                currentStreak: result.user?.current_streak,
                longestStreak: result.user?.longest_streak,
                totalLearned: result.user?.total_learned,
                totalHours: result.user?.total_hours,
                lives: result.user?.lives,
                xp_points: result.user?.experience_points,
                rank: result.user?.rank,
              })
              localStorage.setItem('fk-user', JSON.stringify(result))
            } else {
              router.push('/create-profile') // ✅ UPDATED
            }
          } catch (err) {
            console.error('User check failed', err)
            router.push('/create-profile')
          }
        } else {
          // No session → clear store
          setUser({})
          router.push('/login')
        }
        setLoading(false) // ✅ UPDATED
      }
    )

    // ✅ UPDATED: clean up subscription
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router, setUser])
  console.log({ loading, userId })
  // ✅ UPDATED: show loading screen until session check finishes
  if (loading && !userId) return <div className='h-screen bg-white dark:bg-background absolute z-50 top-0 left-0 bottom-0 right-0 flex justify-center items-center'><RamenLoading /></div>

  return null
}

export default SessionSync
