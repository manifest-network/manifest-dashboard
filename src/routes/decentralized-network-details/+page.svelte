<script lang="ts">
  import type {PageProps} from "./$types";
  import MetricsPage from "$lib/components/MetricsPage.svelte";
  import {configs} from "./config";
  // import WorldMap from "$lib/components/WorldMap.svelte";
  import GlobeMap from "$lib/components/GlobeMap.svelte";

  let {data}: PageProps = $props();
</script>


<main>
<!--  <div class="relative w-full h-full">-->
<!--    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-0 pointer-events-none">-->
      <GlobeMap data={data.worldMap} />
<!--    </div>-->
<!--  </div>-->
<!--  <div class="relative z-10 mt-72">-->
    <MetricsPage title="Decentralized Network Details" data={data.aggregateMetric.data} {configs}/>
<!--  </div>-->
</main>