import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-14 lg:py-16">
    <div className="main-container">
      <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
        <div className="space-y-4 flex flex-col justify-center">
          <h1 className="lg:leading-tighter text-dark text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Master Kanji with{" "}
            <span className="text-primary">
              <span className="outlined_title tracking-wide">
                FlashKanji
              </span>
              <br /> フラッシュ漢字
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Discover Kanji interactively at FlashKanji. Use flashcards,
            learn Jukugo, and master stroke order. Start your Japanese
            adventure now! 🀄🖌️
          </p>
          <div className="space-x-4">
              <Button as={Link} href="/flashmap" className="btn-primary" size="lg">Start Learning</Button>
          </div>
        </div> 
        <div className="flex justify-center lg:justify-end">
          <Image
            alt="jukugo"
            className=" shadow-md image-card border-4 border-border_orange aspect-[1/1] overflow-hidden rounded-xl object-cover"
            height="500"
            src="/assets/hero-1.jpg"
            width="500"
          />
        </div>
      </div>
    </div>
  </section>
  )
}

export default HeroSection