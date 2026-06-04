<script lang="ts">
  import type {ChartDataPoint} from "$lib/schemas/charts";
  import {AreaChart, LinearGradient, Area, ChartClipPath, Tooltip} from "layerchart";
  import {formatLargeNumber, formatBaseDenom, formatChartDate} from "$lib/utils/format";
  import {cubicInOut} from "svelte/easing";
  import {page} from "$app/state";
  import {goto} from "$app/navigation";
  import {calculateRates, calculateAllTimeAverageRates, calculateAverage, RATE_UNIT_LABELS, RATE_UNITS_BY_TIMESPAN, isValidRateUnit, isValidTimeSpan} from "$lib/utils/rateCalculation";

  const {config, data, launchTime}: {config: RateChartConfig; data: ChartDataPoint[]; launchTime?: number} = $props();

  function assertNever(x: never): never {
    throw new Error(`Unhandled rateMode: ${x}`);
  }

  // Treat a non-finite launchTime (e.g. a misconfigured LAUNCH_DATE) as missing, so an
  // invalid value can't emit NaN rates or throw in new Date(...).toISOString().
  const validLaunchTime = $derived(
    launchTime !== undefined && Number.isFinite(launchTime) ? launchTime : undefined
  );

  // URL parameter name based on config id (e.g., "pwr_burn_rate" -> "pwr_burn_rateUnit")
  const urlParamName = $derived(`${config.id}Unit`);

  // Get interval from URL to determine available rate units (with validation)
  const interval = $derived.by(() => {
    const urlInterval = page.url.searchParams.get('interval');
    return isValidTimeSpan(urlInterval) ? urlInterval : '1 year';
  });

  // Get available units for current interval
  const availableUnits = $derived(RATE_UNITS_BY_TIMESPAN[interval]);

  // Get rate unit, falling back to default if current not valid for interval
  const rateUnit = $derived.by(() => {
    const urlUnit = page.url.searchParams.get(urlParamName);
    if (isValidRateUnit(urlUnit) && availableUnits.units.includes(urlUnit)) {
      return urlUnit;
    }
    return availableUnits.default;
  });

  // Calculate the series based on the chart mode
  const rateData = $derived.by(() => {
    switch (config.rateMode) {
      case 'all_time':
        // launchTime is always provided for all_time charts via the loader; guard defensively.
        return validLaunchTime === undefined ? [] : calculateAllTimeAverageRates(data, rateUnit, validLaunchTime);
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
  const headlineValue = $derived.by((): string | null => {
    if (rateData.length === 0) return null;
    return config.rateMode === 'all_time'
      ? rateData[0].value
      : calculateAverage(rateData).toFixed();
  });

  const title = $derived(
    headlineValue !== null
      ? `${config.title}: ${formatBaseDenom(headlineValue, 4)} ${config.unitSuffix}/${unitLabel}`
      : `${config.title}: N/A`
  );

  // Per-unit y-axis dimension that tracks the selector (e.g. "MFX per day")
  const yAxisLabel = $derived(`${config.unitSuffix} per ${unitLabel}`);

  // Disclosure tooltip (hover) describing the metric construction
  const launchDateLabel = $derived(validLaunchTime !== undefined ? new Date(validLaunchTime).toISOString().slice(0, 10) : 'launch');
  const description = $derived(
    config.rateMode === 'all_time'
      ? `Total burned since mainnet launch (${launchDateLabel}) divided by elapsed time, per ${unitLabel}. Reacts slowly to recent bursts by design; a token launched after mainnet reads low until it catches up.`
      : `Amount burned in the most recent ${unitLabel} (trailing-window change).`
  );

  // Update URL when rate unit changes
  function onRateUnitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newUnit = select.value as RateUnit;
    const params = new URLSearchParams(page.url.searchParams);
    params.set(urlParamName, newUnit);
    goto(`${page.url.pathname}?${params.toString()}`, {
      keepFocus: true,
      replaceState: true
    });
  }
</script>

<section>
  <div class="relative h-[300px] p-4 rounded-sm">
    <div class="absolute top-2 left-4 right-4 flex items-center justify-between z-10">
      <h3 class="card-title" title={description}>
        {title}
        <!-- Expose the disclosure text to assistive tech / touch (native `title` is not reliably announced) -->
        <span class="sr-only"> — {description}</span>
      </h3>

      <select
        value={rateUnit}
        onchange={onRateUnitChange}
        class="px-2 py-1 text-sm rounded border border-surface-300-700 bg-surface-100-900 cursor-pointer"
      >
        {#each availableUnits.units as unit}
          <option value={unit}>{RATE_UNIT_LABELS[unit]}</option>
        {/each}
      </select>
    </div>

    {#if rateData.length > 0}
      <AreaChart
        data={rateData}
        x="date"
        y={(v) => Number(v.value)}
        yNice={true}
        padding={{left: 50, bottom: 50, top: 28}}
        props={{
          xAxis: {
            label: "Timestamp",
          },
          yAxis: {
            label: yAxisLabel,
            format: (v) => config.yAxisFormatter ? config.yAxisFormatter(String(v)) : formatLargeNumber(v, 0),
          },
          highlight: {points: {r: 3, class: "stroke-2 stroke-surface-100"}}
        }}
      >
        {#snippet tooltip({context})}
          <Tooltip.Root>
            <Tooltip.Item
              label="Date"
              value={context.tooltip.data?.date}
              format={formatChartDate}
            />
            <Tooltip.Item
              label={yAxisLabel}
              value={context.tooltip.data?.value}
              format={config.tooltipValueFormatter ?? ((v) => v)}
            />
          </Tooltip.Root>
        {/snippet}
        {#snippet marks()}
          {#key `${rateData?.[0]?.date}-${rateData?.[rateData.length-1]?.date}-${rateData.length}-${rateUnit}`}
            <ChartClipPath
              initialWidth={0}
              motion={{
                width: {type: "tween", duration: 1000, easing: cubicInOut},
              }}
            >
              <LinearGradient class="from-primary/50 to-primary/1" vertical>
                {#snippet children({gradient})}
                  <Area line={{class: "stroke-primary"}} fill={gradient} />
                {/snippet}
              </LinearGradient>
            </ChartClipPath>
          {/key}
        {/snippet}
      </AreaChart>
    {:else}
      <div class="flex items-center justify-center h-full text-surface-500">
        Insufficient data to calculate rate
      </div>
    {/if}
  </div>
</section>
