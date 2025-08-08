export function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of the day

  const inputDate = new Date(dateStr);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate.getTime() > today.getTime();
}
