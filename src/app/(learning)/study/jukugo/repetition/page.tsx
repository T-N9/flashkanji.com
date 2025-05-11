import SpacedRepetition from '@/components/RepetitionGround'
import React, { Suspense } from 'react'

const JukugoRepetitionPage = () => {
  return (
    <div>
      <Suspense>
        <SpacedRepetition />
      </Suspense>
    </div>
  )
}

export default JukugoRepetitionPage