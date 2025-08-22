'use client';
import { Button } from '@heroui/react'
import Image from 'next/image'
import { Link } from "@/i18n/navigation";

const JukugoSection = () => {
    return (
        <section className="w-full py-12 md:py-14 lg:py-16">
            <div className="main-container">
                <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                            Jukugo
                        </div>
                        <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                            <span className="text-primary">Jukugo Mastery</span>:
                            Explore, Learn, Excel!
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-300">
                            Explore the rich world of Jukugo effortlessly with our
                            Flashcards feature. Master compound Kanji words in a snap,
                            making your Japanese language journey both enjoyable and
                            efficient. 🀄🎓
                        </p>
                        <div className="space-x-4">
                            <Button as={Link} href="/flashmap" className='btn-primary' size='lg'>Start Learning</Button>
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <Image
                            alt="jukugo"
                            className="shadow-md image-card border-4 border-border_orange aspect-[1/1] overflow-hidden rounded-xl object-cover"
                            height="500"
                            src="/assets/hero-2.jpg"
                            width="500"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JukugoSection