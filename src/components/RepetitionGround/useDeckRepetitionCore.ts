"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import { Clicked_Item, SR_DeckCard } from "@/util";
import useKanjiGroundState from "@/store/kanjiGroundState";
import useJukugoGroundState from "@/store/jukugoGroundState";
import { usePathname } from "@/i18n/navigation";

export default function useDeckRepetitionCore<T extends { id: number }>(
  rawData: T[]
) {

  const [spacedRepetitionData, setSpacedRepetitionData] = useState<
    SR_DeckCard[]
  >([]);
  const [clickedRepetitionData, setClickedRepetitionData] = useState<
    Clicked_Item[]
  >([]);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [satisfactionPoint, setSatisfactionPoint] = useState<number>(0);
  const isInitialized = useRef(false);
  const { level } = useKanjiGroundState();
  const { level: levelJukugo } = useJukugoGroundState();
  const pathname = usePathname();

  const shuffledData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    const copy = [...rawData];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [rawData]);

  const handlePrepareRepetitionData = () => {
    if (!isInitialized.current && shuffledData.length > 0) {
      setActiveItem(shuffledData[0].id);
      setClickedRepetitionData(
        shuffledData.map((item) => ({ id: item.id, clickedLevel: 0 }))
      );

      const initial = shuffledData.map((item) => ({
        id: item.id, /* card_id */
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date(),
        previousClick: null,
        level: pathname.includes("jukugo") ? levelJukugo : level,
      }));
      setSpacedRepetitionData(initial);
      // localStorage.setItem("spacedRepetitionData", JSON.stringify(initial));

      isInitialized.current = true;
    }
  };

  useEffect(() => {
    handlePrepareRepetitionData();
  }, [shuffledData]);

  // console.log(pathname.includes("jukugo"))

  const handleClickLevel = (id: number, level: number) => {
    const temp = [...clickedRepetitionData];
    const index = temp.findIndex((item) => item.id === id);
    // console.log({ level, id, index });
    if (index === -1) return;

    if (level === 3) {
      temp.splice(index, 1);
    } else {
      const newIndex = Math.min(temp.length, index + (level === 0 ? 2 : 4));
      const [item] = temp.splice(index, 1);
      temp.splice(newIndex, 0, item);
    }

    setClickedRepetitionData(temp);
    if (temp.length > 0) setActiveItem(temp[0].id);
  };

  const handleRestart = () => {
    isInitialized.current = false;
    handlePrepareRepetitionData();
  };

  return {
    shuffledData,
    spacedRepetitionData,
    setSpacedRepetitionData,
    clickedRepetitionData,
    setClickedRepetitionData,
    activeItem,
    setActiveItem,
    satisfactionPoint,
    setSatisfactionPoint,
    handleClickLevel,
    handleRestart,
  };
}
