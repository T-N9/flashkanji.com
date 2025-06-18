"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clicked_Item, SR_KanjiCard } from "@/util";
import useKanjiGroundState from "@/store/kanjiGroundState";

export default function useRepetitionCore<T extends { id: number }>(rawData: T[]) {
  const router = useRouter();

  const [spacedRepetitionData, setSpacedRepetitionData] = useState<SR_KanjiCard[]>([]);
  const [clickedRepetitionData, setClickedRepetitionData] = useState<Clicked_Item[]>([]);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [satisfactionPoint, setSatisfactionPoint] = useState<number>(0);
  const isInitialized = useRef(false);
    const { level } = useKanjiGroundState();

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
      setClickedRepetitionData(shuffledData.map((item) => ({ id: item.id, clickedLevel: 0 })));

        const initial = shuffledData.map((item) => ({
          id: item.id,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewDate: new Date(),
          previousClick: null,
          level : level
        }));
        setSpacedRepetitionData(initial);
        // localStorage.setItem("spacedRepetitionData", JSON.stringify(initial));
      

      isInitialized.current = true;
    }
  };

  useEffect(() => {
    handlePrepareRepetitionData();
  }, [shuffledData]);

  const handleClickLevel = (id: number, level: number) => {
    const temp = [...clickedRepetitionData];
    const index = temp.findIndex((item) => item.id === id);
    console.log({level, id, index});
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



  const getConfidenceEmoji = (confidence: number) => {
    if (confidence <= -10) return "😵";
    if (confidence < 0) return "😖";
    if (confidence === 0) return "😕";
    if (confidence <= 4) return "😐";
    if (confidence <= 9) return "🙂";
    if (confidence <= 14) return "😊";
    if (confidence <= 19) return "😁";
    if (confidence <= 24) return "😃";
    return "🤩";
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
    getConfidenceEmoji,
  };
}
