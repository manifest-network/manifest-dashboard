<script lang="ts">
  import {Canvas, Layer} from 'svelte-canvas';
  import {geoCentroid, geoDistance, geoOrthographic, geoPath} from 'd3-geo';
  import { quadtree } from 'd3-quadtree';
  import {worldFeatures} from "$lib/utils/worldTopology";
  import {computedColor, getColorFromCSS} from "$lib/utils/colors";
  import {mode} from '$lib/stores/theme';
  import {onDestroy} from "svelte";
  import type {GeoRecord, GeoRecordArray} from "$lib/schemas/geo";

  interface Cluster {
    readonly members: readonly GeoRecord[];
    readonly coords: readonly [number, number];
  }

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
  let hoverCluster = $state<Cluster | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let fontLoaded = $state(false);
  let componentActive = true;

  let autoRotating = $state(true);
  let inactivityTimeout = $state<number | null>(null);
  let animationFrame = $state<number | null>(null);

  const rotationSpeed = 0.2; // degrees per frame
  const inactivityDelay = 1000; // ms before autorotation starts after user stops interacting

  const CLUSTER_RADIUS = 8;
  let clusters = $derived.by(() => {
    // Build a quadtree on screen-space points
    const visiblePoints = [...citiesWithData.values()].filter(isVisible);
    const tree = quadtree<GeoRecord>()
      .x(d => projection([d.longitude, d.latitude])![0])
      .y(d => projection([d.longitude, d.latitude])![1])
      .addAll(visiblePoints);

    const out: Cluster[] = [];

    // Radius-based neighbor lookup
    function neighbors(x: number, y: number) {
      const result: GeoRecord[] = [];
      const r2 = CLUSTER_RADIUS * CLUSTER_RADIUS;
      tree.visit((node, x0, y0, x1, y1) => {
        const dx = Math.max(0, x0 - x, x - x1);
        const dy = Math.max(0, y0 - y, y - y1);
        if (dx*dx + dy*dy > r2) return true;
        if (!node.length) {
          let d: any = node;
          do {
            const pt = d.data as GeoRecord;
            const [px, py] = projection([pt.longitude, pt.latitude])!;
            if ((px - x)**2 + (py - y)**2 <= r2) result.push(pt);
            d = d.next;
          } while (d);
        }
        return false;
      });
      return result as readonly GeoRecord[];
    }

    // Build clusters
    for (const pt of visiblePoints) {
      const [x, y] = projection([pt.longitude, pt.latitude])!;
      if (out.some(c => c.members.includes(pt))) continue;
      out.push({ members: neighbors(x, y), coords: [x, y] as const });
    }

    return out;
  });

  // Hover detection for clusters
  function checkClusterHover(mx: number, my: number): Cluster | null {
    for (const c of clusters) {
      if (Math.hypot(c.coords[0] - mx, c.coords[1] - my) <= CLUSTER_RADIUS) {
        return c;
      }
    }
    return null;
  }

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

  function isVisible(point: GeoRecord): boolean {
    return geoDistance([point.longitude, point.latitude], center) <= Math.PI / 2;
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
        citiesWithData.set(`${item.city},${item.country_name}`, item)
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

      hoverCluster = checkClusterHover(x, y);
      if (hoverCluster) {
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
          onpointerdown={onDown}
          onpointerup={onUp}
          onpointermove={onMove}
          onpointerleave={() => { onUp(new PointerEvent('pointerleave')); hoverCluster = null; }}
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

          clusters.forEach(c => {
            const isCluster = c.members.length > 1;
            const radius = isCluster ? 7 : 5;

            context.beginPath();
            context.arc(c.coords[0], c.coords[1], radius, 0, 2*Math.PI);
            context.fillStyle = isCluster ? computedColor(getColorFromCSS('--color-secondary-900')) : pointColor;
            context.fill();
            context.lineWidth = 1;
            context.stroke();
          });
        }
      }
    />
  </Canvas>

  {#if hoverCluster}
    <div class="tooltip" style="left: {tooltipX + 10}px; top: {tooltipY - 10}px">
      <div class="tooltip-content">
        {#each hoverCluster.members as cityRec}
          <div><b>{cityRec.city}</b>: {getCityCount(cityRec.city, cityRec.country_name)}</div>
        {/each}
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