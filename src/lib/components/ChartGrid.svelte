<!-- src/lib/components/ChartsGrid.svelte -->
<script lang="ts">
  import ChartCard from "$lib/components/ChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import type {ChartDataPoint} from "$lib/schemas/charts";
  import {ERROR_RESET_INTERVAL_MS} from "$lib/const";

  const { configs, data }: { configs: ChartConfig[]; data: Record<string, Promise<any>> } = $props();
  const entries = $derived(Object.entries(data));
</script>

<div class="grid grid-cols-2">
  {#each entries as [id, promise], i}
    <svelte:boundary>
      <div class="card w-full p-4 mb-6">
        <ChartCard config={configs[i]} data={await promise} />
      </div>

      {#snippet failed(error, reset)}
        <div class="card w-full p-4 mb-6">
          <ErrorCard title={configs[i].id} error={"An error occurred while fetching chart data."} />
        </div>
        {@html (() => {
            console.error(error);
            setTimeout(() => reset(), ERROR_RESET_INTERVAL_MS);
            return "";
        })()}
      {/snippet}

      {#snippet pending()}
        <p>loading...</p>
      {/snippet}
    </svelte:boundary>
  {/each}
</div>
