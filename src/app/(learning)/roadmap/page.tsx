'use client'
import { Checkbox } from '@nextui-org/react'
import { BookOpenUser, Brain } from '@phosphor-icons/react'
import { SealQuestion } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const RoadMapPage = () => {
  return (
    <section>
      <div className='container max-w-[1280px]  mx-auto px-4'>
        <div className='my-10'>
          <h1>Roadmap</h1>
          <p>This is the roadmap page</p>

          <div>
            <div className='space-y-2'>

              <div className='bg-slate-50 scale-80 border-2 border-orange-600 border-solid gap-4 p-2 rounded-full w-80 flex items-center shadow-xl'>
                <div className='bg-orange-600 relative inline-block p-2 rounded-full shadow-md'>
                  <div className='border-dashed animate-slow-spin duration-1000 border-white border-2 rounded-full p-2'>
                    <BookOpenUser className='opacity-0' size={22} color='#fff' />
                  </div>
                  <BookOpenUser className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' size={22} color='#fff' />
                </div>

                <div className='flex justify-between items-center w-full gap-1'>
                  <div>
                    <h3 className='font-bold'>Preview</h3>
                    <p className='text-xs'>Learn how to write and pronounce.</p>
                  </div>

                  <Checkbox size='lg' defaultSelected color="primary">
                  </Checkbox>
                </div>
              </div>

              <div className='bg-slate-50 border-2 border-blue-600 border-solid gap-4 p-2 rounded-full w-80 flex items-center shadow-xl'>
                <div className='bg-blue-600 relative inline-block p-2 rounded-full shadow-md'>
                  <div className='border-dashed animate-slow-spin duration-1000 border-white border-2 rounded-full p-2'>
                    <Brain className='opacity-0' size={22} color='#fff' />
                  </div>
                  <Brain className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' size={22} color='#fff' />
                </div>

                <div className='w-full flex justify-between items-center gap-1'>
                  <div>
                    <h3 className='font-bold'>Memorize</h3>
                    <p className='text-xs'>
                      Train your brain with repetition method.
                    </p>
                  </div>

                  <Checkbox size='lg' color="primary">
                  </Checkbox>
                </div>
              </div>

              <div className='bg-slate-50 grayscale opacity-50 scale-80 border-2 border-green-600 border-solid gap-4 p-2 rounded-full w-80 flex items-center shadow-xl'>
                <div className='bg-green-600 relative inline-block p-2 rounded-full shadow-md'>
                  <div className='border-dashed animate-slow-spin duration-1000 border-white border-2 rounded-full p-2'>
                    <SealQuestion className='opacity-0' size={22} color='#fff' />
                  </div>
                  <SealQuestion className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' size={22} color='#fff' />
                </div>

                <div className='w-full flex justify-between items-center gap-1'>
                  <div>
                    <h3 className='font-bold'>Reinforce</h3>
                    <p className='text-xs'>
                      Test your understanding of Kanji.
                    </p>
                  </div>

                  <Checkbox size='lg' color="primary">
                  </Checkbox>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoadMapPage