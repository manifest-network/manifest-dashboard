import {formatLargeNumber} from "$lib/utils/format";

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
]
