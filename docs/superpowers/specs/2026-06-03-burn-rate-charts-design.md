# Burn-rate charts: trailing-window vs all-time average

**Status:** design approved 2026-06-03
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

i.e. "how much burned in the last <unit>", clamped ≥ 0. This is a useful *recent-activity*
statistic, but it is not the all-time average the label implies, and it spikes.

Both statistics are worth showing. This change relabels the existing chart to reflect its
true (trailing-window) meaning and adds the all-time-average chart that the current label
promises.

## Decisions (settled during brainstorming)

- **t₀ (anchor) = mainnet launch for both MFX and PWR.** PWR was introduced long after
  mainnet launch, so its all-time average will read artificially low until it "catches up".
  This is accepted in exchange for a single, simple anchor. (A per-token inception date was
  considered and rejected for now.)
- **Everything before mainnet launch counts as 0.** This is already true of the data the
  charts receive: `total_mfx_burned` has its pre-launch total subtracted via
  `src/lib/config/offsets.ts` and is clamped ≥ 0 + launch-filtered in
  `src/lib/schemas/metricRecord.ts`; PWR has no pre-launch history. The all-time average
  reuses this same offset-adjusted, launch-anchored cumulative, so pre-launch contributes 0
  by construction.
- **Labels (ENG-284 wording):**
  - Trailing: `Average MFX Burn Rate (past period)` / `Average PWR Burn Rate (past period)`
  - All-time: `Average MFX Burn Rate (all time)` / `Average PWR Burn Rate (all time)`
- **The all-time chart keeps the unit selector.** Expressed in the selected unit; the line
  shape is identical across units (linear y-scaling), which is fine.
- **The all-time chart's headline value is the latest point** (the current all-time average),
  not `calculateAverage` (which would be a mean-of-averages).

## Approach

**Client-side calculation, mirroring the existing trailing-window path, with a `rateMode`
discriminator on the config.** The all-time configs reuse the *same* `sourceMetricId`
cumulative data already loaded for the trailing charts, so there are **no new API calls**.
The only new server-side work is exposing the launch timestamp to the client (it currently
lives in `$env/static/private` and is only read server-side).

Rejected alternative: precomputing the all-time series server-side. The rate unit is chosen
client-side via URL param, so a server computation would still need a client-side rescale —
more moving parts and a departure from the existing rate pattern.

### Formula

For each cumulative data point at time `t` with offset-adjusted value `value(t)`:

```
allTimeRate(t) = value(t) / (t − launchTime) × MS_PER_UNIT[rateUnit]
```

- Skip points where `t ≤ launchTime`.
- Apply a small floor on `(t − launchTime)` to avoid a divide-by-near-zero spike in the first
  moments after launch (e.g. ignore points less than one `rateUnit` window past launch).
- Clamp ≥ 0 defensively.

Unit scaling is linear: `per_day = per_hour × 24`, etc. — a property the tests assert.

## Components & changes

1. **`src/lib/utils/rateCalculation.ts`** — add `calculateAllTimeAverageRates(data, rateUnit, launchTime)`
   implementing the formula above. Pure function, same `ChartDataPoint[]` in/out shape as
   `calculateRates`. Data arrives sorted DESC (same as `calculateRates`).

2. **`src/global.d.ts`** — add `rateMode?: 'trailing' | 'all_time'` to `RateChartConfig`
   (absent/`'trailing'` preserves current behavior).

3. **`src/routes/tokenomic-details/config.ts`** — in `rateConfigs`:
   - Relabel `mfx_burn_rate` → title `Average MFX Burn Rate (past period)`;
     `pwr_burn_rate` → `Average PWR Burn Rate (past period)`.
   - Add `mfx_burn_rate_alltime` (title `Average MFX Burn Rate (all time)`,
     `sourceMetricId: 'total_mfx_burned'`, `rateMode: 'all_time'`) and
     `pwr_burn_rate_alltime` (title `Average PWR Burn Rate (all time)`,
     `sourceMetricId: 'total_pwr_burned'`, `rateMode: 'all_time'`).
   - **Ordering:** `+page.svelte` keys rate charts by `insertAfter` matched against
     *main-config* ids (`rateChartsByInsertAfter[config.id]`), so an all-time config cannot
     `insertAfter` a rate config. Each all-time config reuses its trailing sibling's anchor
     (`mfx_burn_rate_alltime` → `insertAfter: 'total_mfx_burned'`; `pwr_burn_rate_alltime`
     → `insertAfter: 'total_pwr_minted'`) and is placed **immediately after its sibling in
     the `rateConfigs` array** — multiple rate configs sharing an `insertAfter` render in
     array order within that slot. No `+page.server.ts` wiring change is needed for the new
     configs: `rateCharts` is built from `rateConfigs` by `sourceMetricId`, so they get their
     source promise automatically.

4. **`src/routes/tokenomic-details/+page.server.ts`** — read `LAUNCH_DATE` (already imported in
   `metricRecord.ts`) and return `launchTime` (epoch ms) in the page data.

5. **`src/routes/tokenomic-details/+page.svelte` + `src/lib/components/ChartCardAsync.svelte`** —
   thread `launchTime` through to `RateChartCard`.

6. **`src/lib/components/RateChartCard.svelte`** — branch on `config.rateMode`:
   - `'trailing'` (default): `calculateRates(data, rateUnit)` — unchanged.
   - `'all_time'`: `calculateAllTimeAverageRates(data, rateUnit, launchTime)`, and use the
     **latest** point for the title headline instead of `calculateAverage`.
   - Keep the unit dropdown in both modes.

## Data flow

`sourceMetricId` cumulative data (offset-adjusted, launch-filtered) → `ChartCardAsync`
→ `RateChartCard` → (`calculateRates` | `calculateAllTimeAverageRates`) → `AreaChart`.
The all-time configs share the trailing charts' source promise; no extra fetch.

## Error handling / edge cases

- `< 2` data points → empty result → existing "Insufficient data to calculate rate" state.
- Points at/before `launchTime` and within the near-launch floor are skipped.
- Negative values clamped to 0 (defensive; not expected for cumulative ÷ elapsed).
- PWR all-time reads low until it catches up — expected, documented.

## Testing

Unit tests for `calculateAllTimeAverageRates`:
- pre-launch points excluded; near-launch floor applied (no leading spike).
- monotone, smooth output relative to `calculateRates` on bursty input.
- unit scaling: `per_day ≈ per_hour × 24`, `per_week ≈ per_day × 7`.
- empty / single-point input → `[]`.

Component-level: both all-time configs (`mfx_burn_rate_alltime`, `pwr_burn_rate_alltime`)
render under their trailing siblings with the correct titles and a working unit selector.

## Out of scope

- Migrating burn/locked metrics off the custom node exporter to yaci (separate, larger
  project).
- Per-token inception anchoring for the all-time average (both anchored at mainnet launch).
