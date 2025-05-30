type NetworkType = 'mainnet' | 'testnet';
type ChartCategory = 'disk' | 'network' | 'minio' | 'kube' | 'gpu' | 'blockchain' | 'dn' | 'gc' | 'tokenomic' | 'ai' | 'web';
type ChartTitle = string | ((latest?: ChartDataPoint) => string);
type TimeScale = '10 seconds' | '1 minute' | '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year';
type TimeSpan = '1 hour' | '1 day' | '1 week' | '1 month' | '3 months' | '1 year'
type ChartType = 'common' | 'chain' | 'cumsum'

interface ChartConfig {
  id: string;
  title: ChartTitle;
  yAxisTitle: string;
  category?: ChartCategory;
  type?: ChartType
}

