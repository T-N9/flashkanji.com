// components/PomodoroIndicator.tsx
'use client';

import { useTimerStore } from '@/store/pomodoroState';
import { Chip, Tooltip } from '@heroui/react';
import { Clock } from '@phosphor-icons/react';


export default function Indicator() {
  const { currentMode, isRunning, timeLeft } = useTimerStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const label =
    currentMode === 'pomodoro'
      ? 'Focus'
      : currentMode === 'shortBreak'
        ? 'Short Break'
        : 'Long Break';

  const color =
    currentMode === 'pomodoro'
      ? 'primary'
      : currentMode === 'shortBreak'
        ? 'success'
        : 'warning';

  return (
    <Tooltip content={`${label} • ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}>
      <div className='relative'>
        <img src="/assets/icons/pomodoro.png" className="w-20 h-20 lg:w-10 lg:h-10" width={40} height={40} />
        <span className={`${isRunning && 'animate-bounce'} absolute top-0 right-0 drop-shadow  border bg-white rounded text-xs`}>{isRunning ? '⏸️' : '▶️'}</span>
      </div>

    </Tooltip>
  );
}
