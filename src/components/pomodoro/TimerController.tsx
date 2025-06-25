'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/store/pomodoroState';

export default function TimerController() {
  const {
    isRunning,
    timeLeft,
    toggleRunning,
    setMode,
    incrementPomodoroCount,
    currentMode,
    roundsBeforeLongBreak,
    pomodoroCount,
    decrementTime,
  } = useTimerStore();

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      new Audio('/assets/alarm.mp3').play();
      toggleRunning();

      if (currentMode === 'pomodoro') {
        incrementPomodoroCount();
        if ((pomodoroCount + 1) % roundsBeforeLongBreak === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        setMode('pomodoro');
      }
      return;
    }

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    toggleRunning,
    setMode,
    incrementPomodoroCount,
    currentMode,
    roundsBeforeLongBreak,
    pomodoroCount,
    decrementTime,
  ]);

  return null; // it's invisible, just controls the countdown globally
}
