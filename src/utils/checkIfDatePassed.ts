import { DateTime } from 'luxon';

export function checkIfDatePassed(date: string): boolean {
  const taskDate = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm');
  return taskDate < DateTime.local();
}
