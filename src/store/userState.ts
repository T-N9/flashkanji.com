// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  username: string;
  userId: string;
  japanese_level: string;
  email: string;
  created_at: string | undefined;
  setUser: (user: Partial<UserState>) => void;
  resetUser: () => void;
  avatarUrl: string;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  userId: "",
  japanese_level: "",
  email: "",
  avatarUrl: "",
  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user,
    })),
  created_at: undefined,
  resetUser: () =>
    set({
      username: "",
      userId: "",
      japanese_level: "",
      email: "",
      created_at: undefined,
      avatarUrl: "",
    }),
}));
