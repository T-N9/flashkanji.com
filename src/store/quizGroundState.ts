import { create } from "zustand";

interface QuizGroundState {
  level: number;
  selectedLevel: string;
  selectedChapter: number;
  selectedMultiChapters: string[];
  currentMark: number;
  answeredCount: number;
  selectedMode: number;

  setLevel: (level: number) => void;
  setSelectedLevel: (level: string) => void;
  setSelectedChapter: (chapter: number) => void;

  setSelectedMultiChapters: (chapters: string[]) => void;
  increaseMark: () => void;
  decreaseMark: () => void;
  resetQuizState: () => void;
  increaseAnsweredCount: () => void;
  setQuizMode: (mode: number) => void;
  isParted: boolean;
  setIsParted: (isParted: boolean) => void;
  setPart: (part: "0" | "1" | null) => void;
  part: "0" | "1" | null;
}

const useQuizGroundStore = create<QuizGroundState>((set) => ({
  level: 5,
  selectedLevel: "",
  selectedChapter: 0,
  selectedMultiChapters: [],
  currentMark: 0,
  answeredCount: 0,
  selectedMode: 1,
  isParted: false,
  part: "0",

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
  setIsParted: (isParted) => set({ isParted }),
  setPart: (part) =>
    set(
      part === null
        ? { part: null }
        : part === "0"
        ? { part: "0" }
        : { part: "1" }
    ),
}));

export default useQuizGroundStore;
