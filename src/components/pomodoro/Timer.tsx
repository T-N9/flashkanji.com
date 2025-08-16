'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/store/pomodoroState';
import { Card, CardBody, Button, Chip, Progress } from '@heroui/react';
import { useSaveTimer } from '@/services/progress';
import { useUserStore } from '@/store/userState';

export default function Timer() {
  const {
    durations,
    currentMode,
    isRunning,
    toggleRunning,
    resetTimer,
    setMode,
    incrementPomodoroCount,
    pomodoroCount,
    roundsBeforeLongBreak,
    timeLeft,
    decrementTime,
  } = useTimerStore();

  const { mutate: saveTimer } = useSaveTimer();
  const { userId } = useUserStore()

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      toggleRunning();
      new Audio('/assets/alarm.mp3').play();



      if (currentMode === 'pomodoro') {
        saveTimer({ user_id: userId, duration_minutes: durations.pomodoro }, {
          onSuccess: () => {
            console.log('Timer saved successfully')
            incrementPomodoroCount();
          },
        });

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

    const timer = setInterval(() => decrementTime(), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentMode, pomodoroCount, roundsBeforeLongBreak, toggleRunning, setMode, incrementPomodoroCount, decrementTime]);

  const total = durations[currentMode] * 60;
  const percent = ((total - timeLeft) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="w-full max-w-md text-center py-6">
      <CardBody className='text-center'>
        <h1 className="text-xl font-bold mb-2 text-dark dark:text-gray-100">
          {currentMode === 'pomodoro' ? 'Time to focus.' : currentMode === 'shortBreak' ? 'Take a rest.' : 'Relax, it is time to reward yourself.'}
        </h1>
        <Chip color="secondary" variant="flat" className="mb-4 mx-auto">#{pomodoroCount}</Chip>
        <div className="text-6xl font-mono mb-4 text-dark dark:text-gray-100">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <Progress
          size="sm"
          aria-label="timer progress"
          value={percent}
          className="mb-6"
          color={currentMode === 'pomodoro' ? 'primary' : currentMode === 'shortBreak' ? 'success' : 'warning'}
        />
        <div className="flex justify-center gap-4">
          <Button color="primary" onClick={toggleRunning} variant="shadow">
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button color="danger" onClick={resetTimer} variant="shadow">
            Reset
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}