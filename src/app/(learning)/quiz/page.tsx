import { Quiz_Ground } from '@/components/QuizGround'
import React, { Suspense } from 'react'

const QuizPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Quiz_Ground />
    </Suspense>

  )
}

export default QuizPage