'use client';

import { Progress } from '@heroui/react';
import { useEffect, useState } from 'react';

type Props = {
  total: number;
  left: number; // cards left
};

export default function CardProgress({ total, left }: Props) {
  const [progressValue, setProgressValue] = useState(0);

  // Calculate completed percent
  const completed = Math.max(0, total - left);
  const percent = total ? (completed / total) * 100 : 0;

  // Only update when value changes (avoids restarting animation from 0)
  useEffect(() => {
    setProgressValue(percent);
  }, [percent]);

  return (
    <Progress
      size="sm"
      radius="full"
      value={progressValue}
      className="max-w-xs mx-auto transition-all duration-300 text-xs text-center"
      label={`${left} cards left`}
    />
  );
}
