import {BigNumber} from "bignumber.js";
import type {ChartDataPoint} from "$lib/schemas/charts";

// Average number of days in a month (365.25 days per year / 12 months).
// Kept as a literal (30.44) to preserve existing behavior.
const AVERAGE_DAYS_PER_MONTH = 30.44;

// Locally-configured BigNumber for the all-time division (explicit precision,
// no global side-effects).
const RateBN = BigNumber.clone({ DECIMAL_PLACES: 20, ROUNDING_MODE: BigNumber.ROUND_HALF_UP });

// Fixed warm-up: skip points within this elapsed window after launch to avoid a
// divide-by-near-zero spike. Fixed (not unit-dependent) so the all-time line's start
// does not move when the user changes the display unit.
export const MIN_ELAPSED_MS = 24 * 60 * 60 * 1000; // 1 day

export const MS_PER_UNIT: Record<RateUnit, number> = {
  per_5min: 5 * 60 * 1000,
  per_15min: 15 * 60 * 1000,
  per_hour: 60 * 60 * 1000,
  per_day: 24 * 60 * 60 * 1000,
  per_week: 7 * 24 * 60 * 60 * 1000,
  per_month: AVERAGE_DAYS_PER_MONTH * 24 * 60 * 60 * 1000,
};

export const RATE_UNIT_LABELS: Record<RateUnit, string> = {
  per_5min: "Per 5 Min",
  per_15min: "Per 15 Min",
  per_hour: "Per Hour",
  per_day: "Per Day",
  per_week: "Per Week",
  per_month: "Per Month",
};

export const RATE_UNITS_BY_TIMESPAN: Record<TimeSpan, { units: RateUnit[], default: RateUnit }> = {
  '1 hour': { units: ['per_5min', 'per_15min'], default: 'per_5min' },
  '1 day': { units: ['per_15min', 'per_hour'], default: 'per_hour' },
  '1 week': { units: ['per_hour', 'per_day'], default: 'per_day' },
  '1 month': { units: ['per_day', 'per_week'], default: 'per_day' },
  '3 months': { units: ['per_day', 'per_week', 'per_month'], default: 'per_week' },
  '1 year': { units: ['per_day', 'per_week', 'per_month'], default: 'per_month' },
};

export const ALLOWED_RATE_UNITS: RateUnit[] = [
  'per_5min', 'per_15min', 'per_hour', 'per_day', 'per_week', 'per_month'
];

export const VALID_TIMESPANS: TimeSpan[] = [
  '1 hour', '1 day', '1 week', '1 month', '3 months', '1 year'
];

export function isValidRateUnit(unit: string | null): unit is RateUnit {
  return !!unit && ALLOWED_RATE_UNITS.includes(unit as RateUnit);
}

export function isValidTimeSpan(span: string | null): span is TimeSpan {
  return !!span && VALID_TIMESPANS.includes(span as TimeSpan);
}

/**
 * Drop bad/missing samples from a monotonically non-decreasing cumulative counter.
 * Input/output are sorted DESC by date (newest first). Walking oldest->newest,
 * any point that falls below the running maximum (a decrease, including a drop to 0
 * between higher values) or is non-finite is removed. Legitimate leading zeros are
 * preserved because they never fall below the running max.
 */
export function dropNonMonotonicSamples(data: ChartDataPoint[]): ChartDataPoint[] {
  if (!data || data.length === 0) {
    return [];
  }
  const keptOldestFirst: ChartDataPoint[] = [];
  let runningMax: BigNumber | null = null;
  for (let i = data.length - 1; i >= 0; i--) {
    const v = new BigNumber(data[i].value);
    if (!v.isFinite()) continue;
    if (runningMax !== null && v.isLessThan(runningMax)) continue;
    runningMax = v;
    keptOldestFirst.push(data[i]);
  }
  return keptOldestFirst.reverse();
}

