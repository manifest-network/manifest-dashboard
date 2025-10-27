<script lang="ts">
  import { Chart, type ChartContextValue, Layer, GeoPath, GeoContext, GeoCircle, GeoVisible } from "layerchart"
  import {geoOrthographic} from "d3-geo"
  import Paused from 'carbon-icons-svelte/lib/Pause.svelte';
  import Play from 'carbon-icons-svelte/lib/Play.svelte';
  import { worldGeoJson as countries } from "$lib/utils/worldTopology";
  import type {GeoRecordArray} from "$lib/schemas/geo";
  import {clusterGeoPoints} from "$lib/utils/clustering";

  const {data} = $props<{ data: GeoRecordArray }>();
  let context = $state<ChartContextValue>();

  let clusters = $derived.by(() => {
    if (!context?.geo?.projection) return [];
    return clusterGeoPoints(data, context.geo.projection, 8);
  });

  // TODO: FIX TIMER AND DRAGGING INTERACTIONS
  // const velocity = 0.2;
  // let animationFrame = $state<number | null>(null);
  //
  // function animateGlobe() {
  //   if (autoRotating && !dragging) {
  //     rotation = [rotation[0] + rotationSpeed, rotation[1]];
  //   }
  //   animationFrame = requestAnimationFrame(animateGlobe);
  // }
  //
  // // Start animation when component initializes
  // $effect(() => {
  //   animationFrame = requestAnimationFrame(animateGlobe);
  // });

</script>

<main>
  <div class="globe-root">
    <Chart
      geo={{
        projection: geoOrthographic,
        fitGeojson: countries,
        applyTransform: ["rotate"],
      }}
      bind:context
    >
      {#snippet children({ context })}
        {@const [yaw, pitch, roll] = context.geo.projection?.rotate() ?? [
          0, 0, 0,
        ]}
        <Layer type="svg">
          <!-- Back -->
          <GeoContext
            projection={geoOrthographic}
            fitGeojson={countries}
            rotate={{ yaw: yaw + 180, pitch: -pitch, roll: -roll }}
            reflectX
          >
            {#each countries.features as country}
              <GeoPath
                geojson={country}
                class="stroke-surface-content/5 fill-surface-content/10"
              />
            {/each}
          </GeoContext>

          <!-- Front -->
          {#each countries.features as country}
            <GeoPath
              geojson={country}
              class="stroke-surface-100/30 fill-primary-content cursor-pointer hover:fill-primary"
              tooltipContext={context.tooltip}
            />
          {/each}

          <!-- City clusters -->
          {#each clusters as cluster}
            <GeoVisible lat={cluster.latitude} long={cluster.longitude}>
              <GeoCircle
                      center={[cluster.longitude, cluster.latitude]}
                radius={0.7}
                class="fill-secondary/100"
              />
            </GeoVisible>
          {/each}
        </Layer>
      {/snippet}
    </Chart>

<!--    <div class="absolute bottom-4 left-4 z-10 pointer-events-auto group">-->
<!--    <button type="button" class="btn preset-outlined-primary-800-200" onclick={timer.running ? timer.stop : timer.start}-->
<!--            aria-label="Toggle globe rotation">-->
<!--      {#if timer.running}-->
<!--        <Paused size={24}/>-->
<!--      {:else}-->
<!--        <Play size={24}/>-->
<!--      {/if}-->
<!--    </button>-->

    <!-- Pure CSS tooltip on Canvas -->
    <div class="tooltip absolute top-full opacity-0 group-hover:opacity-100 group-hover:delay-1000 transition-opacity pointer-events-none delay-0 z-20"
         style:left="{60}px" style:top="{10}px">
      <div class="tooltip-content">
        Toggle globe rotation
      </div>
    </div>
  </div>
</main>

<style>
  .globe-root {
      position: relative;
      width: 100%;
      height: 85vh;
      touch-action: none;
  }
</style>