// src/lib/handleSession.ts
import { supabase } from '@/lib/supabaseClient'
import Cookies from 'js-cookie'
import { checkUserExists } from '@/api/usersRoute'
import { useUserStore } from '@/store/userState'

export const handleSession = async (router?: any) => {
  const { setUser } = useUserStore.getState()

  const { data } = await supabase.auth.getSession()
  const session = data.session
  const accessToken = session?.access_token
  const user = session?.user

  if (!user || !accessToken) {
    // router?.push?.('/login')
    return
  }

  setUser({
    email: user.email,
    avatarUrl: user.user_metadata.avatar_url,
  })

  Cookies.set('sb-access-token', accessToken, { expires: 1 })

  try {
    const result = await checkUserExists(user.id)
    if (result.exists) {
      setUser({
        userId: user.id,
        username: result.user?.username,
        japanese_level: result.user?.japanese_level,
        created_at: result.user?.created_at,
      })
      // router?.push?.('/flashmap')
    } else {
      router?.push?.('/create-profile')
    }
  } catch (error) {
    console.error("User check failed", error)
    // router?.push?.('/login')
  }
}
