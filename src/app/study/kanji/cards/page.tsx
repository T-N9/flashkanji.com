import KanjiGround from '@/components/KanjiPage'
import { KanjiSwiperModal } from '@/components/KanjiSwiperModal/KanjiSwiperModal'
import { KanjiDetailModal } from '@/components/modals/KanjiDetailModal'
import React, { Suspense } from 'react'

const KanjiPage = () => {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <KanjiGround />
      </Suspense>
      <KanjiSwiperModal/>
      <KanjiDetailModal />
    </>
  )
}

export default KanjiPage