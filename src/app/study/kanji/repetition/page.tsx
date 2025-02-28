import SpacedRepetition from '@/components/RepetitionGround'
import React, { Suspense } from 'react'

const KanjiRepetitionPage = () => {
  return (
    <div>
      <Suspense>
        <SpacedRepetition />
      </Suspense>
    </div>
  )
}

export default KanjiRepetitionPage