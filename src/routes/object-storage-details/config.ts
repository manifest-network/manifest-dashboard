import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'minio_total',
    title: (latest) => `Total Objects: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Objects',
    category: 'minio',
    type: "common",
    tooltipValueFormatter: (value: string) => formatLargeNumber(value),
    yAxisFormatter: (value: string) => formatLargeNumber(value, 0),
  },
  {
    id: 'minio_buckets',
    title: 'Total Buckets',
    yAxisTitle: '# of Buckets',
    category: 'minio',
    type: "common"
  },
  {
    id: 'minio_used',
    title: (latest) => `Used Storage: ${latest ? formatBinaryUnit(latest.value, "B") : "N/A"}`,
    yAxisTitle: 'Storage',
    category: 'minio',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "B"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "B", 0),
  },
]
