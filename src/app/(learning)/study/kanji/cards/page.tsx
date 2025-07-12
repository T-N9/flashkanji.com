import KanjiGround from '@/components/KanjiPage'
import { KanjiSwiperModal } from '@/components/KanjiSwiperModal/KanjiSwiperModal'
import { KanjiDetailModal } from '@/components/modals/KanjiDetailModal'
import React, { Suspense } from 'react'

const KanjiPage = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
        {/* Top Fade Grid Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
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