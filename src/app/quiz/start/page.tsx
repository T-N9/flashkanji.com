import StartQuiz from '@/components/QuizGround/StartQuiz';
import React, { Suspense } from 'react'

const StartQuizPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <StartQuiz />
    </Suspense>

  )
}

export default StartQuizPage;