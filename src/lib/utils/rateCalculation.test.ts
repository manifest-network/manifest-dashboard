import { describe, it, expect } from 'vitest';
import { dropNonMonotonicSamples, calculateRates } from './rateCalculation';
import { calculateAllTimeAverageRates, MIN_ELAPSED_MS } from './rateCalculation';
import type { ChartDataPoint } from '$lib/schemas/charts';

// Build a DESC-sorted (newest first) ChartDataPoint[] from [iso, value] rows.
function pts(...rows: Array<[string, string]>): ChartDataPoint[] {
  return rows.map(([iso, value]) => ({ group: 't', key: iso, value, date: new Date(iso) }));
}

describe('dropNonMonotonicSamples', () => {
  it('removes a zero dropout between higher values', () => {
    const data = pts(
      ['2026-01-03T00:00:00Z', '320'],
      ['2026-01-02T00:00:00Z', '0'],
      ['2026-01-01T00:00:00Z', '300'],
    );
    const out = dropNonMonotonicSamples(data);
    expect(out.map((p) => p.value)).toEqual(['320', '300']);
  });

  it('preserves legitimate leading zeros', () => {
    const data = pts(
      ['2026-01-04T00:00:00Z', '10'],
      ['2026-01-03T00:00:00Z', '5'],
      ['2026-01-02T00:00:00Z', '0'],
      ['2026-01-01T00:00:00Z', '0'],
    );
    const out = dropNonMonotonicSamples(data);
    expect(out.map((p) => p.value)).toEqual(['10', '5', '0', '0']);
  });

  it('removes a non-zero mid-series decrease', () => {
    const data = pts(
      ['2026-01-03T00:00:00Z', '300'],
      ['2026-01-02T00:00:00Z', '250'],
      ['2026-01-01T00:00:00Z', '280'],
    );
    expect(dropNonMonotonicSamples(data).map((p) => p.value)).toEqual(['300', '280']);
  });

  it('returns [] for empty input', () => {
    expect(dropNonMonotonicSamples([])).toEqual([]);
  });
});

describe('calculateRates with bad data', () => {
  it('does not emit a current-minus-zero false spike', () => {
    const data = pts(
      ['2026-01-03T00:00:00Z', '320'],
      ['2026-01-02T00:00:00Z', '0'],
      ['2026-01-01T00:00:00Z', '300'],
    );
    const out = calculateRates(data, 'per_day');
    // After dropping the bad 0 sample, the only delta is 320-300=20; the 320-0=320 false spike must never appear.
    for (const p of out) {
      expect(Number(p.value)).toBeLessThanOrEqual(20);
    }
  });

  it('leaves clean monotonic data intact (one-day deltas)', () => {
    const data = pts(
      ['2026-01-03T00:00:00Z', '30'],
      ['2026-01-02T00:00:00Z', '20'],
      ['2026-01-01T00:00:00Z', '10'],
    );
    const out = calculateRates(data, 'per_day');
    expect(out.map((p) => p.value)).toEqual(['10', '10']);
  });
});

const LAUNCH = new Date('2026-01-01T00:00:00Z').getTime();

describe('calculateAllTimeAverageRates', () => {
  it('computes value / elapsed * unit (per_day)', () => {
    // 10 days after launch, cumulative = 1000 -> 1000/10days * 1day = 100/day
    const data = pts(['2026-01-11T00:00:00Z', '1000']);
    const out = calculateAllTimeAverageRates(data, 'per_day', LAUNCH);
    expect(out).toHaveLength(1);
    expect(Number(out[0].value)).toBeCloseTo(100, 6);
  });

  it('scales linearly with unit: per_day = per_hour * 24', () => {
    const data = pts(['2026-01-11T00:00:00Z', '1000']);
    const perHour = calculateAllTimeAverageRates(data, 'per_hour', LAUNCH);
    const perDay = calculateAllTimeAverageRates(data, 'per_day', LAUNCH);
    const ratio = Number(perDay[0].value) / Number(perHour[0].value);
    expect(ratio).toBeCloseTo(24, 6);
  });

  it('skips points within the fixed warm-up window regardless of unit', () => {
    // 12h after launch is < MIN_ELAPSED_MS (1 day) -> skipped for any unit
    const data = pts(['2026-01-01T12:00:00Z', '500']);
    expect(calculateAllTimeAverageRates(data, 'per_5min', LAUNCH)).toEqual([]);
    expect(calculateAllTimeAverageRates(data, 'per_month', LAUNCH)).toEqual([]);
  });

  it('produces a finite, non-huge first point just past the warm-up floor', () => {
    const justPast = new Date(LAUNCH + MIN_ELAPSED_MS + 60_000).toISOString();
    const data = pts([justPast, '1000']);
    const out = calculateAllTimeAverageRates(data, 'per_day', LAUNCH);
    expect(out).toHaveLength(1);
    const n = Number(out[0].value);
    expect(Number.isFinite(n)).toBe(true);
    expect(n).toBeLessThan(2000);
  });

  it('drops a zero dropout instead of emitting a zero (no false dropout)', () => {
    const data = pts(
      ['2026-01-21T00:00:00Z', '2000'],
      ['2026-01-11T00:00:00Z', '0'],
      ['2026-01-06T00:00:00Z', '500'],
    );
    const out = calculateAllTimeAverageRates(data, 'per_day', LAUNCH);
    expect(out.every((p) => Number(p.value) > 0)).toBe(true);
  });

  it('returns [] for empty input', () => {
    expect(calculateAllTimeAverageRates([], 'per_day', LAUNCH)).toEqual([]);
  });
});
