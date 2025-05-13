import useKanjiGroundState from "@/store/kanjiGroundState";
import { useEffect } from "react";

export const useKanjiSetting = () => {
  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

  const {
    selectedChapter: chapter,
    level,
    selectedMultiChapters: chapters,
    noChapters,
    setNoChapters,
    setSelectedMultiChapters,
    selectedMultiChapters,
    isFlippedMode,
    toggleIsFlippedMode,
    setKanji,
    setLevel,
    setSelectedLevel,
    setSelectedChapter,
    isParted,
    part,
  } = useKanjiGroundState();

  useEffect(() => {
    if (chapters) {
      // const chapterArray = chapters?.split(",").map(Number);
      setSelectedMultiChapters(chapters);
    }
  }, [chapters]);

  const updateQueryParams = (key: string, value: string) => {
    if (key === "chapters") {
      setSelectedMultiChapters(value.split(",").map(Number));
    } else if (key === "level" || key === "chapter") {
      if (key === "level") {
        setLevel(Number(value));
        setSelectedLevel("N" + value);
        setSelectedChapter(1);
      } else {
        setSelectedChapter(Number(value));
      }
    }
  };

  const handleIncludedChapterClick = (item: number) => {
    const isSelected = selectedMultiChapters.includes(item);
    // console.log({item, isSelected})
    setSelectedMultiChapters(
      isSelected
        ? selectedMultiChapters.filter((selectedItem) => selectedItem !== item)
        : [...selectedMultiChapters, item]
    );
  };

  // console.log({selectedMultiChapters})

  return {
    noChapters,
    chapters,
    selectedMultiChapters,
    setSelectedMultiChapters,
    level,
    chapter,
    updateQueryParams,
    setNoChapters,
    setKanji,
    n5NoChapters,
    n4NoChapters,
    n3NoChapters,
    handleIncludedChapterClick,
    isFlippedMode,
    toggleIsFlippedMode,
    isParted,
    part,
  };
};
