# Burn-rate Charts (trailing + all-time average) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relabel the existing burn-rate charts as trailing-window and add a new all-time-average burn-rate chart for MFX and PWR, computed from the same cumulative data.

**Architecture:** Pure client-side calc functions in `src/lib/utils/rateCalculation.ts` consumed via `$derived` in `RateChartCard.svelte`. A new `rateMode` discriminator on `RateChartConfig` selects trailing vs all-time. The all-time charts reuse the trailing charts' source data (no new API calls). `launchTime` (epoch ms) is surfaced from the server loader.

**Tech Stack:** SvelteKit (Svelte 5 runes), TypeScript, BigNumber.js, LayerChart; Bun; Vitest (added in Task 1).

**Spec:** `docs/superpowers/specs/2026-06-03-burn-rate-charts-design.md`

---

### Task 1: Set up Vitest

No test runner exists yet. This task adds Vitest so later tasks can be TDD.

**Files:**
- Create: `vitest.config.ts`
- Create (temporary): `src/lib/utils/__smoke__.test.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Vitest**

Run: `bun add -D vitest`
Expected: `vitest` added to `devDependencies`; lockfile updated.

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add test scripts to package.json**

In `package.json`, add to the `"scripts"` object (after `"check:watch"`):

```json
		"test": "vitest run",
		"test:watch": "vitest",
