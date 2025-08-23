"use client";
import React from "react";

import KanjiRepetitionSection from "./KanjiRepetitionSection";
import JukugoRepetitionSection from "./JukugoRepetitionSection";
import { usePathname } from "@/i18n/navigation";

const SpacedRepetition = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen">
      <div className="pt-5">
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
