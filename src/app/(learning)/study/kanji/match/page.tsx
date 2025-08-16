import MatchKanji from '@/components/MatchKanji'
import React, { Suspense } from 'react'

const MatchKanjiPage = () => {
    return (
        <div className='min-h-screen w-full bg-[#f8fafc] dark:bg-background relative'>
            {/* Top Fade Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "transparent",
                    backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(236, 140, 72, 0.15) 0%, rgba(255, 221, 170, 0.05) 40%, transparent 70%)
   `,
                    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
                }}
            />

            <Suspense fallback={<p>Loading...</p>}>
                <MatchKanji />
            </Suspense>
        </div>
    )
}

export default MatchKanjiPage