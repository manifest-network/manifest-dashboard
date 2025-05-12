import {formatBinaryUnit} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'node_count',
    title: 'Total Number of Nodes',
    yAxisTitle: 'Number of Nodes',
    category: 'dn'
  },
  {
    id: 'system_cpu_cores',
    title: 'Total Number of CPU Cores',
    yAxisTitle: 'Number of CPU Cores',
    category: 'dn'
  },
  {
    id: 'system_memory',
    title: (latest) => `Total Memory: ${latest ? formatBinaryUnit(latest.value, "MiB") : "N/A"}`,
    yAxisTitle: 'Memory (GiB)',
    category: 'dn'
  },
  {
    id: 'disk_space_total',
    title: (latest) => `Total Disk Space: ${latest ? formatBinaryUnit(latest.value, "GiB") : "N/A"}`,
    yAxisTitle: 'Disk Space (GiB)',
    category: 'dn'
  }
]
