import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const QuizSection = () => {
  return (
    <section className="w-full bg-light py-12 md:py-14 lg:py-16">
      <div className="main-container">
        <div className="flex gap-10 md:gap-16 flex-col-reverse lg:flex-row">
          <div className="flex flex-1 justify-center lg:justify-start">
            <Image
              alt="quiz"
              className=" shadow-md image-card border-4 border-border_orange aspect-[1/1] overflow-hidden rounded-xl object-cover"
              height="500"
              src="/assets/hero-3.jpg"
              width="500"
            />
          </div>
          <div className="space-y-4 flex-1">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              Quiz
            </div>
            <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              <span className="text-primary">Quiz Quest</span>: Test
              Your Kanji Knowledge!
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Challenge yourself with our interactive quizzes. Reinforce
              Kanji skills, enhance recall, and track your progress in an
              engaging, fun-filled learning experience! 🀄🤔
            </p>
            <div className="space-x-4">
              <Button as={Link} href="/flashmap" className='btn-primary' size='lg'>Start Quiz</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizSection