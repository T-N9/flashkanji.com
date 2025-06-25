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
      <Chip
        color={color}
        variant="shadow"
        startContent={<Clock size={16} />}
        className="font-semibold"
      >
        {label} {isRunning ? '⏳' : '⏸️'}
      </Chip>
    </Tooltip>
  );
}
