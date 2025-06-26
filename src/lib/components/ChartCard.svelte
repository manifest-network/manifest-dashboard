<!-- AreaChart with theme context support -->
<script lang="ts">
  import '@carbon/charts-svelte/styles.css';
  import {AreaChart} from '@carbon/charts-svelte';
  import {mode} from '$lib/stores/theme';
  import {ScaleTypes, TickRotations} from "@carbon/charts-svelte";
  import {getColorFromCSS} from "$lib/utils/colors";
  import type {ChartDataPoint} from "$lib/schemas/charts";
  import memoize from "lodash/memoize";

  let themeColor = getColorFromCSS('--color-secondary-600-400')
  let w = $state<number>(0);
  let h = $state<number>(0);

  const {config, data}: { config: ChartConfig, data: ChartDataPoint[] } = $props();
  const title = $derived(typeof config.title === 'function'
    ? config.title(data?.[0])
    : `${config.title}: ${data?.[0]?.value ?? "N/A"}`);

  let isDark = $derived($mode === 'dark');

  function rawCreateConfig(id: string, w: number, h: number, isDark: boolean, yAxisTitle: string) {
    return {
      animations: false,
      axes: {
        bottom: {
          mapsTo: 'date',
          scaleType: ScaleTypes.TIME,
          title: 'Timestamp',
          ticks: {
            number: 3,
            values: [],
            rotation: TickRotations.AUTO,
          },
        },
        left: {
          mapsTo: 'value',
          scaleType: ScaleTypes.LINEAR,
          title: yAxisTitle,
          ticks: {values: []}
        }
      },
      includeZero: false,
      height: h.toString(),
      width: w.toString(),
      color: {
        gradient: {enabled: true},
        scale: {[id]: themeColor}
      },
      points: {enabled: false},
      legend: {enabled: false},
      toolbar: {enabled: false},
      grid: {
        x: {enabled: false},
        y: {enabled: false}
      },
      theme: isDark ? 'g90' : 'g10'
    }
  }

  const createConfig = memoize((id: string, w: number, h: number, isDark: boolean, yAxisTitle: string) => {
    return rawCreateConfig(id, w, h, isDark, yAxisTitle);
  }, (id, _w, _h, isDark, yAxisTitle) => {
    return `${id}-${isDark}-${yAxisTitle}`;
  });
  let chartOptions = $derived(createConfig(config.id, w, h, isDark, config.yAxisTitle));
</script>

<main>
  <div class="h-32 lg:h-32 2xl:h-64 w-full" bind:clientWidth={w} bind:clientHeight={h}>
    {#if w > 0 && h > 0}
      <h2 class="text font-bold">{title}</h2>
      <AreaChart {data} options={chartOptions} />
    {/if}
  </div>
</main>