```

- [ ] **Step 4: Write a temporary smoke test**

Create `src/lib/utils/__smoke__.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('vitest setup', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `bun run test`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Delete the smoke test**

Run: `rm src/lib/utils/__smoke__.test.ts`

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts package.json bun.lock
git commit -m "test: set up vitest"
```

---

### Task 2: `dropNonMonotonicSamples` filter + harden `calculateRates`

A cumulative burn counter must be strictly non-decreasing in time. A drop to 0 (exporter gap) or any decrease *between* higher values is bad data that, untreated, causes a false `current − 0` spike in the trailing chart and a zero-dropout in the all-time chart. Legitimate leading zeros (a token before its first burn, e.g. PWR) must be preserved.

**Files:**
- Modify: `src/lib/utils/rateCalculation.ts`
- Test: `src/lib/utils/rateCalculation.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/utils/rateCalculation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { dropNonMonotonicSamples, calculateRates } from './rateCalculation';
import type { ChartDataPoint } from '$lib/schemas/charts';

// Build a DESC-sorted (newest first) ChartDataPoint[] from [iso, value] rows.
function pts(...rows: Array<[string, string]>): ChartDataPoint[] {
  return rows.map(([iso, value]) => ({ group: 't', key: iso, value, date: new Date(iso) }));
}

describe('dropNonMonotonicSamples', () => {
  it('removes a zero dropout between higher values', () => {
    // DESC: newest first
    const data = pts(
      ['2026-01-03T00:00:00Z', '320'],
      ['2026-01-02T00:00:00Z', '0'],   // exporter gap
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
    // After dropping the 0, the per-day delta from 320 looks back to 300 (2 days prior,
    // first sample at/before t-1d), so the rate is the real 320-300=20, never 320-0=320.
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test`
Expected: FAIL — `dropNonMonotonicSamples` is not exported.

- [ ] **Step 3: Add `dropNonMonotonicSamples` and rewrite `calculateRates`**

In `src/lib/utils/rateCalculation.ts`, add this function above `calculateRates`:

```ts
/**
 * Drop bad/missing samples from a strictly-monotonic cumulative counter.
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
```

Then replace the body of `calculateRates` so it filters first and operates on the clean array:

```ts
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
  let j = 0;

  for (let i = 0; i < clean.length; i++) {
    const current = clean[i];
    const windowStartTime = current.date.getTime() - windowMs;
    j = Math.max(j, i + 1);
    while (j < clean.length && clean[j].date.getTime() > windowStartTime) {
      j++;
    }
    if (j >= clean.length) {
      continue;
    }
    const valueDiff = new BigNumber(current.value).minus(clean[j].value);
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test`
Expected: PASS — all `dropNonMonotonicSamples` and `calculateRates with bad data` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/rateCalculation.ts src/lib/utils/rateCalculation.test.ts
git commit -m "feat(rate): drop non-monotonic samples and harden calculateRates"
```

---

### Task 3: `calculateAllTimeAverageRates`

The all-time average rate at time `t` is `value(t) / (t − launchTime) × MS_PER_UNIT[unit]` — the secant slope of the launch-anchored cumulative curve. Skip points before launch and within a fixed warm-up window. Use a locally-configured BigNumber for the new division.

**Files:**
- Modify: `src/lib/utils/rateCalculation.ts`
- Test: `src/lib/utils/rateCalculation.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/utils/rateCalculation.test.ts`:

```ts
import { calculateAllTimeAverageRates, MIN_ELAPSED_MS } from './rateCalculation';

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
    expect(n).toBeLessThan(2000); // ~ value/elapsed*day, not value/epsilon
  });

  it('drops a zero dropout instead of emitting a zero (no false dropout)', () => {
    const data = pts(
      ['2026-01-21T00:00:00Z', '2000'],
      ['2026-01-11T00:00:00Z', '0'],   // bad sample
      ['2026-01-06T00:00:00Z', '500'],
    );
    const out = calculateAllTimeAverageRates(data, 'per_day', LAUNCH);
    expect(out.every((p) => Number(p.value) > 0)).toBe(true);
  });

  it('returns [] for empty input', () => {
    expect(calculateAllTimeAverageRates([], 'per_day', LAUNCH)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test`
Expected: FAIL — `calculateAllTimeAverageRates` / `MIN_ELAPSED_MS` not exported.

- [ ] **Step 3: Implement the function**

In `src/lib/utils/rateCalculation.ts`, add near the top (after the existing `import`s):

```ts
// Locally-configured BigNumber for the all-time division (explicit precision,
// no global side-effects).
const RateBN = BigNumber.clone({ DECIMAL_PLACES: 20, ROUNDING_MODE: BigNumber.ROUND_HALF_UP });

// Fixed warm-up: skip points within this elapsed window after launch to avoid a
// divide-by-near-zero spike. Fixed (not unit-dependent) so the all-time line's start
// does not move when the user changes the display unit.
export const MIN_ELAPSED_MS = 24 * 60 * 60 * 1000; // 1 day
```

Then add the function (e.g. after `calculateRates`):

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test`
Expected: PASS — all `calculateAllTimeAverageRates` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/rateCalculation.ts src/lib/utils/rateCalculation.test.ts
git commit -m "feat(rate): add calculateAllTimeAverageRates"
```

---

### Task 4: Add `rateMode` to the config type and the chart configs

**Files:**
- Modify: `src/global.d.ts:20-24`
- Modify: `src/routes/tokenomic-details/config.ts:114-139`

- [ ] **Step 1: Add the required discriminator to the type**

In `src/global.d.ts`, replace the `RateChartConfig` interface (lines 20-24) with:

```ts
interface RateChartConfig extends ChartConfig {
  sourceMetricId: string;
  unitSuffix: string;
  insertAfter: string;
  rateMode: 'trailing' | 'all_time';
}
```

- [ ] **Step 2: Relabel existing configs and add all-time siblings**

In `src/routes/tokenomic-details/config.ts`, replace the entire `rateConfigs` array (lines 114-139) with:

```ts
export const rateConfigs: RateChartConfig[] = [
  {
    id: 'mfx_burn_rate',
    sourceMetricId: 'total_mfx_burned',
    title: 'MFX Burn Rate (trailing)',
    yAxisTitle: 'Burn Rate',
    category: 'tokenomic',
    type: 'chain',
    unitSuffix: 'MFX',
    insertAfter: 'total_mfx_burned',
    rateMode: 'trailing',
    tooltipValueFormatter: (value: string) => `${formatBaseDenom(value, 4)} MFX`,
    yAxisFormatter: (value: string) => `${formatBaseDenom(value, 1)}`,
  },
  {
    id: 'mfx_burn_rate_alltime',
    sourceMetricId: 'total_mfx_burned',
    title: 'Average MFX Burn Rate (all time)',
    yAxisTitle: 'Burn Rate',
    category: 'tokenomic',
    type: 'chain',
    unitSuffix: 'MFX',
    insertAfter: 'total_mfx_burned',
    rateMode: 'all_time',
    tooltipValueFormatter: (value: string) => `${formatBaseDenom(value, 4)} MFX`,
    yAxisFormatter: (value: string) => `${formatBaseDenom(value, 1)}`,
  },
  {
    id: 'pwr_burn_rate',
    sourceMetricId: 'total_pwr_burned',
    title: 'PWR Burn Rate (trailing)',
    yAxisTitle: 'Burn Rate',
    category: 'tokenomic',
    type: 'chain',
    unitSuffix: 'PWR',
    insertAfter: 'total_pwr_minted',
    rateMode: 'trailing',
    tooltipValueFormatter: (value: string) => `${formatBaseDenom(value, 4)} PWR`,
    yAxisFormatter: (value: string) => `${formatBaseDenom(value, 1)}`,
  },
  {
    id: 'pwr_burn_rate_alltime',
    sourceMetricId: 'total_pwr_burned',
    title: 'Average PWR Burn Rate (all time)',
    yAxisTitle: 'Burn Rate',
    category: 'tokenomic',
    type: 'chain',
    unitSuffix: 'PWR',
    insertAfter: 'total_pwr_minted',
    rateMode: 'all_time',
    tooltipValueFormatter: (value: string) => `${formatBaseDenom(value, 4)} PWR`,
    yAxisFormatter: (value: string) => `${formatBaseDenom(value, 1)}`,
  },
]
```

- [ ] **Step 3: Type-check**

Run: `bun run check`
Expected: PASS (0 errors). `RateChartCard.svelte` still compiles because `config.rateMode` is only read in Task 6; the required field is satisfied on all four configs here.

- [ ] **Step 4: Commit**

```bash
git add src/global.d.ts src/routes/tokenomic-details/config.ts
git commit -m "feat(tokenomics): relabel trailing burn charts and add all-time configs"
```

---

### Task 5: Surface `launchTime` from the loader to `RateChartCard`

**Files:**
- Modify: `src/routes/tokenomic-details/+page.server.ts:1-40`
- Modify: `src/routes/tokenomic-details/+page.svelte:32`
- Modify: `src/lib/components/ChartCardAsync.svelte:14-22,46-50`

- [ ] **Step 1: Return `launchTime` from the server loader**

In `src/routes/tokenomic-details/+page.server.ts`, add the env import after line 8:

```ts
import {LAUNCH_DATE} from "$env/static/private";
```

Then change the final `return` (line 39) to:

```ts
  const launchTime = new Date(LAUNCH_DATE).getTime();

  return {charts, rateCharts, launchTime};
```

- [ ] **Step 2: Pass `launchTime` to the rate-chart cards**

In `src/routes/tokenomic-details/+page.svelte`, replace line 32:

```svelte
          <ChartCardAsync config={rateConfig} promise={data.rateCharts[rateConfig.id]} launchTime={data.launchTime} />
```

- [ ] **Step 3: Forward `launchTime` through `ChartCardAsync`**

In `src/lib/components/ChartCardAsync.svelte`, add `launchTime` to the props (lines 14-22):

```ts
  const {
    config,
    promise,
    launchTime,
    children,
  }: {
    config: TConfig;
    promise: Promise<ChartResult<ChartDataPoint[]>>;
    launchTime?: number;
    children?: Snippet<[{config: TConfig; data: ChartDataPoint[]}]>;
  } = $props();
```

Then forward it to `RateChartCard` (line 47):

```svelte
    {:else if isRateChartConfig(config)}
      <RateChartCard config={config} data={state.data} {launchTime} />
```

- [ ] **Step 4: Type-check**

Run: `bun run check`
Expected: PASS (0 errors). `RateChartCard` does not yet accept `launchTime`, but Svelte tolerates an unknown attribute until Task 6 declares the prop; if `svelte-check` flags it, proceed to Task 6 which adds the prop. (If you prefer zero intermediate warnings, do Tasks 5 and 6 back-to-back before running `check`.)

- [ ] **Step 5: Commit**

```bash
git add src/routes/tokenomic-details/+page.server.ts src/routes/tokenomic-details/+page.svelte src/lib/components/ChartCardAsync.svelte
git commit -m "feat(tokenomics): surface launchTime to rate charts"
```

---

### Task 6: Branch `RateChartCard` on `rateMode` (all-time calc, headline, tooltip, axis)

**Files:**
- Modify: `src/lib/components/RateChartCard.svelte`

- [ ] **Step 1: Import the new calc and accept `launchTime`**

In `src/lib/components/RateChartCard.svelte`, update the import on line 8 to add the new function:

```ts
  import {calculateRates, calculateAllTimeAverageRates, calculateAverage, RATE_UNIT_LABELS, RATE_UNITS_BY_TIMESPAN, isValidRateUnit, isValidTimeSpan} from "$lib/utils/rateCalculation";
```

Replace the props line (line 10) with:

```ts
  const {config, data, launchTime}: {config: RateChartConfig; data: ChartDataPoint[]; launchTime?: number} = $props();

  function assertNever(x: never): never {
    throw new Error(`Unhandled rateMode: ${x}`);
  }
```

- [ ] **Step 2: Compute `rateData` by mode and a mode-aware headline**

Replace the `rateData`, `averageValue`, and `title` derivations (lines 33-47) with:

```ts
  // Calculate the series based on the chart mode
  const rateData = $derived.by(() => {
    switch (config.rateMode) {
      case 'all_time':
        return launchTime === undefined ? [] : calculateAllTimeAverageRates(data, rateUnit, launchTime);
      case 'trailing':
        return calculateRates(data, rateUnit);
      default:
        return assertNever(config.rateMode);
    }
  });

  // Format rate unit label for title (e.g., "Per Day" -> "day")
  const unitLabel = $derived(RATE_UNIT_LABELS[rateUnit].replace('Per ', '').toLowerCase());

  // Headline: all-time shows the latest point (current lifetime average); trailing shows
  // the mean of the windowed series (data is DESC, so the latest point is index 0).
  const headlineValue = $derived(
    config.rateMode === 'all_time'
      ? (rateData.length > 0 ? rateData[0].value : null)
      : calculateAverage(rateData).toFixed()
  );

  const title = $derived(
    rateData.length > 0 && headlineValue !== null
      ? `${config.title}: ${formatBaseDenom(headlineValue, 4)} ${config.unitSuffix}/${unitLabel}`
      : `${config.title}: N/A`
  );

  // Per-unit y-axis dimension that tracks the selector (e.g. "MFX per day")
  const yAxisLabel = $derived(`${config.unitSuffix} per ${unitLabel}`);

  // Disclosure tooltip (hover) describing the metric construction
  const launchDateLabel = $derived(launchTime ? new Date(launchTime).toISOString().slice(0, 10) : 'launch');
  const description = $derived(
    config.rateMode === 'all_time'
      ? `Total burned since mainnet launch (${launchDateLabel}) divided by elapsed time, per ${unitLabel}. Reacts slowly to recent bursts by design; a token launched after mainnet reads low until it catches up.`
      : `Amount burned in the most recent ${unitLabel} (trailing-window change).`
  );
```

- [ ] **Step 3: Use the tooltip and per-unit axis label in the markup**

In the same file, change the `<h3>` (line 65-67) to carry the hover description:

```svelte
      <h3 class="card-title" title={description}>
        {title}
      </h3>
```

And change the y-axis label (line 92) from `config.yAxisTitle` to the per-unit label:

```svelte
          yAxis: {
            label: yAxisLabel,
```

- [ ] **Step 4: Type-check**

Run: `bun run check`
Expected: PASS (0 errors). The `switch` is exhaustive over `'trailing' | 'all_time'`; `assertNever` makes a future third mode a compile error.

- [ ] **Step 5: Run the unit tests (regression)**

Run: `bun run test`
Expected: PASS — calc tests still green.

- [ ] **Step 6: Manual verification in the dev app**

Run: `bun dev`
Then open `http://localhost:5173/tokenomic-details?interval=1 year` and confirm:
- Four burn-rate cards exist: `MFX Burn Rate (trailing)`, `Average MFX Burn Rate (all time)`, `PWR Burn Rate (trailing)`, `Average PWR Burn Rate (all time)`.
- The all-time lines are smooth; the trailing lines are spikier.
- Changing the unit dropdown rescales the y-axis (label like `MFX per day`) on both; the all-time line keeps the same shape, the trailing line's shape changes.
- Hovering each title shows the description tooltip; the all-time tooltip names the launch date.

- [ ] **Step 7: Commit**

```bash
git add src/lib/components/RateChartCard.svelte
git commit -m "feat(tokenomics): render trailing and all-time burn-rate charts"
```

---

## Self-Review notes (already reconciled)

- **Spec coverage:** terminology/relabel (Task 4), all-time formula + warm-up floor + BigNumber precision (Task 3), bad-data monotonicity filter applied to both calcs (Tasks 2-3), required `rateMode` + exhaustive switch (Tasks 4, 6), launchTime via loader (Task 5), tooltip disclosure + per-unit axis (Task 6), tests (Tasks 2-3). Out of scope per spec: yaci migration, per-token anchoring, time-normalizing `calculateRates`.
- **Component test:** the spec's "component render" check is covered by `bun run check` (types) + the Task 6 manual step, rather than adding `@testing-library/svelte`/jsdom infra (YAGNI). All numeric logic is covered by pure-function Vitest tests.
- **Type consistency:** `rateMode`, `MIN_ELAPSED_MS`, `dropNonMonotonicSamples`, `calculateAllTimeAverageRates`, and `launchTime?: number` names are used consistently across tasks.
