import {BigNumber} from "bignumber.js";
import type {ChartDataPoint} from "$lib/schemas/charts";

// Average number of days in a month (365.25 days per year / 12 months).
// Kept as a literal (30.44) to preserve existing behavior.
const AVERAGE_DAYS_PER_MONTH = 30.44;

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
 * Calculates burn rate per time unit from cumulative data points.
 *
 * For each data point, finds the cumulative value at (current time - window size)
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
  if (!data || data.length < 2) {
    return [];
  }

  const windowMs = MS_PER_UNIT[rateUnit];
  const rates: ChartDataPoint[] = [];

  // Two-pointer: j tracks window start position and only advances forward
  let j = 0;

  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const windowStartTime = current.date.getTime() - windowMs;

    // Ensure j is always ahead of i (window start must be before current point)
    j = Math.max(j, i + 1);

    // Advance j to find first point at or before windowStartTime
    while (j < data.length && data[j].date.getTime() > windowStartTime) {
      j++;
    }

    // Skip if no data point exists at or before window start
    if (j >= data.length) {
      continue;
    }

    const valueDiff = new BigNumber(current.value).minus(data[j].value);

    // Clamp negative to zero (could indicate data correction)
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
 * Calculates the average value from chart data points.
 *
 * @param data - ChartDataPoint[] to average
 * @returns BigNumber representing the average value
 */
export function calculateAverage(data: ChartDataPoint[]): BigNumber {
  if (!data || data.length === 0) {
    return new BigNumber(0);
  }
  return BigNumber.sum(...data.map(d => d.value)).dividedBy(data.length);
}
