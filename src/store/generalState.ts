import { create } from "zustand";

interface GeneralState {
  /* FlashGround */
  isFlashModalOpen: boolean;
  isSettingOpen: boolean;
  isDetailModalOpen: boolean;
  currentDetail: any;

  /* JukugoGround */
  isJukugoModalOpen: boolean;
  isJukugoDetailModalOpen: boolean;
  jukugoDetail: {character : string, hiragana: string, meaning : string} | null;
  userInfo: any;

  /* Actions */
  toggleFlashModal: () => void;
  toggleSetting: () => void;
  toggleDetailModal: () => void;
  setCurrentDetail: (detail: any) => void;

  toggleJukugoModal: () => void;
  toggleJukugoDetailModal: () => void;
  setJukugoDetail: (detail: {character : string, hiragana: string, meaning : string} | null) => void;
  setUserInfo: (userInfo: any) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({
  /* FlashGround */
  isFlashModalOpen: false,
  isSettingOpen: true,
  isDetailModalOpen: false,
  currentDetail: null,

  /* JukugoGround */
  isJukugoModalOpen: false,
  isJukugoDetailModalOpen: false,
  jukugoDetail: null,
  userInfo: null,

  /* Actions */
  toggleFlashModal: () =>
    set((state) => ({ isFlashModalOpen: !state.isFlashModalOpen })),
  toggleSetting: () =>
    set((state) => ({ isSettingOpen: !state.isSettingOpen })),
  toggleDetailModal: () =>
    set((state) => ({ isDetailModalOpen: !state.isDetailModalOpen })),
  setCurrentDetail: (detail) => set({ currentDetail: detail }),

  toggleJukugoModal: () =>
    set((state) => ({ isJukugoModalOpen: !state.isJukugoModalOpen })),
  toggleJukugoDetailModal: () =>
    set((state) => ({
      isJukugoDetailModalOpen: !state.isJukugoDetailModalOpen,
    })),
  setJukugoDetail: (detail) => set({ jukugoDetail: detail }),
  setUserInfo: (userInfo) => set({ userInfo }),
}));
