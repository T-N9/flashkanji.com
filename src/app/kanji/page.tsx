import KanjiGround from '@/components/KanjiPage'
import { KanjiDetailModal } from '@/components/modals/KanjiDetailModal'
import React, { Suspense } from 'react'

const KanjiPage = () => {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <KanjiGround />
      </Suspense>
      <KanjiDetailModal />
    </>
  )
}

export default KanjiPage