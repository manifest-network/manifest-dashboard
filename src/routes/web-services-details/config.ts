import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'web_servers',
    title: 'Total RPC Endpoints',
    yAxisTitle: '# of RPC Endpoints',
    category: 'web',
    type: "common"
  },
  {
    id: 'web_requests_per_sec',
    title: 'RPC Requests/Sec',
    yAxisTitle: 'RPC Requests/Sec',
    category: 'web',
    type: "common"
  },
  {
    id: 'web_requests',
    title: (latest) => `Total Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Total Requests',
    category: 'web',
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  }
]
