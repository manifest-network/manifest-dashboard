import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: "web_requests",
    title: (latest) => `Web Requests: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "Web Requests",
    category: "network"
  },
  {
    id: "system_tcp_sent",
    title: (latest) => `IPv4 Packets Sent: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "IPv4 Packets Sent",
    category: "network"
  },
  {
    id: "system_tcp_received",
    title: (latest) => `IPv4 Packets Received: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: "IPv4 Packets Received",
    category: "network"
  },
  {
    id: "system_network_sent",
    title: (latest) => `Network Bytes Sent: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Network Kilobits Sent",
    category: "network"
  },
  {
    id: "system_network_received",
    title: (latest) => `Network Bytes Received: ${latest ? formatBinaryUnit(latest.value, "KB") : "N/A"}`,
    yAxisTitle: "Network Kilobits Received",
    category: "network"
  }
]
