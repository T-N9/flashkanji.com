// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  username: string;
  userId: string;
  japanese_level: "N3" | "N4" | "N5";
  japanese_chapter: number;
  email: string;
  created_at: string | undefined;
  setUser: (user: Partial<UserState>) => void;
  resetUser: () => void;
  avatarUrl: string;
  todayReviewCount: number;
  setToDayReviewCount: (count: number) => void;
  expiredReviewCount: number;
  setExpiredReviewCount: (count: number) => void;
  totalLearned: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  resume_learning_section: { chapter: number | null; level: number | null };
  xp_points: number;
  lives: number;
  timeToRestoreHeart: string;
  waniExists: boolean;
  setXpPoints: (point: number) => void;
  setLives: (live: number) => void;
  setTimeToRestoreHeart: (time: string) => void;
  setWaniExists: (exists: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  userId: "",
  japanese_level: "N3",
  japanese_chapter: 1,
  email: "",
  avatarUrl: "",
  waniExists: false,

  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user,
    })),
  created_at: undefined,
  totalLearned: 0,
  totalHours: 0,
  currentStreak: 0,
  longestStreak: 0,
  xp_points: 0,
  rank: 0,
  lives: 5,
  resume_learning_section: { chapter: null, level: null },
  timeToRestoreHeart: "",
  resetUser: () =>
    set({
      username: "",
      userId: "",
      japanese_level: "N3",
      japanese_chapter: 1,
      email: "",
      created_at: undefined,
      avatarUrl: "",
      totalLearned: 0,
      totalHours: 0,
      currentStreak: 0,
      longestStreak: 0,
      lives: 5,
      xp_points: 0,
      rank: 0,
      resume_learning_section: { chapter: null, level: null },
      waniExists: false,
    }),
  todayReviewCount: 0,
  setToDayReviewCount: (count) => set({ todayReviewCount: count }),
  expiredReviewCount: 0,
  setExpiredReviewCount: (count) => set({ expiredReviewCount: count }),
  setXpPoints: (point) => set({ xp_points: point }),
  setLives: (live) => set({ lives: live }),
  setTimeToRestoreHeart: (time) => set({ timeToRestoreHeart: time }),
  setWaniExists: (exists: boolean) => set({ waniExists: exists }),
}));
