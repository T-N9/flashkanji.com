import { DeckItem } from "@/types/deckItem";
import { formatDate, normalizeDate } from "@/util";
import { create } from "zustand";

type DeckGroundState = {
  deckData: DeckItem[];

  isFlippedMode: boolean;
  isShuffledMode: boolean;
  shuffledData: string[];
  deckId: number | null;

  isReviewMode: boolean;
  setIsReviewMode: (isReviewMode: boolean) => void;
  selectedReviewDate: string;
};

type DeckGroundActions = {
  setDeckData: (kanji: DeckItem[]) => void;
  toggleIsFlippedMode: () => void;

  setShuffleMode: (isShuffledMode: boolean) => void;
  setShuffledData: (shuffledData: string[]) => void;
  setSelectedReviewDate: (date: string) => void;
  setDeckId: (id: number) => void;
};

const useDeckGroundState = create<DeckGroundState & DeckGroundActions>(
  (set) => ({
    // Initial State
    deckData: [],

    isFlippedMode: false,

    isShuffledMode: false,
    shuffledData: [],

    isReviewMode: false,
    selectedReviewDate: formatDate(normalizeDate(new Date())),
    deckId: null,

    // Actions

    setDeckData: (deckData) => set({ deckData }),

    toggleIsFlippedMode: () =>
      set((state) => ({ isFlippedMode: !state.isFlippedMode })),

    setShuffleMode: (isShuffledMode) => set({ isShuffledMode }),
    setShuffledData: (shuffledData) => set({ shuffledData }),

    setIsReviewMode: (isReviewMode) => set({ isReviewMode }),
    setSelectedReviewDate: (date) => set({ selectedReviewDate: date }),
    setDeckId: (deckId) => set({ deckId }),
  })
);

export default useDeckGroundState;
