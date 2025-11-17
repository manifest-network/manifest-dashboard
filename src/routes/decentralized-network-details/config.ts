import {formatBinaryUnit, formatLargeNumber, formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'node_count',
    title: (latest) => `Total Nodes: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Nodes',
    category: 'dn',
    type: "common"
  },
  {
    id: 'system_cpu_cores',
    title: (latest) => `Total CPU Cores: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of CPU Cores',
    category: 'dn',
    type: "common"
  },
  {
    id: 'total_process',
    title: (latest) => `Total Processes: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Processes',
    category: 'dn',
    type: "common",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  },
  {
    id: 'system_memory',
    title: (latest) => `Total Memory: ${latest ? formatBinaryUnit(latest.value, "MB") : "N/A"}`,
    yAxisTitle: 'Memory',
    category: 'dn',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "MB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "MB", 0),
  },
  {
    id: 'system_memory_used',
    title: (latest) => `Used Memory: ${latest ? formatBinaryUnit(latest.value, "MB") : "N/A"}`,
    yAxisTitle: 'Memory',
    category: 'dn',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "MB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "MB", 0),

  },
  {
    id: 'disk_space_total',
    title: (latest) => `Total Disk Space: ${latest ? formatBinaryUnit(latest.value, "GB") : "N/A"}`,
    yAxisTitle: 'Disk Space',
    category: 'dn',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "GB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "GB", 0),
  },
  {
    id: 'disk_space_used',
    title: (latest) => `Used Disk Space: ${latest ? formatBinaryUnit(latest.value, "GB") : "N/A"}`,
    yAxisTitle: 'Disk Space',
    category: 'dn',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "GB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "GB", 0),
  },
]
