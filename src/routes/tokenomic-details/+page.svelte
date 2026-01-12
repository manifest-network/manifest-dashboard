<script lang="ts">
  import type {PageProps} from "./$types";
  import type {ChartDataPoint} from "$lib/schemas/charts";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs, rateConfigs} from "./config";
  import ChartCard from "$lib/components/ChartCard.svelte";
  import RateChartCard from "$lib/components/RateChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";

  let {data}: PageProps = $props();

  const tokenomics = $derived(configs.map((config) => ({
    config,
    metrics: [
      {
        data: data[`aggregateMetric_${config.id}`],
        error: data[`aggregateMetric_${config.id}Error`]
      },
      {
        data: data[`aggregateChainMetric_${config.id}`],
        error: data[`aggregateChainMetric_${config.id}Error`]
      },
      {
        data: data[`aggregateSupplyMetric_${config.id}`],
        error: data[`aggregateSupplyMetric_${config.id}Error`]
      }
    ]
  })));

  // Map rate configs to their source metric data, keyed by insertAfter for positioning
  const rateChartsByInsertAfter = $derived(
    rateConfigs.reduce((acc, config) => {
      const key = config.insertAfter;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        config,
        data: data[`aggregateMetric_${config.sourceMetricId}`] as ChartDataPoint[] | undefined,
        error: data[`aggregateMetric_${config.sourceMetricId}Error`] as string | undefined
      });
      return acc;
    }, {} as Record<string, Array<{config: RateChartConfig, data: ChartDataPoint[] | undefined, error: string | undefined}>>)
  );

  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), 60000);
    return () => clearInterval(id);
  });

  let hasTicked = false;

  $effect(() => {
    $tick;
    if (hasTicked) {
      invalidateAll();
    } else {
      hasTicked = true; // skip the very first run (initial page load)
    }
  });
</script>

<main>
  <div class="grid grid-cols-2">
    {#each tokenomics as {config, metrics}}
      {#each metrics as {data: mData, error: mError}}
        {#if mError}
          <ErrorCard title="Chart Failed" error={mError}/>
        {:else if mData}
          <div class="card w-full p-4 mb-4">
            <ChartCard config={config} data={mData}/>
          </div>
        {/if}
      {/each}
      <!-- Insert rate charts configured to appear after this chart -->
      {#if rateChartsByInsertAfter[config.id]}
        {#each rateChartsByInsertAfter[config.id] as rateChart}
          {#if rateChart.error}
            <ErrorCard title="Chart Failed" error={rateChart.error}/>
          {:else if rateChart.data}
            <div class="card w-full p-4 mb-4">
              <RateChartCard config={rateChart.config} data={rateChart.data}/>
            </div>
          {/if}
        {/each}
      {/if}
    {/each}
  </div>
</main>
