import { Kanji } from "@/types/kanji";
import { create } from "zustand";

type FlashGroundState = {
  kanji: Kanji[];
  isLoading: boolean;
  level: number;
  selectedLevel: string;
  selectedChapter: number;
  selectedMultiChapters: number[];
  searchValue: string;
  isFlippedMode: boolean;
  noChapters: number[];
  isPaginated: boolean;
  isShuffledMode: boolean;
  shuffledData: string[];
  kanjiPracticeData: string[];
  isParted: boolean;
  setIsParted: (isParted: boolean) => void;
  setPart: (part: string) => void;
  part: "0" | "1" | null;
};

type FlashGroundActions = {
  setStartLoading: () => void;
  setStopLoading: () => void;
  setLevel: (level: number) => void;
  setSelectedLevel: (selectedLevel: string) => void;
  setSelectedChapter: (selectedChapter: number) => void;
  setKanji: (kanji: Kanji[]) => void;
  setSelectedMultiChapters: (selectedMultiChapters: number[]) => void;
  setSearchValue: (searchValue: string) => void;
  toggleIsFlippedMode: () => void;
  setNoChapters: (noChapters: number[]) => void;
  setIsPaginated: (isPaginated: boolean) => void;
  setShuffleMode: (isShuffledMode: boolean) => void;
  setShuffledData: (shuffledData: string[]) => void;
  setKanjiPracticeData: (kanjiPracticeData: string[]) => void;
};

const useKanjiGroundState = create<FlashGroundState & FlashGroundActions>((set) => ({
  // Initial State
  kanji: [],
  isLoading: false,
  level: 5,
  selectedLevel: "N5",
  selectedChapter: 1,
  selectedMultiChapters: [],
  searchValue: "",
  isFlippedMode: false,
  noChapters: Array.from({ length: 11 }, (_, index) => index + 1),
  isPaginated: true,
  isShuffledMode: false,
  shuffledData: [],
  kanjiPracticeData: [],
  isParted: false,
  part: "0",

  // Actions
  setStartLoading: () => set({ isLoading: true }),
  setStopLoading: () => set({ isLoading: false }),
  setLevel: (level) => set({ level }),
  setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
  setSelectedChapter: (selectedChapter) => set({ selectedChapter }),
  setKanji: (kanji) => set({ kanji }),
  setSelectedMultiChapters: (selectedMultiChapters) =>
    set({ selectedMultiChapters }),
  setSearchValue: (searchValue) => set({ searchValue }),
  toggleIsFlippedMode: () =>
    set((state) => ({ isFlippedMode: !state.isFlippedMode })),
  setNoChapters: (noChapters) => set({ noChapters }),
  setIsPaginated: (isPaginated) => set({ isPaginated }),
  setShuffleMode: (isShuffledMode) => set({ isShuffledMode }),
  setShuffledData: (shuffledData) => set({ shuffledData }),
  setKanjiPracticeData: (kanjiPracticeData) =>
    set({ kanjiPracticeData }),
  setIsParted: (isParted) => set({ isParted }),
  setPart: (part) => set(part === "0" ? { part: "0" } : { part: "1"})
}));

export default useKanjiGroundState;
