<!-- AreaChart with theme context support -->
<script lang="ts">
  import '@carbon/charts-svelte/styles.css';
  import { AreaChart } from '@carbon/charts-svelte';
  import { ScaleTypes, TickRotations } from '@carbon/charts-svelte';
  import { mode } from '$lib/stores/theme';
  import { getColorFromCSS } from '$lib/utils/colors';
  import type { ChartDataPoint } from '$lib/schemas/charts';

  const { config, data }: { config: ChartConfig; data: ChartDataPoint[] } = $props();

  let themeColor = getColorFromCSS('--color-secondary-600-400');
  let isDark = $derived($mode === 'dark');

  const chartOptions = $derived({
    animations: false,
    axes: {
      bottom: {
        mapsTo: 'date',
        scaleType: ScaleTypes.TIME,
        title: 'Timestamp',
        ticks: { number: 3, values: [], rotation: TickRotations.AUTO }
      },
      left: {
        mapsTo: 'value',
        scaleType: ScaleTypes.LINEAR,
        title: config.yAxisTitle,
        ticks: { values: [] }
      }
    },
    includeZero: false,
    width: '100%',
    height: '100%',
    color: { gradient: { enabled: true }, scale: { [config.id]: themeColor } },
    points: { enabled: false },
    legend: { enabled: false },
    toolbar: { enabled: false },
    grid: { x: { enabled: false }, y: { enabled: false } },
    theme: isDark ? 'g90' : 'g10',
    resizable: true
  });

  const safeData = $derived(data ?? []);
  const title = $derived(
    typeof config.title === 'function'
      ? config.title(safeData?.[0])
      : `${config.title}: ${safeData?.[0]?.value ?? 'N/A'}`
  );
</script>

<main>
  <div class="w-full h-32 lg:h-32 2xl:h-64">
    <h2 class="text font-bold">{title}</h2>
    <AreaChart data={safeData} options={chartOptions} />
  </div>
</main>
