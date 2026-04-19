/** Local calendar day key (YYYY-MM-DD) for daily challenge resets. */
export function getLocalDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDayKey(dayKey: string): Date {
  const [y, mo, da] = dayKey.split("-").map(Number);
  return new Date(y, mo - 1, da);
}

/** 1-based program day: first calendar day of the challenge = Day 1. */
export function programChallengeDay(startedOnDayKey: string, todayKey: string): number {
  const start = parseLocalDayKey(startedOnDayKey);
  const today = parseLocalDayKey(todayKey);
  const diffDays = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, diffDays + 1);
}

export function dayKeyDaysAgo(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return getLocalDayKey(d);
}
