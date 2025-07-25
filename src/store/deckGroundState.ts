import { DeckItem } from "@/types/deckItem";
import { formatDate, normalizeDate } from "@/util";
import { create } from "zustand";

type DeckGroundState = {
  deckData: DeckItem[];

  isFlippedMode: boolean;
  isShuffledMode: boolean;
  shuffledData: string[];
  deckId: number | null;
  srsId: number | null;

  isReviewMode: boolean;

  selectedReviewDate: string;
  isReviewByDate: boolean;
  noOfCards: string;
};

type DeckGroundActions = {
  setDeckData: (kanji: DeckItem[]) => void;
  toggleIsFlippedMode: () => void;

  setShuffleMode: (isShuffledMode: boolean) => void;
  setShuffledData: (shuffledData: string[]) => void;
  setSelectedReviewDate: (date: string) => void;
  setDeckId: (id: number) => void;
  setSrsId: (id: number) => void;
  setIsReviewMode: (isReviewMode: boolean) => void;
  setIsReviewByDate: (isReviewByDate: boolean) => void;
  setNoOfCards: (noOfCards: string) => void;
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
    srsId: null,
    isReviewByDate: false,
    noOfCards: "20",
    // Actions

    setDeckData: (deckData) => set({ deckData }),

    toggleIsFlippedMode: () =>
      set((state) => ({ isFlippedMode: !state.isFlippedMode })),

    setShuffleMode: (isShuffledMode) => set({ isShuffledMode }),
    setShuffledData: (shuffledData) => set({ shuffledData }),

    setIsReviewMode: (isReviewMode) => set({ isReviewMode }),
    setSelectedReviewDate: (date) => set({ selectedReviewDate: date }),
    setDeckId: (deckId) => set({ deckId }),
    setSrsId: (srsId) => set({ srsId }),
    setIsReviewByDate: (isReviewByDate) => set({ isReviewByDate }),
    setNoOfCards: (noOfCards) => set({ noOfCards }),
  })
);

export default useDeckGroundState;
