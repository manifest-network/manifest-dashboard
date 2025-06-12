<script lang="ts">
  import type {PageProps} from "./$types";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs} from "./config";
  import ChartCard from "$lib/components/ChartCard.svelte";
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

  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), 10000);
    return () => clearInterval(id);
  });

  $effect(() => {
    if ($tick) {
      invalidateAll();
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
    {/each}
  </div>
</main>
