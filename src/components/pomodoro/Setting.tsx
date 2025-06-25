'use client';

import { useTimerStore } from '@/store/pomodoroState';
import { Card, CardBody, Input, Select, SelectItem } from '@heroui/react';

export default function Settings() {
  const { durations, setDuration, currentMode, setMode, roundsBeforeLongBreak, setRoundsBeforeLongBreak } = useTimerStore();

  return (
    <Card className="w-full max-w-md mt-8">
      <CardBody className="space-y-4">
        <Select
          label="Select Mode"
          selectedKeys={[currentMode]}
          onChange={(e) => setMode(e.target.value as any)}
        >
          <SelectItem key="pomodoro">Pomodoro</SelectItem>
          <SelectItem key="shortBreak">Short Break</SelectItem>
          <SelectItem key="longBreak">Long Break</SelectItem>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['pomodoro', 'shortBreak', 'longBreak'] as const).map((mode) => (
            <Input
              key={mode}
              type="number"
              min={1}
              label={`${mode} (minutes)`}
              value={durations[mode].toString()}
              onChange={(e) => setDuration(mode, Number(e.target.value))}
            />
          ))}
        </div>

        <Input
          type="number"
          min={1}
          label="Rounds before Long Break"
          value={roundsBeforeLongBreak.toString()}
          onChange={(e) => setRoundsBeforeLongBreak(Number(e.target.value))}
        />
      </CardBody>
    </Card>
  );
}
