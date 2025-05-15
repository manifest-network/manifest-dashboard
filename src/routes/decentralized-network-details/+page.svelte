<script lang="ts">
  import '@carbon/charts-svelte/styles.css';
  import type {PageProps} from "./$types";
  import {configs} from "./config";
  import {readable} from 'svelte/store';
  import {invalidateAll} from '$app/navigation';
  import GlobeMap2 from "$lib/components/GlobeMap2.svelte";
  import ChartCard from "$lib/components/ChartCard.svelte";
  // import GlobeMap from "$lib/components/GlobeMap.svelte";

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
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-hidden p-4">
    <div class="gap-8">
      <GlobeMap2 data={data.worldMap} />
    </div>
    <div class="grid grid-cols-2">
      {#each configs as config, i}
        <div class="card w-full p-8 mb-4">
          <ChartCard config={config} data={data.aggregateMetric[i]}/>
        </div>
      {/each}
    </div>
  </div>
</main>