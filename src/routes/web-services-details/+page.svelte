<script lang="ts">
  import type {PageProps} from "./$types";
  import {useAutoRefresh} from "$lib/utils/useAutoRefresh.svelte";
  import ChartCardAsync from "$lib/components/ChartCardAsync.svelte";
  import {configs} from "./config";

  let {data}: PageProps = $props();

  useAutoRefresh({key: 'data:web-services-details'});
</script>

<main>
  <div class="grid grid-cols-2">
    {#each configs as config (config.id)}
      <ChartCardAsync {config} promise={data.charts[config.id]} />
    {/each}
  </div>
</main>
