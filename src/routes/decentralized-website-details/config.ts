import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'web_sites',
    title: 'Total Websites',
    yAxisTitle: '# of Websites',
    category: 'gc'
  },
  {
    id: 'decentralized_web_requests',
    title: (latest) => `Total Web Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Web Requests',
    category: 'gc',
    type: "cumsum"
  }
]
