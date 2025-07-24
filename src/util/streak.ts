import { format } from 'date-fns';

const STREAK_KEY = 'savedStreak';

export function saveStreakToLocalStorage(): void {
  const today = format(new Date(), 'yyyy-MM-dd');
  localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today }));
}

export function hasSavedStreakToday(): boolean {
  const item = localStorage.getItem(STREAK_KEY);
  if (!item) return false;

  try {
    const { date } = JSON.parse(item);
    const today = format(new Date(), 'yyyy-MM-dd');
    return date === today;
  } catch (error) {
    console.error("Invalid savedStreak data:", error);
    return false;
  }
}
