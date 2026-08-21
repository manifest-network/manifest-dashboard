import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'web_sites',
    title: 'Total Deployments',
    yAxisTitle: '# of Deployments',
    category: 'gc',
    type: "common"
  },
  {
    id: 'decentralized_web_requests',
    title: (latest) => `Total Deployment Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Deployment Requests',
    category: 'gc',
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  }
]
