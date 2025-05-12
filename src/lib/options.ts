import {ScaleTypes, TickRotations} from "@carbon/charts-svelte";
import {getColorFromCSS} from "$lib/utils/colors";

export function getChartOptions(config: ChartConfig, latest?: ChartDataPoint) {
  let themeColor = getColorFromCSS('--color-secondary-600-400')
    const title =
    typeof config.title === 'function'
      ? config.title(latest)
      : `${config.title}: ${latest?.value ?? "N/A"}`;

  return {
    title,
    axes: {
      bottom: {
        title: 'Timestamp',
        mapsTo: 'date',
        scaleType: ScaleTypes.TIME,
        ticks: {
          rotation: TickRotations.AUTO,
        }
      },
      left: {
        mapsTo: 'value',
        title: config.yAxisTitle,
        scaleType: ScaleTypes.LINEAR,
      }
    },
    curve: 'curveMonotoneX',
    includeZero: false,
    height: '400px',
    color: {
      gradient: {
        enabled: true
      },
      scale: {
        [config.id]: themeColor
      }
    },
    points: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    toolbar: {
      enabled: false
    },
    grid: {
      x: {
        enabled: false
      }
    },
  };
}