<script lang="ts">
  import { Chart, type ChartContextValue, Layer, GeoPath, GeoContext, GeoCircle, GeoVisible, Tooltip } from "layerchart"
  import {geoOrthographic} from "d3-geo"
  import Paused from 'carbon-icons-svelte/lib/Pause.svelte';
  import Play from 'carbon-icons-svelte/lib/Play.svelte';
  import { worldGeoJson as countries } from "$lib/utils/worldTopology";
  import type {GeoRecordArray} from "$lib/schemas/geo";
  import {clusterGeoPoints} from "$lib/utils/clustering";
  import { AnimationFrames } from "runed";

  const {data} = $props<{ data: GeoRecordArray }>();
  let context = $state<ChartContextValue>();

  let clusters = $derived.by(() => {
    if (!context?.geo?.projection) return [];
    return clusterGeoPoints(data, context.geo.projection, 8);
  });

  let velocity = $state(0.5);
  let frames = $state(0);
	let fpsLimit = $state(60);
	const animation = new AnimationFrames(
		() => {
      if (!context) return;

      const curr = context.transform.translate;

      context.transform.translate = {
        x: (curr.x += velocity),
        y: curr.y,
      };

      frames++;
		},
		{ fpsLimit: () => fpsLimit }
	);

  const countriesWithData = $derived.by(() => {
    const s = new Set<string>();

    for (const item of data) {
      let name = item.country_name;
      if (name === 'United States') name = 'United States of America';
      s.add(name);
    }

    return s;
  });

  const cityCount = $derived.by(() => {
    const counts: Record<string, number> = {};

    for (const d of data) {
      const key = `${d.city},${d.country_name}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    return counts;
  })

  const getCityCount = (city: string, country: string) => {
    const key = `${city},${country}`;
    return cityCount[key] || 1;
  };
</script>

<main>
  <div class="globe-root">
    <Chart
      geo={{
        projection: geoOrthographic,
        fitGeojson: countries,
        applyTransform: ["rotate"],
      }}
      ondragstart={animation.stop}
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
              class={countriesWithData.has(country.properties?.name)
                  ? "stroke-surface-100/30 fill-primary cursor-pointer"
                  : "stroke-surface-100/30 fill-primary-content cursor-pointer"}
              />
          {/each}

          <!-- City clusters -->
          {#each clusters as cluster}
            <GeoVisible lat={cluster.latitude} long={cluster.longitude}>
              <GeoCircle
                center={[cluster.longitude, cluster.latitude]}
                radius={0.7}
                class="fill-tertiary-500/100"
                onpointermove={(e) => context.tooltip.show(e, cluster)}
                onpointerleave={() => context.tooltip.hide()}
              />
            </GeoVisible>
          {/each}
        </Layer>

        <Tooltip.Root>
          {@const points: readonly GeoRecord[] = (context.tooltip.data?.points ?? [])}
          <Tooltip.List>
            {#each points as p}
              <Tooltip.Item label={p.city} value={getCityCount(p.city, p.country_name)} />
            {/each}
          </Tooltip.List>
        </Tooltip.Root>
      {/snippet}
    </Chart>

    <div class="absolute bottom-4 left-4 z-10 pointer-events-auto group">
      <button type="button"
              class="btn preset-outlined-primary-800-200"
              aria-label="Toggle globe rotation"
              title={animation.running ? "Pause rotation" : "Play rotation"}
              onclick={animation.toggle}>
        {#if animation.running}
          <Paused size={24}/>
        {:else}
          <Play size={24}/>
        {/if}
      </button>
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