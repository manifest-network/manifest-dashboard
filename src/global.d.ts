type NetworkType = 'mainnet' | 'testnet';
type ChartCategory = 'network' | 'minio' | 'kube' | 'blockchain' | 'dn' | 'gc' | 'tokenomic' | 'ai' | 'web';
type ChartTitle = string | ((latest?: ChartDataPoint) => string);
type TimeScale = '10 seconds' | '1 minute' | '1 hour' | '5 hours' | '12 hours' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year';
type TimeSpan = '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year';
type ChartType = 'common' | 'chain' | 'cumsum' | 'supply' | 'static';
type RateUnit = 'per_5min' | 'per_15min' | 'per_hour' | 'per_day' | 'per_week' | 'per_month';

interface ChartConfig {
  id: string;
  title: ChartTitle;
  yAxisTitle: string;
  category: ChartCategory;
  type: ChartType;
  staticValue?: number;
  tooltipValueFormatter?: (value: string) => string;
  yAxisFormatter?: (value: string) => string;
}

interface RateChartConfig extends ChartConfig {
  sourceMetricId: string;
  unitSuffix: string;
  insertAfter: string;
}

interface ChartResult<T = unknown> {
  data: T | null;
  error: string | null;
}

