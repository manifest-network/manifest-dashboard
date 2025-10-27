<script lang="ts">
  import type {PageProps} from "./$types";
  import {configs} from "./config";
  import {readable} from 'svelte/store';
  import {invalidateAll} from '$app/navigation';
  import GlobeMapSVG from "$lib/components/GlobeMapSVG.svelte";
  import ChartCard from "$lib/components/ChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import Globe from "$lib/components/Globe.svelte";
  // import GlobeMap from "$lib/components/GlobeMap.svelte";

  const {data}: PageProps = $props();
  const aggMetrics = $derived(configs.map((config) => ({
    config,
    metrics: [
      {
        data: data[`aggregateMetric_${config.id}`],
        error: data[`aggregateMetric_${config.id}Error`]
      },
    ]
  })));

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
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-hidden p-4">
    {#if data.worldMapError}
      <ErrorCard title="Globe Error" error="Failed to load world map data."/>
    {:else if data.worldMap}
      <div class="gap-4">
<!--        <GlobeMapSVG data={data.worldMap}/>-->
        <Globe data={data.worldMap} />
      </div>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-2">
      {#each aggMetrics as {config, metrics}}
        {#each metrics as {data: mData, error: mError}}
          {#if mError}
            <ErrorCard title="Chart Failed" error={mError}/>
          {:else if mData}
            <div class="card w-full">
              <ChartCard config={config} data={mData}/>
            </div>
          {/if}
        {/each}
      {/each}
    </div>
  </div>
</main>