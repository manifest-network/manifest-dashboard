import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: "system_network_received",
    title: (latest) => `Network Bandwidth Received: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Received (KB)",
    category: "network",
    type: "cumsum"
  },
  {
    id: "system_network_sent",
    title: (latest) => `Network Bandwidth Sent: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Sent (KB)",
    category: "network",
    type: "cumsum"
  },
  {
    id: "system_tcp_sent",
    title: (latest) => `IPv4 Packets Sent: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "Packets Sent",
    category: "network",
    type: "cumsum"
  },
  {
    id: "system_tcp_received",
    title: (latest) => `IPv4 Packets Received: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "Packets Received",
    category: "network",
    type: "cumsum"
  }
]
