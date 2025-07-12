import StartQuiz from '@/components/QuizGround';
import React, { Suspense } from 'react'

const StartQuizPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <StartQuiz />
    </Suspense>
  )
}

export default StartQuizPage;