/**
 * Calculates burn rate per time unit from cumulative data points.
 *
 * Filters out non-monotonic samples first (e.g. exporter gaps that drop to 0),
 * then for each data point finds the cumulative value at (current time - window size)
 * and returns the difference. This represents the amount burned in that time window,
 * i.e., the burn rate per selected time unit.
 *
 * Example: with "per_day", if cumulative burn is 1000 now and was 900 yesterday,
 * the rate is 100 (burned 100 in the last day).
 *
 * Data arrives sorted DESC (newest first) from API.
 *
 * Uses two-pointer technique for O(n) complexity: since data is sorted DESC,
 * as i advances to older dates, the required j (window start) can only move
 * forward, never backward.
 *
 * @param data - Cumulative ChartDataPoint[] sorted by date DESC
 * @param rateUnit - The target rate unit (determines window size)
 * @returns ChartDataPoint[] with burn rate per time unit
 */
export function calculateRates(
  data: ChartDataPoint[],
  rateUnit: RateUnit
): ChartDataPoint[] {
  const clean = dropNonMonotonicSamples(data);
  if (clean.length < 2) {
    return [];
  }

  const windowMs = MS_PER_UNIT[rateUnit];
  const rates: ChartDataPoint[] = [];
  // Two-pointer: j tracks the window-start position and only advances forward
  let j = 0;

  for (let i = 0; i < clean.length; i++) {
    const current = clean[i];
    const windowStartTime = current.date.getTime() - windowMs;
    // Ensure j stays ahead of i (window start must precede the current point)
    j = Math.max(j, i + 1);
    // Advance j to the first sample at or before the window start
    while (j < clean.length && clean[j].date.getTime() > windowStartTime) {
      j++;
    }
    if (j >= clean.length) {
      // No sample at/before the window start — skip
      continue;
    }
    const valueDiff = new BigNumber(current.value).minus(clean[j].value);
    // Defensive clamp; negatives are unreachable after dropNonMonotonicSamples
    const rate = valueDiff.isNegative() ? new BigNumber(0) : valueDiff;
    rates.push({
      group: current.group,
      key: current.key,
      value: rate.toFixed(),
      date: current.date,
    });
  }

  return rates;
}

/**
 * All-time average burn rate: value(t) / (t - launchTime) * MS_PER_UNIT[rateUnit].
 * This is the exact time-average of the rate over [launch, t] (secant slope of the
 * launch-anchored cumulative curve), valid because the source is offset-subtracted to 0
 * at launch. Irregular sample spacing does not bias it. Data sorted DESC by date.
 */
export function calculateAllTimeAverageRates(
  data: ChartDataPoint[],
  rateUnit: RateUnit,
  launchTime: number
): ChartDataPoint[] {
  const clean = dropNonMonotonicSamples(data);
  if (clean.length === 0) {
    return [];
  }

  const unitMs = new RateBN(MS_PER_UNIT[rateUnit]).integerValue();
  const rates: ChartDataPoint[] = [];

  for (const point of clean) {
    const elapsedMs = point.date.getTime() - launchTime;
    if (elapsedMs < MIN_ELAPSED_MS) {
      continue; // pre-launch or within the warm-up window
    }
    const rate = new RateBN(point.value).multipliedBy(unitMs).dividedBy(elapsedMs);
    const clamped = rate.isNegative() ? new RateBN(0) : rate; // unreachable for monotonic data
    rates.push({
      group: point.group,
      key: point.key,
      value: clamped.toFixed(),
      date: point.date,
    });
  }

  return rates;
}

/**
 * Calculates the average value from chart data points.
 *
 * @param data - ChartDataPoint[] to average
 * @returns BigNumber representing the average value, or 0 if data is empty or contains invalid values
 */
export function calculateAverage(data: ChartDataPoint[]): BigNumber {
  if (!data || data.length === 0) {
    return new BigNumber(0);
  }
  const sum = BigNumber.sum(...data.map(d => d.value));
  if (sum.isNaN()) {
    return new BigNumber(0);
  }
  return sum.dividedBy(data.length);
}
