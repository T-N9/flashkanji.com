'use client'

import { useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/store/userState'
import { Button } from '@heroui/react'
import Cookies from 'js-cookie'

export default function LogOutButton() {

  const { resetUser } = useUserStore()
  const router = useRouter();
  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut()

    // Remove access token cookie
    Cookies.remove('sb-access-token')
    resetUser();

    // Clear localStorage (optional: only clear relevant items)
    localStorage.clear()

    // Redirect to login (or homepage)
    router.push('/login')
  }

  return (
    <Button className='mx-auto' color='danger' onClick={handleLogout}>
      Log Out
    </Button>
  )
}
