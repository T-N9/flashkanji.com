"use client";
import React from "react";
import { usePathname } from "next/navigation";

import KanjiRepetitionSection from "./KanjiRepetitionSection";
import JukugoRepetitionSection from "./JukugoRepetitionSection";

const SpacedRepetition = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen">
      <div className="mt-5">
        {pathname === "/study/kanji/repetition" ? (
          <KanjiRepetitionSection />
        ) : (
          <JukugoRepetitionSection />
        )}
      </div>
    </div>
  );
};

export default SpacedRepetition;
