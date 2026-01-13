<script lang="ts" generics="TConfig extends ChartConfig | RateChartConfig">
  import type {ChartDataPoint} from "$lib/schemas/charts";
  import type {Snippet} from "svelte";
  import {useStreamingData} from "$lib/utils/useStreamingData.svelte";
  import ChartCard from "./ChartCard.svelte";
  import RateChartCard from "./RateChartCard.svelte";
  import ErrorCard from "./ErrorCard.svelte";

  const {
    config,
    promise,
    children,
  }: {
    config: TConfig;
    promise: Promise<ChartResult<ChartDataPoint[]>>;
    children?: Snippet<[{config: TConfig; data: ChartDataPoint[]}]>;
  } = $props();

  const state = useStreamingData<ChartDataPoint[]>(() => promise);

  // Determine if this is a rate chart config
  const isRateChart = $derived("sourceMetricId" in config);
</script>

{#if state.isInitialLoad}
  <div class="card w-full p-4 mb-4 animate-pulse">
    <div class="h-[300px] flex items-center justify-center">
      <div
        class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </div>
{:else if state.error}
  <ErrorCard title="Chart Failed" error={state.error} />
{:else if state.data}
  <div class="card w-full p-4 mb-4 relative">
    {#if state.isRefreshing}
      <div
        class="absolute top-2 right-2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin z-10"
      ></div>
    {/if}
    {#if children}
      {@render children({config, data: state.data})}
    {:else if isRateChart}
      <RateChartCard config={config as RateChartConfig} data={state.data} />
    {:else}
      <ChartCard config={config as ChartConfig} data={state.data} />
    {/if}
  </div>
{/if}
