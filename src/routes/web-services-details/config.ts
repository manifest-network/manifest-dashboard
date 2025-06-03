import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'web_servers',
    title: 'Total Web Servers',
    yAxisTitle: '# of Web Servers',
    category: 'web',
    type: "common"
  },
  {
    id: 'web_requests_per_sec',
    title: 'Web Requests/Sec',
    yAxisTitle: 'Web Requests/Sec',
    category: 'web',
    type: "common"
  },
  {
    id: 'web_requests',
    title: (latest) => `Total Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Total Requests',
    category: 'web',
    type: "cumsum"
  }
]
