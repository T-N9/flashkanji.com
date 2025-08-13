import React, { Suspense } from 'react'
import KanjiGround from '@/components/KanjiPage'
import { KanjiSwiperModal } from '@/components/KanjiSwiperModal/KanjiSwiperModal'
import { KanjiDetailModal } from '@/components/modals/KanjiDetailModal'

const KanjiPage = () => {

  return (
    <>
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
        {/* Magenta Orb Grid Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "white",
            backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(236, 140, 72, 0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
   `,
            backgroundSize: "40px 40px, 40px 40px, 100% 100%",
          }}
        />
        <Suspense fallback={<p>Loading...</p>}>
          <KanjiGround />
        </Suspense>
        <KanjiSwiperModal />
        <KanjiDetailModal />
      </div>
    </>
  )
}

export default KanjiPage