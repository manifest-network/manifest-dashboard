import { describe, it, expect } from 'vitest';
import { dropNonMonotonicSamples, calculateRates } from './rateCalculation';
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
