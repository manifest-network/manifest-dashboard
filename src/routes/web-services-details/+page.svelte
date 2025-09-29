<script lang="ts">
  import type {PageProps} from "./$types";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import {configs} from "./config";
  import ChartCard from "$lib/components/ChartCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import ChartGrid from "$lib/components/ChartGrid.svelte";
  import {RELOAD_INTERVAL_MS} from "$lib/const";

  let {data}: PageProps = $props();
  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), RELOAD_INTERVAL_MS);
    return () => clearInterval(id);
  });

  $effect(() => {
    if ($tick) {
      invalidateAll();
    }
  });
</script>

<ChartGrid {configs} {data} />
