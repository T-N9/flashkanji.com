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
  xp_points: number;
  lives: number;
  timeToRestoreHeart: string;
  setXpPoints: (point: number) => void;
  setLives: (live: number) => void;
  setTimeToRestoreHeart: (time: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  userId: "",
  japanese_level: "N3",
  japanese_chapter: 1,
  email: "",
  avatarUrl: "",
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
  rank: 1,
  lives: 5,
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
      rank: 1,
    }),
  todayReviewCount: 0,
  setToDayReviewCount: (count) => set({ todayReviewCount: count }),
  expiredReviewCount: 0,
  setExpiredReviewCount: (count) => set({ expiredReviewCount: count }),
  setXpPoints: (point) => set({ xp_points: point }),
  setLives: (live) => set({ lives: live }),
  setTimeToRestoreHeart: (time) => set({ timeToRestoreHeart: time }),
}));
