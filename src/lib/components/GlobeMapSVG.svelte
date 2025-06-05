<script lang="ts">
  import {Canvas, Layer} from 'svelte-canvas';
  import {geoCentroid, geoDistance, geoOrthographic, geoPath} from 'd3-geo';
  import {worldFeatures} from "$lib/utils/worldTopology";
  import {computedColor, getColorFromCSS} from "$lib/utils/colors";
  import {mode} from '$lib/stores/theme';
  import {onDestroy} from "svelte";
  import type {GeoRecord, GeoRecordArray} from "$lib/schemas/geo";

  const {data} = $props<{ data: GeoRecordArray }>();

  let fillColor = $state(computedColor(getColorFromCSS('--color-surface-600-400')));
  let strokeColor = $state(computedColor(getColorFromCSS('--color-primary-100-900')));
  let pointColor = $state(computedColor(getColorFromCSS('--color-secondary-500')));

  let cityCount = $state<Record<string, number>>({});
  let countriesWithData = $state<Set<string>>(new Set());
  let citiesWithData = $state<Map<string, GeoRecord>>(new Map());

  let width = $state<number>(0);
  let height = $state<number>(0);
  const pad = $derived(width * 0.02);

  let rotation = $state<[number, number]>([98, -26]); // Initialize over the USA
  let dragging = $state(false);
  let _x = $state(0);
  let _y = $state(0);
  let hoverPoint = $state<GeoRecord | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let fontLoaded = $state(false);
  let componentActive = true;

  let autoRotating = $state(true);
  let inactivityTimeout = $state<number | null>(null);
  let animationFrame = $state<number | null>(null);

  const rotationSpeed = 0.2; // degrees per frame
  const inactivityDelay = 1000; // ms before autorotation starts after user stops interacting

  function animateGlobe() {
    if (autoRotating && !dragging) {
      rotation = [rotation[0] + rotationSpeed, rotation[1]];
    }
    animationFrame = requestAnimationFrame(animateGlobe);
  }

  // Start animation when component initializes
  $effect(() => {
    animationFrame = requestAnimationFrame(animateGlobe);
  });

  // Make sure the `Inter` font is loaded before rendering the points
  $effect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        document.fonts.load('12px Inter').then(() => {
          if (componentActive) fontLoaded = true;
        });
      });
    }
  });

  // Clean up the font loading effect when the component is destroyed
  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = null;
    }
    componentActive = false;
  });

  // checkPointHover checks if the user is currently hovering one of the info point with the mouse cursor
  function checkPointHover(x: number, y: number) {
    if (data && data.length > 0) {
      for (const point of data) {
        const d = geoDistance([point.longitude, point.latitude], rotation);
        if (d > Math.PI / 2) {
          const coords = projection([point.longitude, point.latitude]);
          if (coords) {
            const dx = coords[0] - x;
            const dy = coords[1] - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= 8) { // 8px radius for hover detection
              return point;
            }
          }
        }
      }
    }
    return null;
  }

  // getCityCount returns the number of reported server per city
  const getCityCount = (city: string, country: string) => {
    const key = `${city},${country}`;
    return cityCount[key] || 1;
  };

  // Compute the countries with at least one reported server
  $effect(() => {
    if (data && data.length > 0) {
      data.forEach((item: GeoRecord) => {
        let country_name = item.country_name;
        // Handle the case where the country name is "United States"
        // The country name is "United States of America" in the world map
        if (country_name === 'United States') {
          country_name = 'United States of America'
        }
        countriesWithData.add(country_name)
        citiesWithData.set(item.city, item)
      })
    }
  });

  // Compute and cache the number of reported server per city
  $effect(() => {
    if (data && data.length > 0) {
      cityCount = data.reduce((acc: Record<string, number>, d: GeoRecord) => {
        const key = `${d.city},${d.country_name}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
  })

  // An orthographic projection with clipping disabled so we can see the far side of the globe
  const projection = $derived(
    geoOrthographic()
      .fitExtent(
        [
          [pad, pad],
          [width - pad, height - pad],
        ],
        {type: 'Sphere'},
      )
      .rotate(rotation)
      .clipAngle(180)
  );

  const onDown = (e: Event) => {
    dragging = true;
    autoRotating = false;
    if (e instanceof MouseEvent) {
      const mouseEvent = e as MouseEvent;
      _x = mouseEvent.clientX;
      _y = mouseEvent.clientY;
    }
  };

  const onUp = (_: Event) => {
    dragging = false;

    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      if (!dragging) autoRotating = true;
    }, inactivityDelay);
  };

  const onMove = (e: Event) => {
    if (e instanceof MouseEvent) {
      const mouseEvent = e as MouseEvent;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      hoverPoint = checkPointHover(x, y);
      if (hoverPoint) {
        tooltipX = mouseEvent.clientX;
        tooltipY = mouseEvent.clientY;
      }

      if (dragging) {
        autoRotating = false;
        const dx = mouseEvent.clientX - _x;
        const dy = mouseEvent.clientY - _y;

        const sensitivity = 0.2;
        rotation = [
          rotation[0] + dx * sensitivity,
          Math.max(-85, Math.min(85, rotation[1] - dy * sensitivity)),
        ];

        _x = mouseEvent.clientX;
        _y = mouseEvent.clientY;

        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
          if (!dragging) autoRotating = true;
        }, inactivityDelay);
      }
    }
  };

  const path = $derived(geoPath(projection));
  const center: [number, number] = $derived([-rotation[0], -rotation[1]])

  // Compute which countries are on the far side of the globe
  const backCountries = $derived(worldFeatures.filter(d =>
      geoDistance(geoCentroid(d), center) > Math.PI / 2
    )
  );

  // Compute which countries are on the visible side of the globe
  const frontCountries = $derived(worldFeatures.filter(d =>
      geoDistance(geoCentroid(d), center) <= Math.PI / 2
    )
  );

  $effect(() => {
    // Reference mode to create the dependency
    const _ = $mode;

    // Update colors
    fillColor = computedColor(getColorFromCSS('--color-surface-600-400'));
    strokeColor = computedColor(getColorFromCSS('--color-primary-100-900'));
    pointColor = computedColor(getColorFromCSS('--color-secondary-500'));
  });
</script>

<main class="globe-root">
  <Canvas layerEvents
          onresize={(e) => {
      width = e.width;
      height = e.height;
  }}
          onmousedown={onDown}
          onmouseup={onUp}
          onmousemove={onMove}
          onmouseleave={() => { onUp(new MouseEvent('mouseleave')); hoverPoint = null; }}
  >
    <!-- The Map -->
    <!-- Render the far side of the globe first -->
    <Layer
            render={({ context }) => {
        path.context(context);
        context.strokeStyle = strokeColor;

        backCountries.forEach(country => {
          context.fillStyle = countriesWithData.has(country.properties?.name)
            ? computedColor(getColorFromCSS('--color-primary-900-100'))
            : fillColor;
          context.beginPath();
          path(country);
          context.fill();
          context.stroke();
        });
      }}
    />

    <!-- The render the visible side of the globe -->
    <Layer
            render={({ context }) => {
        path.context(context);
        context.strokeStyle = strokeColor;

        frontCountries.forEach(country => {
          context.fillStyle = countriesWithData.has(country.properties?.name)
            ? computedColor(getColorFromCSS('--color-primary-900-100'))
            : fillColor;
          context.beginPath();
          path(country);
          context.fill();
          context.stroke();
        });
      }}
    />

    <!-- Then render one point per city with at least one reported server -->
    <Layer
            render={({ context }) => {
           if (!fontLoaded) return;
          context.fillStyle = pointColor;
          context.font = '12px Inter';
          context.textAlign = 'center';
          context.textBaseline = 'top';

          citiesWithData.forEach((point: GeoRecord) => {
            if (geoDistance([point.longitude, point.latitude], rotation) > Math.PI / 2) {
              const coords = projection([point.longitude, point.latitude]);
              if (coords) {
                context.beginPath();
                context.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
                context.fill();

                context.lineWidth = 1;
                context.strokeStyle = strokeColor;  // or any CSS-driven color
                context.stroke();

                // Uncomment the following line to display city names on the map
                // context.fillText(point.city, coords[0], coords[1] + 6);
                context.fillStyle = pointColor;
              }
            }
          });
        }
      }
    />
  </Canvas>

  {#if hoverPoint}
    <div class="tooltip" style="left: {tooltipX + 10}px; top: {tooltipY - 10}px">
      <div class="tooltip-content">
        <b>{hoverPoint.city}</b>: {getCityCount(hoverPoint.city, hoverPoint.country_name)}
      </div>
    </div>
  {/if}
</main>

<style>
    .globe-root {
        width: 100%;
        height: 85vh;
        touch-action: none;
    }

    .tooltip {
        position: absolute;
        background: var(--color-surface-200-800);
        border: 1px solid var(--color-primary-500);
        border-radius: 4px;
        padding: 8px;
        pointer-events: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 10;
        transform: translate(0, -100%);
    }

    .tooltip-content {
        font-size: 14px;
        white-space: nowrap;
    }
</style>