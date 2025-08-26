"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Clicked_Item, SR_KanjiCard } from "@/util";
import useKanjiGroundState from "@/store/kanjiGroundState";
import { useUserStore } from "@/store/userState";

export default function useRepetitionReview<T extends { id: number }>(rawData: T[], fetchedRepetitionData?: SR_KanjiCard[]) {
  const [spacedRepetitionData, setSpacedRepetitionData] = useState<SR_KanjiCard[]>([]);
  const [clickedRepetitionData, setClickedRepetitionData] = useState<Clicked_Item[]>([]);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [satisfactionPoint, setSatisfactionPoint] = useState<number>(0);
  const isInitialized = useRef(false);

  const { level } = useKanjiGroundState();
  const { clearUserRepetitionTrackData } = useUserStore();

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

      
      if (fetchedRepetitionData && fetchedRepetitionData.length > 0) {
        // console.log({fetchedRepetitionData})
        setSpacedRepetitionData(fetchedRepetitionData);
      } else {
        console.log( "No stored repetition data found, initializing new data.");
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
      }

      isInitialized.current = true;
    }
  };

  useEffect(() => {
    handlePrepareRepetitionData();
  }, [shuffledData, fetchedRepetitionData]);

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
    clearUserRepetitionTrackData();
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
