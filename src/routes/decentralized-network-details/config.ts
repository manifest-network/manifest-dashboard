import {formatBinaryUnit, formatLargeNumber, formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'node_count',
    title: (latest) => `Total Number of Nodes: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Nodes',
    category: 'dn'
  },
  {
    id: 'system_cpu_cores',
    title: (latest) => `Total Number of CPU Cores: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of CPU Cores',
    category: 'dn'
  },
  {
    id: 'total_process',
    title: (latest) => `Total Processes: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Processes',
    category: 'dn'
  },
  {
    id: 'system_memory',
    title: (latest) => `Total Memory: ${latest ? formatBinaryUnit(latest.value, "MB") : "N/A"}`,
    yAxisTitle: 'Memory (MiB)',
    category: 'dn'
  },
  {
    id: 'system_memory_used',
    title: (latest) => `Total Used Memory: ${latest ? formatBinaryUnit(latest.value, "MB") : "N/A"}`,
    yAxisTitle: 'Memory (MiB)',
    category: 'dn'
  },
  {
    id: 'disk_space_total',
    title: (latest) => `Total Disk Space: ${latest ? formatBinaryUnit(latest.value, "GB") : "N/A"}`,
    yAxisTitle: 'Disk Space (GiB)',
    category: 'dn'
  },
  {
    id: 'disk_space_used',
    title: (latest) => `Used Disk Space: ${latest ? formatBinaryUnit(latest.value, "GB") : "N/A"}`,
    yAxisTitle: 'Disk Space (GiB)',
    category: 'dn'
  },
]
