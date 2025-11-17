import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'web_sites',
    title: 'Total Websites',
    yAxisTitle: '# of Websites',
    category: 'gc',
    type: "common"
  },
  {
    id: 'decentralized_web_requests',
    title: (latest) => `Total Web Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Web Requests',
    category: 'gc',
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  }
]
