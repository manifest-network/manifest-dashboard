<script lang="ts">
  import type {PageProps} from "./$types";
  import {configs} from "./config";
  import {readable} from 'svelte/store';
  import {invalidateAll} from '$app/navigation';
  import ChartGrid from "$lib/components/ChartGrid.svelte";
  import {ERROR_RESET_INTERVAL_MS, RELOAD_INTERVAL_MS} from "$lib/const";
  // TODO: Issue with set_context_after_init triggered by svelte-canvas
  // TODO: https://github.com/sveltejs/svelte/issues/16629
  // import GlobeMapSVG from "$lib/components/GlobeMapSVG.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import ChartCard from "$lib/components/ChartCard.svelte";

  const {data}: PageProps = $props();
  // const tick = readable(Date.now(), (set) => {
  //   const id = setInterval(() => set(Date.now()), RELOAD_INTERVAL_MS);
  //   return () => clearInterval(id);
  // });
  //
  // $effect(() => {
  //   if ($tick) {
  //     invalidateAll();
  //   }
  // });
  //
</script>


<main>
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-hidden p-4">
<!--    <svelte:boundary>-->
<!--&lt;!&ndash; TODO: Issue with set_context_after_init triggered by svelte-canvas  &ndash;&gt;-->
<!--&lt;!&ndash; TODO: https://github.com/sveltejs/svelte/issues/16629 &ndash;&gt;-->
<!--      <GlobeMapSVG data={await data.world} />-->
<!--      {#snippet failed(error, reset)}-->
<!--        <div class="card w-full p-4 mb-6">-->
<!--          <ErrorCard title="World" error={"An error occurred while fetching world data."} />-->
<!--        </div>-->
<!--        {@html (() => {-->
<!--            console.error(error);-->
<!--            setTimeout(() => reset(), ERROR_RESET_INTERVAL_MS);-->
<!--            return "";-->
<!--        })()}-->
<!--      {/snippet}-->

<!--      {#snippet pending()}-->
<!--        <p>loading...</p>-->
<!--      {/snippet}-->

<!--    </svelte:boundary>-->

    <svelte:boundary>
      <div class="card w-full">
        <ChartCard config={configs[0]} data={d} />
      </div>

      {#snippet failed(error, reset)}
        <div class="card w-full">
          <ErrorCard title={configs[0].id} error={"An error occurred while fetching chart data."} />
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

<!--    <ChartGrid {configs} data={data.metrics} />-->
  </div>
</main>
