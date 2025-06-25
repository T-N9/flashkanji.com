// store/pomodoroState.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

type TimerStore = {
  durations: Record<Mode, number>;
  currentMode: Mode;
  isRunning: boolean;
  pomodoroCount: number;
  roundsBeforeLongBreak: number;
  timeLeft: number;
  toggleRunning: () => void;
  setMode: (mode: Mode) => void;
  setDuration: (mode: Mode, value: number) => void;
  resetTimer: () => void;
  incrementPomodoroCount: () => void;
  setRoundsBeforeLongBreak: (count: number) => void;
  decrementTime: () => void;
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      durations: {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
      },
      currentMode: 'pomodoro',
      isRunning: false,
      pomodoroCount: 0,
      roundsBeforeLongBreak: 4,
      timeLeft: 25 * 60,

      toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

      setMode: (mode) =>
        set((s) => ({
          currentMode: mode,
          isRunning: false,
          timeLeft: s.durations[mode] * 60,
        })),

      setDuration: (mode, value) =>
        set((s) => {
          const updatedDurations = { ...s.durations, [mode]: value };
          const updatedTimeLeft = mode === s.currentMode ? value * 60 : s.timeLeft;
          return {
            durations: updatedDurations,
            timeLeft: updatedTimeLeft,
          };
        }),

      resetTimer: () =>
        set((s) => ({
          isRunning: false,
          timeLeft: s.durations[s.currentMode] * 60,
        })),

      incrementPomodoroCount: () =>
        set((s) => ({ pomodoroCount: s.pomodoroCount + 1 })),

      setRoundsBeforeLongBreak: (count) => set({ roundsBeforeLongBreak: count }),

      decrementTime: () =>
        set((s) => ({ timeLeft: s.timeLeft > 0 ? s.timeLeft - 1 : 0 })),
    }),
    {
      name: 'pomodoro-timer', // 🔐 localStorage key
      partialize: (state) => ({
        durations: state.durations,
        currentMode: state.currentMode,
        isRunning: state.isRunning,
        timeLeft: state.timeLeft,
        pomodoroCount: state.pomodoroCount,
        roundsBeforeLongBreak: state.roundsBeforeLongBreak,
      }),
    }
  )
);
