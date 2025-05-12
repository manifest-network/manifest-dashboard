export const IntervalMap: Record<TimeSpan, TimeScale> = {
  "1 hour": "1 minute",
  "1 day": "1 hour",
  "1 week": "1 day",
  "1 month": "1 day",
  "3 months": "1 day",
  "1 year": "1 week",
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
