import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: "system_network_received",
    title: (latest) => `Network Bandwidth Received: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Received",
    category: "network",
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "KB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "KB", 0),
  },
  {
    id: "system_network_sent",
    title: (latest) => `Network Bandwidth Sent: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Sent",
    category: "network",
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "KB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "KB", 0),
  },
  {
    id: "system_tcp_sent",
    title: (latest) => `IPv4 Packets Sent: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "Packets Sent",
    category: "network",
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  },
  {
    id: "system_tcp_received",
    title: (latest) => `IPv4 Packets Received: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "Packets Received",
    category: "network",
    type: "cumsum",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  }
]
