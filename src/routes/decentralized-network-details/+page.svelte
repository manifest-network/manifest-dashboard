<script lang="ts">
  import type {PageProps} from "./$types";
  import {configs} from "./config";
  import {readable} from 'svelte/store';
  import {invalidateAll} from '$app/navigation';
  import ChartGrid from "$lib/components/ChartGrid.svelte";
  import {ERROR_RESET_INTERVAL_MS, RELOAD_INTERVAL_MS} from "$lib/const";
  // TODO: Issue with set_context_after_init triggered by svelte-canvas
  // TODO: https://github.com/sveltejs/svelte/issues/16629
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import Globe from "$lib/components/Globe.svelte";

  const {data}: PageProps = $props();
  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), RELOAD_INTERVAL_MS);
    return () => clearInterval(id);
  });

  // TODO: Issue with set_context_after_init triggered by svelte-canvas
  // TODO: https://github.com/sveltejs/svelte/issues/16629
  // I need to await the data here to avoid the error boundary being triggered
  const metrics = $derived(await Promise.all(data.metrics));
  const world = $derived(await data.world);

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
    <svelte:boundary>
<!--&lt;!&ndash; TODO: Issue with set_context_after_init triggered by svelte-canvas  &ndash;&gt;-->
<!--&lt;!&ndash; TODO: https://github.com/sveltejs/svelte/issues/16629 &ndash;&gt;-->
      <Globe data={world} />
      {#snippet failed(error, reset)}
        <div class="card w-full p-4 mb-6">
          <ErrorCard title="World" error={"An error occurred while fetching world data."} />
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

    <ChartGrid {configs} data={metrics} />
  </div>
</main>
