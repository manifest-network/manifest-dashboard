<script lang="ts">
  import type {PageProps} from "./$types";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs} from "./config";
  import {RELOAD_INTERVAL_MS} from "$lib/const";
  import ChartGrid from "$lib/components/ChartGrid.svelte";

  let {data}: PageProps = $props();
  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), RELOAD_INTERVAL_MS);
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

<ChartGrid {configs} {data} />
