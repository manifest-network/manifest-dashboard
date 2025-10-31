export const IntervalMap: Record<TimeSpan, TimeScale> = {
  "1 hour": "1 minute",
  "1 day": "1 minute",
  "1 week": "1 hour",
  "1 month": "5 hours",
  "3 months": "5 hours",
  "1 year": "12 hours",
}

export const ALLOWED_INTERVALS: TimeSpan[] = [
  "1 hour",
  "1 day",
  "1 week",
  "1 month",
  "3 months",
  "1 year",
];

export function isValidTimeInterval(interval: string | null): interval is TimeSpan {
  return !!interval && ALLOWED_INTERVALS.includes(interval as TimeSpan);
}

export function getIntervalStartDate(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case '1 minute':
      now.setMinutes(now.getMinutes() - 1);
      break;
    case '1 hour':
      now.setHours(now.getHours() - 1);
      break;
    case '1 day':
      now.setDate(now.getDate() - 1);
      break;
    case '1 week':
      now.setDate(now.getDate() - 7);
      break;
    case '1 month':
      now.setMonth(now.getMonth() - 1);
      break;
    case '3 months':
      now.setMonth(now.getMonth() - 3);
      break;
    case '1 year':
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now;
}
