<script lang="ts">
  import '@carbon/charts-svelte/styles.css';
  import type {PageProps} from "./$types";
  import {configs} from "./config";
  import {readable} from 'svelte/store';
  import {invalidateAll} from '$app/navigation';
  import GlobeMapSVG from "$lib/components/GlobeMapSVG.svelte";
  import ChartCard from "$lib/components/ChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  // import GlobeMap from "$lib/components/GlobeMap.svelte";

  const {data}: PageProps = $props();

  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), 10000);
    return () => clearInterval(id);
  });

  $effect(() => {
  console.log("Page props:", data);
  })

  $effect(() => {
    if ($tick) {
      invalidateAll();
    }
  });
</script>


<main>
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-hidden p-4">
    {#if data.worldMapError}
      <ErrorCard title="Globe Error" error="Failed to load world map data."/>
    {:else if data.worldMap}
      <div class="gap-4">
        <GlobeMapSVG data={data.worldMap}/>
      </div>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-2">
        {#each configs as config}
          {#if data[`aggregateMetric_${config.id}Error`]}
            <ErrorCard title={"Chart Failed"} error={data[`aggregateMetric_${config.id}Error`]}/>
          {:else if data[`aggregateMetric_${config.id}`]}
          <div class="card w-full p-2 mb-4">
            <ChartCard config={config} data={data[`aggregateMetric_${config.id}`]}/>
          </div>
          {/if}
        {/each}
    </div>
  </div>
</main>