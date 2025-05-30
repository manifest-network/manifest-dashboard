<script lang="ts">
  import type {PageProps} from "./$types";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs} from "./config";
  import ChartCard from "$lib/components/ChartCard.svelte";

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
    {#each configs as config, i}
      <div class="card w-full p-4 mb-4">
        <ChartCard config={config} data={data.data[i]}/>
      </div>
    {/each}
  </div>
</main>
