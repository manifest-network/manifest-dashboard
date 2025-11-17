type NetworkType = 'mainnet' | 'testnet';
type ChartCategory = 'network' | 'minio' | 'kube' | 'blockchain' | 'dn' | 'gc' | 'tokenomic' | 'ai' | 'web';
type ChartTitle = string | ((latest?: ChartDataPoint) => string);
type TimeScale = '10 seconds' | '1 minute' | '1 hour' | '5 hours' | '12 hours' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year';
type TimeSpan = '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year'
type ChartType = 'common' | 'chain' | 'cumsum' | 'supply'

interface ChartConfig {
  id: string;
  title: ChartTitle;
  yAxisTitle: string;
  category: ChartCategory;
  type: ChartType
  tooltipValueFormatter?: (value: string) => string;
  yAxisFormatter?: (value: string) => string;
}

