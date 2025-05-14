<script lang="ts">
  import {Canvas, Layer} from 'svelte-canvas';
  import {geoCentroid, geoDistance, geoOrthographic, geoPath} from 'd3-geo';
  import {worldTopoJson} from "$lib/utils/worldTopology";
  import {computedColor, getColorFromCSS} from "$lib/utils/colors";
  import {type GeoRecord, type GeoRecordArray} from "$lib/schemas";
  import * as topojson from "topojson-client";
  import type {Feature, FeatureCollection, GeoJsonProperties, Geometry} from "geojson";

  const {data} = $props<{ data: GeoRecordArray }>();

  const fillColor = computedColor(getColorFromCSS('--color-surface-600-400'));
  const strokeColor = computedColor(getColorFromCSS('--color-primary-100-900'));
  const pointColor = computedColor(getColorFromCSS('--color-secondary-500'));

  const map = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as FeatureCollection;
  let cityCount = $state<Record<string, number>>({});
  let countriesWithData = $state<Set<string>>(new Set());

  let width = $state<number>(0);
  let height = $state<number>(0);
  const pad = $derived(width * 0.02);

  let rotation = $state<[number, number]>([0, 0]);
  let dragging = $state(false);
  let _x = $state(0);
  let _y = $state(0);
  let hoverPoint = $state<GeoRecord | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  function checkPointHover(x: number, y: number) {
    if (data && data.length > 0) {
      for (const point of data) {
        const lambda = point.longitude * Math.PI / 180;
        const phi = point.latitude * Math.PI / 180;
        const rotLambda = -rotation[0] * Math.PI / 180;
        const rotPhi = -rotation[1] * Math.PI / 180;

        // Check if point is visible on globe
        const cosDistance = Math.sin(phi) * Math.sin(rotPhi) +
          Math.cos(phi) * Math.cos(rotPhi) * Math.cos(lambda - rotLambda);

        if (cosDistance > 0) {
          const coords = projection([point.longitude, point.latitude]);
          if (coords) {
            // Check if mouse is over this point (with some padding for easier interaction)
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

  const getCityCount = (city: string, country: string) => {
    const key = `${city},${country}`;
    return cityCount[key] || 1;
  };

  $effect(() => {
    if (data && data.length > 0) {
      countriesWithData = new Set(data.map((item: GeoRecord) => item.country_name));
    }
  });

  $effect(() => {
    if (data && data.length > 0) {
      // Count the occurrences of each city
      cityCount = data.reduce((acc: Record<string, number>, d: GeoRecord) => {
        const key = `${d.city},${d.country_name}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
  })

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
    if (e instanceof MouseEvent) {
      const mouseEvent = e as MouseEvent;
      _x = mouseEvent.clientX;
      _y = mouseEvent.clientY;
    }
  };

  const onUp = (_: Event) => {
    dragging = false;
  };

  const onMove = (e: Event) => {
    if (e instanceof MouseEvent) {
      const mouseEvent = e as MouseEvent;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      // Check for hover
      hoverPoint = checkPointHover(x, y);
      if (hoverPoint) {
        tooltipX = mouseEvent.clientX;
        tooltipY = mouseEvent.clientY;
      }

      // Original drag logic
      if (dragging) {
        const dx = mouseEvent.clientX - _x;
        const dy = mouseEvent.clientY - _y;
        rotation = [
          rotation[0] + dx * 0.2,
          rotation[1] - dy * 0.2,
        ];
        _x = mouseEvent.clientX;
        _y = mouseEvent.clientY;
      }
    }
  };

  const path = $derived(geoPath(projection));

  const center: [number, number] = $derived([-rotation[0], -rotation[1]])
  const backCountries = $derived(map.features.filter(d =>
      geoDistance(geoCentroid(d), center) > Math.PI / 2
    )
  );
  const frontCountries = $derived(map.features.filter(d =>
      geoDistance(geoCentroid(d), center) <= Math.PI / 2
    )
  );
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
          onmouseleave={() => { onUp; hoverPoint = null; }}
  >
    <!-- The Map -->
    <Layer
            render={({ context }) => {
        path.context(context);
        context.strokeStyle = strokeColor;

        backCountries.forEach(country => {
          context.fillStyle = countriesWithData.has(country.properties?.NAME_LONG)
            ? computedColor(getColorFromCSS('--color-primary-900-100'))
            : fillColor;
          context.beginPath();
          path(country);
          context.fill();
          context.stroke();
        });
      }}
    />

    <Layer
            render={({ context }) => {
        path.context(context);
        context.strokeStyle = strokeColor;

        frontCountries.forEach(country => {
          context.fillStyle = countriesWithData.has(country.properties?.NAME_LONG)
            ? computedColor(getColorFromCSS('--color-primary-900-100'))
            : fillColor;
          context.beginPath();
          path(country);
          context.fill();
          context.stroke();
        });
      }}
    />
    <!-- The Nodes -->
    <Layer
            render={({ context }) => {
        if (data && data.length > 0) {
          context.fillStyle = pointColor;

          data.forEach((point: GeoRecord) => {
            if (geoDistance([point.longitude, point.latitude], rotation) > Math.PI / 2) {
              const coords = projection([point.longitude, point.latitude]);
              if (coords) {
                context.beginPath();
                context.arc(coords[0], coords[1], 4, 0, 2 * Math.PI);
                context.fill();

                context.font = '12px inter';
                context.textAlign = 'center';
                context.textBaseline = 'top';
                context.fillText(point.city, coords[0], coords[1] + 6);
                context.fillStyle = pointColor;
              }
            }
          });
        }
      }}
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