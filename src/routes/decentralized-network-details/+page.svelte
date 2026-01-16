<script lang="ts">
  import type {PageProps} from "./$types";
  import type {GeoRecordArray} from "$lib/schemas/geo";
  import {useAutoRefresh} from "$lib/utils/useAutoRefresh.svelte";
  import {useStreamingData} from "$lib/utils/useStreamingData.svelte";
  import ChartCardAsync from "$lib/components/ChartCardAsync.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import Globe from "$lib/components/Globe.svelte";
  import {configs} from "./config";

  const {data}: PageProps = $props();

  // Stale-while-revalidate for worldMap
  const worldMapState = useStreamingData<GeoRecordArray>(() => data.worldMap);

  useAutoRefresh({key: 'data:decentralized-network-details'});
</script>

<main>
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-hidden p-4">
    {#if worldMapState.isInitialLoad}
      <div class="animate-pulse flex items-center justify-center h-[400px]">
        <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else if worldMapState.error}
      <ErrorCard title="Globe Error" error={worldMapState.error} />
    {:else if worldMapState.data}
      <div class="gap-4 relative">
        {#if worldMapState.isRefreshing}
          <div class="absolute top-2 right-2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin z-10"></div>
        {/if}
        <Globe data={worldMapState.data} />
      </div>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-2">
      {#each configs as config (config.id)}
        <ChartCardAsync {config} promise={data.charts[config.id]} />
      {/each}
    </div>
  </div>
</main>
