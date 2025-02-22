import { relatedJukugoItem } from '@/types/jukugo';
import { create } from 'zustand';

type JukugoGroundState = {
  jukugo: relatedJukugoItem[];
  isLoading: boolean;
  isFlippedMode: boolean;
  isShuffledMode: boolean;
  selectedLevel: string;
  selectedChapter: number;
  noChapters: number[];
  level: number;
  isShowMeaning: boolean;
  jukugoPracticeData: any[];
};

type JukugoGroundActions = {
  setStartLoading: () => void;
  setStopLoading: () => void;
  setJukugo: (jukugo: relatedJukugoItem[]) => void;
  toggleIsFlippedMode: () => void;
  setShuffleMode: (isShuffledMode: boolean) => void;
  setSelectedLevel: (selectedLevel: string) => void;
  setSelectedChapter: (selectedChapter: number) => void;
  setNoChapters: (noChapters: number[]) => void;
  setLevel: (level: number) => void;
  toggleShowMeaning: () => void;
  setJukugoPracticeData: (jukugoPracticeData: any[]) => void;
};

const useJukugoGroundState = create<JukugoGroundState & JukugoGroundActions>((set) => ({
  // Initial State
  jukugo: [],
  isLoading: false,
  isFlippedMode: false,
  isShuffledMode: false,
  selectedLevel: 'N3',
  selectedChapter: 1,
  noChapters: Array.from({ length: 42 }, (_, index) => index + 1),
  level: 3,
  isShowMeaning: true,
  jukugoPracticeData: [],

  // Actions
  setStartLoading: () => set({ isLoading: true }),
  setStopLoading: () => set({ isLoading: false }),
  setJukugo: (jukugo) => set({ jukugo }),
  toggleIsFlippedMode: () => set((state) => ({ isFlippedMode: !state.isFlippedMode })),
  setShuffleMode: (isShuffledMode) => set({ isShuffledMode }),
  setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
  setSelectedChapter: (selectedChapter) => set({ selectedChapter }),
  setNoChapters: (noChapters) => set({ noChapters }),
  setLevel: (level) => set({ level }),
  toggleShowMeaning: () => set((state) => ({ isShowMeaning: !state.isShowMeaning })),
  setJukugoPracticeData: (jukugoPracticeData) => set({ jukugoPracticeData }),
}));

export default useJukugoGroundState;
