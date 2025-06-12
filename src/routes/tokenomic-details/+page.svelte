<script lang="ts">
  import type {PageProps} from "./$types";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs} from "./config";
  import ChartCard from "$lib/components/ChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";

  let {data}: PageProps = $props();

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
    {#each configs as config}
      {#if data[`aggregateMetric_${config.id}Error`]}
        <ErrorCard title={"Chart Failed"} error={data[`aggregateMetric_${config.id}Error`]}/>
      {:else if data[`aggregateChainMetric_${config.id}Error`]}
        <ErrorCard title={"Chart Failed"} error={data[`aggregateChainMetric_${config.id}Error`]}/>
      {:else if data[`aggregateSupplyMetric_${config.id}Error`]}
        <ErrorCard title={"Chart Failed"} error={data[`aggregateSupplyMetric_${config.id}Error`]}/>
      {:else if data[`aggregateMetric_${config.id}`]}
        <div class="card w-full p-4 mb-4">
          <ChartCard config={config} data={data[`aggregateMetric_${config.id}`]}/>
        </div>
      {:else if data[`aggregateChainMetric_${config.id}`]}
        <div class="card w-full p-4 mb-4">
          <ChartCard config={config} data={data[`aggregateChainMetric_${config.id}`]} />
        </div>
      {:else if data[`aggregateSupplyMetric_${config.id}`]}
        <div class="card w-full p-4 mb-4">
          <ChartCard config={config} data={data[`aggregateSupplyMetric_${config.id}`]} />
        </div>
      {/if}
    {/each}
  </div>
</main>
