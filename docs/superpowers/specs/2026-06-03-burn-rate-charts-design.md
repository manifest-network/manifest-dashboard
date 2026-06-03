# Burn-rate charts: trailing-window vs all-time average

**Status:** design approved 2026-06-03; revised 2026-06-03 after a best-practices review
**Linear:** [ENG-284](https://linear.app/liftedinit/issue/ENG-284)
**Repo:** `manifest-dashboard`

## Problem

The tokenomics dashboard has two burn-rate charts — `MFX Burn Rate` and `PWR Burn Rate`
(`src/routes/tokenomic-details/config.ts` → `rateConfigs`). They are presented as an
"Average … Burn rate per hour|day|week", which reads as an **all-time average** (total
burned ÷ total elapsed, expressed in the chosen unit) — a smooth curve where bursts are
absorbed into the long-run average.

What the charts actually plot is the **amount burned inside a trailing window** of the
selected unit. `src/lib/utils/rateCalculation.ts` → `calculateRates(data, rateUnit)`
computes, per point:

```
rate(t) = cumulative(t) − cumulative(t − window)        // window = MS_PER_UNIT[rateUnit]
```

i.e. "how much burned in the last <unit>". This is a useful *recent-activity* statistic,
but it is not the all-time average the label implies, and it spikes.

Both statistics are worth showing. This change relabels the existing chart to reflect its
true (trailing-window) meaning and adds the all-time-average chart the current label promises.

## Terminology (map to standard concepts)

- **Trailing chart** = a *rolling / windowed rate*. In observability terms it is exactly
  Prometheus `increase()` over a range vector (the increase of a counter within a window).
  It is responsive but noisy.
- **All-time chart** = a *cumulative moving average* (CMA) / *lifetime (inception-to-date)
  average rate*. The window expands as time passes and the curve converges to the lifetime
  mean. It is **intentionally insensitive to recent bursts** — that flattening is the
  defining CMA property, not a bug.

These are the two ends of the rolling-vs-expanding-window trade-off (responsive/noisy vs
stable/laggy), which is precisely why we keep **both**. Naming them this way in the spec and
code comments prevents a future contributor from "fixing" the all-time flattening or the
trailing spikiness. (Refs: Prometheus functions docs; Wikipedia "Moving average".)

## Decisions

- **t₀ (anchor) = mainnet launch for both MFX and PWR.** PWR was introduced long after
  launch, so its all-time average reads artificially low until it "catches up". Accepted for
  a single simple anchor — **but this MUST be disclosed in the UI** (see Labels/tooltips),
  because a cumulative average is distorted by a non-representative start point and the
  depressed early PWR curve would otherwise be misread as low activity.
- **Everything before mainnet launch counts as 0.** Already enforced: `total_mfx_burned` has
  its pre-launch total subtracted (`src/lib/config/offsets.ts`) and is clamped ≥ 0 +
  launch-filtered (`src/lib/schemas/metricRecord.ts`); PWR has no pre-launch history. This
  guarantees `F(launch) = 0`, which the all-time formula relies on (see Formula).
- **Labels** (do **not** put "Average" on the trailing chart — it is a windowed delta, not a
  mean; the per-unit suffix already names the window):
  - Trailing: `MFX Burn Rate (trailing)` / `PWR Burn Rate (trailing)`
  - All-time: `Average MFX Burn Rate (all time)` / `Average PWR Burn Rate (all time)`
  - Rendered example: `MFX Burn Rate (trailing): 12.3 MFX/day` and
    `Average MFX Burn Rate (all time): 8.1 MFX/day`.
- **Keep the unit selector on both charts.** Note the asymmetry: the **trailing** line's
  *shape* changes with the unit (the unit doubles as the smoothing window); the **all-time**
  line's shape is unit-invariant (pure linear y-rescale). Disclose this in the all-time
  tooltip so users don't think the selector "does nothing".
- **All-time headline value = the latest point** (the current lifetime average), **not**
  `calculateAverage` (a mean of the CMA series would be a meaningless double/unweighted mean).
- **Axis/title state the per-unit dimension** (e.g. `MFX per day`) and track the unit
  selector on both charts (always state units — Grafana/IBCS/Tufte).

## Data invariant & bad-data handling

The cumulative sources are **strictly monotonic counters anchored to 0 at launch**; genuine
counter resets are not expected. A sample whose value **decreases relative to an earlier
(older) sample — including a drop to `0` between non-zero values** — indicates **bad/missing
data** (e.g. an indexer/exporter gap or restart), not a smaller rate and not a real reset.

Implement this as a **monotonicity filter** (`dropNonMonotonicSamples`): walking oldest→newest,
track the running maximum and drop any point that falls below it (or is non-finite).
Crucially this preserves **legitimate leading zeros** — a token that simply has not burned yet
(e.g. PWR before its first burn) never falls below the running max, so its early zeros are
kept; only a dropout *between* higher values is removed. (Keying on `value == 0` instead would
wrongly delete PWR's legitimate early history.)

**Apply this filter inside BOTH calculations** (it also hardens the existing trailing chart).
Rationale:
- `clamp-to-0` (the current behavior, `rateCalculation.ts:104-105`) is gauge `delta()`
  semantics and protects against *neither* failure mode: in the trailing chart a `0` sample
  at the window edge yields `current − 0 = the entire cumulative total` (a huge **positive**
  false spike the clamp does not catch); in the all-time chart any `value(t)=0` yields a
  vertical **zero-dropout**.
- Prometheus-style reset add-back is also wrong here (it would create a doubling spike on the
  recovery sample, since this is a write-0 gap, not a true restart-to-0).

Keep a defensive `clamp ≥ 0` as belt-and-suspenders, commented as **unreachable** for a
monotonic series after gap-handling. (Refs: Prometheus counter docs; robustperception
"How does a Prometheus counter work".)

## Approach

**Client-side calculation, mirroring the existing trailing-window path, with a `rateMode`
discriminator on the config.** The all-time configs reuse the *same* `sourceMetricId`
cumulative data already loaded for the trailing charts — **no new API calls**. The only new
server-side work is surfacing the launch timestamp to the client.

Rejected: precomputing the all-time series server-side. The rate unit is chosen client-side
via URL param, so a server computation would still need a client-side rescale.

### Formula

For each cumulative data point at time `t` with offset-adjusted value `value(t)`:

```
allTimeRate(t) = value(t) / (t − launchTime) × MS_PER_UNIT[rateUnit]
```

- This is the **exact** time-average of the burn rate over `[launch, t]` — the secant slope
  of the launch-anchored cumulative curve — *not* an approximation, because `value(t)` is the
  accumulated total and `F(launch) = 0` by construction. (Avg value of a function over `[a,b]`
  = `(F(b)−F(a))/(b−a)`.)
- **Irregular/adaptive sample spacing does not bias it** (numerator is the true accumulated
  integral; denominator is exact wall-clock elapsed time) — so no time-weighting is needed.
  This is why the headline uses the latest point, not `calculateAverage` (a mean of points,
  which *would* be spacing-sensitive).
- Skip points where `t ≤ launchTime`. Apply a **fixed** warm-up floor: skip points where
  `(t − launchTime) < MIN_ELAPSED_MS` (a fixed minimum sample window, e.g. **1 day**),
  **independent of the selected unit**, so the line's start does not jump when the unit
  changes. The all-time line therefore begins `MIN_ELAPSED_MS` after launch.
- **Do the new arithmetic in BigNumber:** wrap `(t − launchTime)` and `MS_PER_UNIT[unit]` as
  `BigNumber` from string/integer (never via JS `Number` — `MS_PER_UNIT.per_month` is a JS
  float `30.44*…`), perform divide then ×unit in BigNumber, set an explicit `DECIMAL_PLACES`
  (don't rely on the ambient default-20 silent rounding of `dividedBy`), and serialize with
  `.toFixed()` to match `calculateRates`.

### Trailing computation note

`calculateRates` stays a fixed-window delta. That is exact only when samples are dense and
regular relative to the window — which **holds here** because the API returns regularly
bucketed points (`CLAUDE.md` `IntervalMap`), and `RATE_UNITS_BY_TIMESPAN` already keeps small
units off coarse-bucket timespans (so a window always spans ≥ 2 samples). The rigorous form
is Prometheus `increase()`-style time-normalization,
`(value(i) − value(j)) / (t_i − t_j) × MS_PER_UNIT[unit]`; adopt it only if buckets ever
become irregular. Rewriting `calculateRates` now is out of scope.

## Components & changes

1. **`src/lib/utils/rateCalculation.ts`** — add `calculateAllTimeAverageRates(data, rateUnit, launchTime)`
   (pure, `ChartDataPoint[]` in/out, data sorted DESC like `calculateRates`); add a shared
   pre-filter that drops `0`/decreasing samples; reword the `clamp negative to 0` comment to
   gap/bad-data semantics.

2. **`src/global.d.ts`** — add a **required** `rateMode: 'trailing' | 'all_time'` to
   `RateChartConfig` (a required discriminant, not optional, so the variant is never implicit
   and enables exhaustive checking).

3. **`src/routes/tokenomic-details/config.ts`** — set `rateMode: 'trailing'` on the existing
   `mfx_burn_rate` / `pwr_burn_rate` and relabel them `… (trailing)`; add `mfx_burn_rate_alltime`
   / `pwr_burn_rate_alltime` (`rateMode: 'all_time'`, same `sourceMetricId`, titles
   `Average … Burn Rate (all time)`).
   - **Ordering:** `+page.svelte` keys rate charts by `insertAfter` matched against
     *main-config* ids (`rateChartsByInsertAfter[config.id]`), so an all-time config cannot
     `insertAfter` a rate config. Each all-time config reuses its trailing sibling's anchor
     (`mfx_burn_rate_alltime` → `insertAfter: 'total_mfx_burned'`; `pwr_burn_rate_alltime`
     → `insertAfter: 'total_pwr_minted'`) and is placed **immediately after its sibling in
     the `rateConfigs` array** — configs sharing an `insertAfter` render in array order. No
     `+page.server.ts` wiring change is needed for the new configs: `rateCharts` is built
     from `rateConfigs` by `sourceMetricId`, so they get their source promise automatically.

4. **`src/routes/tokenomic-details/+page.server.ts` + `+page.svelte` + `ChartCardAsync.svelte`** —
   read `LAUNCH_DATE` (already imported in `metricRecord.ts`) and thread `launchTime`
   (epoch ms, a plain number — devalue-safe, timezone-unambiguous) through to `RateChartCard`.
   - **Env rationale:** `LAUNCH_DATE` stays server-side (`$env/static/private`, already the
     single source of truth in `metricRecord.ts`); we surface it as `launchTime` via the
     loader rather than duplicating it as a `PUBLIC_LAUNCH_DATE` — one source of truth, and
     it works whether the value is build- or runtime-set.

5. **`src/lib/components/RateChartCard.svelte`** — branch on `config.rateMode` with an
   **exhaustive `switch` + `assertNever` default** (a future third mode fails to compile; do
   not destructure `config` before narrowing):
   - `'trailing'`: `calculateRates(data, rateUnit)`; headline unchanged.
   - `'all_time'`: `calculateAllTimeAverageRates(data, rateUnit, launchTime)`; headline = the
     **latest** point.
   - Keep the unit dropdown in both modes; make the y-axis/title state the per-unit dimension
     and track the selector.
   - Add a per-chart **description/tooltip**: trailing = "Amount burned in the most recent
     {unit} (trailing-window change)."; all-time = "Total burned since mainnet launch
     ({LAUNCH_DATE}) ÷ elapsed time, per {unit}. Reacts slowly to recent bursts by design.
     PWR launched after mainnet, so its lifetime average reads low until it catches up."

## Data flow

`sourceMetricId` cumulative data (offset-adjusted, launch-filtered) → `ChartCardAsync`
→ `RateChartCard` → (`calculateRates` | `calculateAllTimeAverageRates`) → `AreaChart`.
The all-time configs share the trailing charts' source promise; no extra fetch.

## Error handling / edge cases

- `< 2` data points → empty result → existing "Insufficient data to calculate rate" state.
- `0`/decreasing samples dropped as bad data before both calcs → no trailing false spike, no
  all-time zero-dropout.
- Points at/before `launchTime` and within `MIN_ELAPSED_MS` skipped (warm-up).
- Defensive `clamp ≥ 0` retained, commented as unreachable after gap-handling.
- PWR all-time reads low until it catches up — disclosed in the UI tooltip.

## Testing

Unit tests for `calculateAllTimeAverageRates` (Vitest, pure function):
- pre-launch points excluded; fixed warm-up floor applied; **first post-floor point is finite
  and not absurdly large** (BigNumber ÷ a tiny elapsed yields a huge-but-finite number a naive
  spike test would pass — assert finiteness + magnitude bound).
- **monotonicity filter**: a `0`-dropout/decrease *between* higher values is removed (no
  trailing false spike, no all-time zero-dropout), while **legitimate leading zeros** (a token
  before its first burn, e.g. PWR) are preserved.
- all-time output is smooth/monotone-ish vs `calculateRates` on bursty input.
- unit scaling: `per_day ≈ per_hour × 24`, `per_week ≈ per_day × 7`.
- empty / single-point input → `[]`.

Component-level: all four configs render with the correct titles, a working unit selector,
and the all-time charts show the launch-anchor tooltip.

## Out of scope

- Migrating burn/locked metrics off the custom node exporter to yaci (separate, larger
  project).
- Per-token inception anchoring for the all-time average (both anchored at mainnet launch).
- Rewriting `calculateRates` to time-normalize (documented approximation; revisit only if the
  API's bucketing becomes irregular).

## References (best-practices review, 2026-06-03)

- Prometheus query functions (`rate`/`increase`/`delta`, counter vs gauge):
  https://prometheus.io/docs/prometheus/latest/querying/functions/
- How PromQL calculates rates (time-normalization, extrapolation):
  https://promlabs.com/blog/2021/01/29/how-exactly-does-promql-calculate-rates/
- Prometheus counters / reset handling: https://www.robustperception.io/how-does-a-prometheus-counter-work/
- Cumulative vs moving average: https://en.wikipedia.org/wiki/Moving_average
- Average value of a function (secant slope): https://www.whitman.edu/mathematics/calculus_online/section09.04.html
- Time-weighted averages: https://www.tigerdata.com/blog/what-time-weighted-averages-are-and-why-you-should-care
- CAGR / arbitrary-start-point distortion: https://prosperitythinkers.com/cagr-vs-average-growth-rate/
- Dashboard labeling: https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/ ; https://www.ibcs.com/IBCS/
- BigNumber.js precision: https://mikemcl.github.io/bignumber.js/
- SvelteKit env / load / `$derived`: https://svelte.dev/docs/kit/$env-static-public ; https://svelte.dev/docs/kit/load ; https://svelte.dev/docs/svelte/$derived
