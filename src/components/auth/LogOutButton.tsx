'use client'

import { supabase } from '@/lib/supabaseClient'
import { Button } from '@nextui-org/react'
import Cookies from 'js-cookie'

export default function LogOutButton() {
  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut()

    // Remove access token cookie
    Cookies.remove('sb-access-token')

    // Clear localStorage (optional: only clear relevant items)
    localStorage.clear()

    // Redirect to login (or homepage)
    window.location.href = '/login'
  }

  return (
    <Button onClick={handleLogout}>
      Log Out
    </Button>
  )
}
