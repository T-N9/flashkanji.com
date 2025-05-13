// src/components/SessionSync.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userState'
import { handleSession } from '@/lib/handleSession'

const SessionSync = () => {
  const { userId } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!userId) {
      handleSession(router)
    }
  }, [userId, router])

  return null
}

export default SessionSync
