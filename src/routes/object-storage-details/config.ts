import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'minio_total',
    title: (latest) => `Total Objects: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: '# of Objects',
    category: 'minio'
  },
  {
    id: 'minio_buckets',
    title: 'Total Buckets',
    yAxisTitle: '# of Buckets',
    category: 'minio'
  },
  {
    id: 'minio_used',
    title: (latest) => `Used Storage: ${latest ? formatBinaryUnit(latest.value, "B") : "N/A"}`,
    yAxisTitle: 'Storage (B)',
    category: 'minio'
  },
]
