import { Button } from '@heroui/react'
import React from 'react'

const ContributionSection = () => {
  return (
    <section className="w-full py-12 md:py-14 lg:py-16 dark:bg-gray-800">
    <div className=" grid items-center justify-center gap-4 text-center main-container">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Contribute to{" "}
          <span className="text-primary">FlashKanji</span>
        </h2>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
          Join us in shaping the future of Kanji learning! Our project
          thrives on collaboration and open-source contributions.
        </p>
      </div>
      <div className="divide-y rounded-lg border-2">
        <div className="grid w-full grid-cols-1 items-stretch justify-center divide-x md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto flex flex-col gap-3 w-full p-4 sm:p-8">
            <h2>
              Explore and contribute to our GitHub repositories: Check
              out our projects that fuels this Kanji learning website
            </h2>
            <a
              href="https://github.com/T-N9/flashkanji-next"
              target="_blank"
            >
              <Button color="primary" className='tracking-tight' variant="bordered">
                FlashKanji NextJS
              </Button>
            </a>

            <a
              href="https://github.com/T-N9/flashkanji-php"
              target="_blank"
            >
              <Button color="primary" className='tracking-tight' variant="bordered">
                FlashKanji PHP API
              </Button>
            </a>
          </div>
          <div className="mx-auto flex flex-col gap-3 w-full p-4 sm:p-8">
            <p>
              We extend our gratitude to the following projects and APIs
              that enhance your learning experience:
            </p>
            <a
              href="https://github.com/KanjiVG/kanjivg"
              target="_blank"
            >
              <Button color="primary" className='tracking-tight' variant="bordered">
                Kanjivg
              </Button>
            </a>

            <a
              href="https://github.com/onlyskin/kanjiapi.dev"
              target="_blank"
            >
              <Button color="primary" className='tracking-tight' variant="bordered">
                Kanjiapi.dev
              </Button>
            </a>
            <a
              href="https://github.com/jcsirot/kanji.gif"
              target="_blank"
            >
              <Button color="primary" className='tracking-tight' variant="bordered">
                KanjiGIF
              </Button>
            </a>
          </div>
          <div className="mx-auto flex flex-col gap-3 w-full p-4 sm:p-8">
            <p className="">
              Together, let&apos;s build a community dedicated to making
              Kanji learning accessible and enjoyable for everyone! 🀄🌐
            </p>
            <a href="mailto:tenyainmoelwin@gmail.com" target="_blank">
              <Button color="primary" className='tracking-tight' variant="bordered">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ContributionSection