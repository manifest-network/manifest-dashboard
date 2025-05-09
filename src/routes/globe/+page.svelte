<script lang="ts">
  import {getColorFromCSS, computedColor} from "$lib/utils/colors";
  import type {PageProps} from "../../../.svelte-kit/types/src/routes/globe/$types";
  import * as topojson from 'topojson-client';
  import type { FeatureCollection } from 'geojson';
  import {worldTopoJson} from "$lib/utils/worldTopology";
  import { mode } from '$lib/stores/theme';
  import {PerspectiveCamera} from "three";

  function computeGlobeColors() {
    return {
      bgHex: computedColor(getColorFromCSS('--color-surface-100-900')),
      labelHex: computedColor(getColorFromCSS('--color-secondary-500')),
      fillHex: computedColor(getColorFromCSS('--color-primary-900-100')),
      borderHex: computedColor(getColorFromCSS('--color-primary-100-900')),
    };
  }

  // Handles renderer resize
  function handleResize() {
    if (!world || w === 0 || h === 0) return;

    world.width(w).height(h)

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

  let globeContainer = $state<HTMLDivElement|null>(null);
  let world         = $state<import('globe.gl').GlobeInstance|null>(null);
  let w = $state<number>(0);
  let h = $state<number>(0);

  // If the `feature` function's `object` parameter is a `GeometryCollection`,
  // then the return type is `FeatureCollection` as per https://github.com/topojson/topojson-client?tab=readme-ov-file#feature
  const countriesTopo = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as FeatureCollection;

  const { data }: PageProps = $props();
  const geo = data.geo;

  // Initialize the globe
  $effect(() => {
    if (globeContainer && !world && w > 0 && h > 0) {
      const {bgHex, fillHex, borderHex, labelHex} = computeGlobeColors();
      import('globe.gl').then(module => {
        const Globe = module.default;
        const globeInstance = new Globe(globeContainer)
        .width(w)
        .height(h)
        .backgroundColor(bgHex)
        .showGlobe(false)
        .showAtmosphere(false)
        .polygonsData(countriesTopo.features)
        .polygonCapColor(() => fillHex)
        .polygonStrokeColor(() => borderHex)
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .pointOfView({ lat: 30, lng: -103, altitude: 2.5 }, 0)
        .labelsData(geo)
        .labelLat(d => (d as GeoRecord).latitude)
        .labelLng(d => (d as GeoRecord).longitude)
        .labelText(d => (d as GeoRecord).city)
        .labelSize(2)
        .labelDotRadius(1)
        .labelColor(() => labelHex)
        .labelAltitude(0.01)
        .labelResolution(1);

        globeInstance.controls().enableZoom = false;
        globeInstance.controls().autoRotate = true;
        world = globeInstance;
      });
    }
  });

  // Update the globe colors when the mode changes
  $effect(() => {
    if (world && globeContainer) {
      const _ = $mode; // Trigger reactivity on theme change
      const { bgHex, fillHex, borderHex, labelHex } = computeGlobeColors();
      world
        .backgroundColor(bgHex)
        .polygonCapColor(() => fillHex)
        .polygonStrokeColor(() => borderHex)
        .labelColor(() => labelHex);
    }
  });

  // Update the globe size when the width or height changes
  $effect(() => {
    handleResize()
  })
</script>

<!-- Update the globe size when the window is resized -->
<svelte:window on:resize={handleResize} />

<main>
  <div class="globe-container" bind:this={globeContainer} bind:clientWidth={w} bind:clientHeight={h}></div>
</main>

<style>
  .globe-container {
    width: 100%;
    height: 100vh;     /* ← full viewport height */
  }
</style>
