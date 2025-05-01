type ChartCategory = 'disk' | 'network' | 'minio' | 'kube' | 'gpu' | 'blockchain';
type TimeScale = '10 seconds' | '1 minute' | '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year';
type TimeSpan = '1 minute' | '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year'

interface ChartConfig {
  id: string;
  title: string;
  yAxisTitle: string;
  category?: ChartCategory;
}

interface MetricRecord {
  timestamp: string;
  chart: string;
  dimension: string;
  value: number;
  family: string;
  instance: string;
}

interface ChartDataPoint {
  group: string;
  key: string;
  value: number;
  date: Date;
}
