<script lang="ts">
  import {computedColor, getColorFromCSS} from "$lib/utils/colors";
  import type {PageProps} from "../../../.svelte-kit/types/src/routes/globe/$types";
  import * as topojson from 'topojson-client';
  import type {FeatureCollection} from 'geojson';
  import {worldTopoJson} from "$lib/utils/worldTopology";
  import {mode} from '$lib/stores/theme';
  import {PerspectiveCamera} from "three";

  function computeGlobeColors() {
    return {
      bgHex: computedColor(getColorFromCSS('--color-surface-100-900')),
      labelHex: computedColor(getColorFromCSS('--color-secondary-500')),
      fillHex: computedColor(getColorFromCSS('--color-primary-900-100')),
      borderHex: computedColor(getColorFromCSS('--color-primary-100-900')),
    };
  }

 function debouncedHandleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Only handle resize when dimensions are valid, and world exists
        if (world && globeContainer && w > 0 && h > 0) {
            world.width(w).height(h);
            const renderer = world.renderer();
            const camera = world.camera() as PerspectiveCamera;
            if (renderer) {
                renderer.setSize(w, h);
            }
            if (camera) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        }
    }, 150); // adjust delay as needed for your UX
}

  const { data }: PageProps = $props();

  let globeContainer = $state<HTMLDivElement|null>(null);
  let world         = $state<import('globe.gl').GlobeInstance|null>(null);
  let w = $state<number>(0);
  let h = $state<number>(0);
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  let geo = $state<GeoRecord[]>(data.geo);
  let cityCount = $state<Record<string, number>>();

  // If the `feature` function's `object` parameter is a `GeometryCollection`,
  // then the return type is `FeatureCollection` as per https://github.com/topojson/topojson-client?tab=readme-ov-file#feature
  const countriesTopo = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as FeatureCollection;

  // Update the city count when the geo data changes
  $effect(() => {
    if (geo && geo.length > 0) {
      // Count the occurrences of each city
      cityCount = geo.reduce((acc, d) => {
        const key = `${d.city},${d.country_name}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
  })

  // Helper function to retrieve the city count from a GeoRecord
  const getCityCount = (d) => {
    const key = `${d.city},${d.country_name}`;
    return cityCount[key] || 1;
  };

  // Helper function to create a tooltip for the points
  const getTooltip = d => {
    const key = `${d.city},${d.country_name}`;
    const count = cityCount[key] || 1;
    return `
      <div style="text-align: center">
        <div><b>${d.city}</b>, ${count}</div>
      </div>
    `;
    }

  // Initialize the globe
  $effect(() => {
    if (globeContainer && !world && w > 0 && h > 0) {
      const {fillHex, borderHex, labelHex} = computeGlobeColors();
      import('globe.gl').then(module => {
        const Globe = module.default;
        const globeInstance = new Globe(globeContainer)
        .width(w)
        .height(h)
        .backgroundColor('rgba(0,0,0,0)')
        .showGlobe(false)
        .showAtmosphere(false)
        .polygonsData(countriesTopo.features)
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .pointsMerge(true)
        .labelSize(1)
        .labelDotRadius(0.12)
        .labelDotOrientation(() => 'bottom')
        .labelResolution(1)
        .pointOfView({ lat: 30, lng: -103, altitude: 1.5 }, 0);

        world = globeInstance;
      });
    }
  });

  // Update the globe colors when the mode changes
  $effect(() => {
    if (world && globeContainer) {
      const _ = $mode; // Trigger reactivity on theme change
      const { fillHex, borderHex, labelHex } = computeGlobeColors();
      world
        .polygonCapColor(() => fillHex)
        .polygonStrokeColor(() => borderHex)
        .pointColor(() => labelHex)
        .labelColor(() => labelHex);
    }
  });

  // Update the globe size when the width or height changes
  $effect(() => {
    debouncedHandleResize()
  })

  // Update the globe points and labels when the geo data changes
  $effect(() => {
    if (world && globeContainer && geo) {
        world.pointsData(geo)
          .pointLat(d => (d as GeoRecord).latitude)
          .pointLng(d => (d as GeoRecord).longitude)
          .pointRadius(d => 0.08 + 0.05 * Math.log2(getCityCount(d)))
          .pointAltitude(d => 0.2 + 0.15 * Math.log2(getCityCount(d)))
          .pointLabel(d => (d as GeoRecord).city)
          .labelsData(geo)
          .labelLat(d => (d as GeoRecord).latitude)
          .labelLng(d => (d as GeoRecord).longitude)
          .labelText(d => (d as GeoRecord).city)
          .labelAltitude(d => 0.2 + 0.15 * Math.log2(getCityCount(d)))
          .labelLabel(getTooltip);
    }
  })
</script>

<!-- Update the globe size when the window is resized -->
<svelte:window on:resize={debouncedHandleResize} />

<main>
  <div class="globe-container" bind:this={globeContainer} bind:clientWidth={w} bind:clientHeight={h}></div>
</main>

<style>
  .globe-container {
    width: 100%;
    height: 50vh;
  }
</style>
