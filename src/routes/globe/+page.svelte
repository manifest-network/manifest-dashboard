<script lang="ts">
  import {getColorFromCSS} from "$lib/utils/colors";
  import type { GlobeInstance} from 'globe.gl'
  import type {PageProps} from "../../../.svelte-kit/types/src/routes/globe/$types";

  let globeContainerElement: HTMLDivElement;
  let globeInstance: GlobeInstance;

  function normalizeColor(cssColor: string): string {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = cssColor;
    return ctx.fillStyle;
  }

  const { data }: PageProps = $props();
  const geo = data.geo;

  $effect(() => {
    if (typeof window !== 'undefined' && globeContainerElement) {
      const raw = getColorFromCSS('--color-surface-950-50');
      const labelRaw = getColorFromCSS('--color-secondary-500');
      const hex = normalizeColor(raw);
      const labelHex = normalizeColor(labelRaw);

      import('globe.gl').then(module => {
        const Globe = module.default;
        globeInstance = new Globe(globeContainerElement, {animateIn: false})
          .backgroundColor(hex)
          .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg')
          .pointOfView({ lat: 30, lng: -103, altitude: 2.5 }, 0)
          .showAtmosphere(false)
          .labelsData(geo)
          .labelLat(d => (d as GeoRecord).latitude)
          .labelLng(d => (d as GeoRecord).longitude)
          .labelText(d => (d as GeoRecord).city)
          .labelSize(2)
          .labelDotRadius(1)
          .labelColor(() => labelHex)
          .labelResolution(1)
          .pointAltitude('size')
          .pointColor('color');
        globeInstance.controls().enableZoom = false;
        globeInstance.controls().autoRotate = true;
      });
    }
    return () => {
      if (globeInstance && typeof (globeInstance as any)._destructor === 'function') {
        (globeInstance as any)._destructor();
      }
    };
  });
</script>

<main>
  <div bind:this={globeContainerElement}></div>
</main>