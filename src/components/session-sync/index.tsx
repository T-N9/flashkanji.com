// src/components/SessionSync.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userState'
import { handleSession } from '@/lib/handleSession'
import RamenLoading from '../common/RamenLoading'

const SessionSync = () => {
  const { userId, email } = useUserStore()
  const router = useRouter()


  useEffect(() => {

    if (!userId) {
      handleSession(router)
    }
  }, [userId, router])

  return null
}

export default SessionSync
