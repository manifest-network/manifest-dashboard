<script lang="ts">
  import type {PageProps} from "./$types";
  import {useAutoRefresh} from "$lib/utils/useAutoRefresh.svelte";
  import ChartCardAsync from "$lib/components/ChartCardAsync.svelte";
  import {configs, rateConfigs} from "./config";

  let {data}: PageProps = $props();

  // Map rate configs to their insertAfter position for ordering
  const rateChartsByInsertAfter = $derived(
    rateConfigs.reduce(
      (acc, config) => {
        const key = config.insertAfter;
        if (!acc[key]) acc[key] = [];
        acc[key].push(config);
        return acc;
      },
      {} as Record<string, RateChartConfig[]>
    )
  );

  useAutoRefresh({key: 'data:tokenomic-details'});
</script>

<main>
  <div class="grid grid-cols-2">
    {#each configs as config (config.id)}
      <ChartCardAsync {config} promise={data.charts[config.id]} />
      <!-- Insert rate charts configured to appear after this chart -->
      {#if rateChartsByInsertAfter[config.id]}
        {#each rateChartsByInsertAfter[config.id] as rateConfig (rateConfig.id)}
          <ChartCardAsync config={rateConfig} promise={data.rateCharts[rateConfig.id]} />
        {/each}
      {/if}
    {/each}
  </div>
</main>
