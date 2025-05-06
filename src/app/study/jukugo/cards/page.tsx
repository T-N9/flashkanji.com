import { JukugoGround } from '@/components/JukugoGround'
import { JukugoSwiperModal } from '@/components/JukugoSwiperModal/JukugoSwiperModal'
import { JukugoDetailModal } from '@/components/modals/JukugoDetailModal'
import React, { Suspense } from 'react'

const JukugoPage = () => {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <JukugoGround />
        <JukugoDetailModal/>
      </Suspense>
      <JukugoSwiperModal />

    </>
  )
}

export default JukugoPage