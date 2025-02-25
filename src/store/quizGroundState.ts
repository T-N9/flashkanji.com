import { create } from "zustand";

interface QuizGroundState {
  level: number;
  selectedLevel: string;
  selectedChapter: string;
  selectedMultiChapters: string[];
  currentMark: number;
  answeredCount: number;
  selectedMode: number;

  setLevel: (level: number) => void;
  setSelectedLevel: (level: string) => void;
  setSelectedChapter: (chapter: string) => void;

  setSelectedMultiChapters: (chapters: string[]) => void;
  increaseMark: () => void;
  decreaseMark: () => void;
  resetQuizState: () => void;
  increaseAnsweredCount: () => void;
  setQuizMode: (mode: number) => void;
}

const useQuizGroundStore = create<QuizGroundState>((set) => ({
  level: 5,
  selectedLevel: "",
  selectedChapter: "",
  selectedMultiChapters: [],
  currentMark: 0,
  answeredCount: 0,
  selectedMode: 1,

  setLevel: (level) => set({ level }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),

  setSelectedMultiChapters: (chapters) =>
    set({ selectedMultiChapters: chapters }),
  increaseMark: () => set((state) => ({ currentMark: state.currentMark + 1 })),
  decreaseMark: () => set((state) => ({ currentMark: state.currentMark - 1 })),
  resetQuizState: () => set({ currentMark: 0, answeredCount: 0 }),
  increaseAnsweredCount: () =>
    set((state) => ({ answeredCount: state.answeredCount + 1 })),
  setQuizMode: (mode) => set({ selectedMode: mode }),
}));

export default useQuizGroundStore;
