import {NETWORK} from "$env/static/private";
import {extractAndPrepareTimeParams} from "$lib/loaders/aggregateUtils";
import {ChartDataPointArraySchema} from "$lib/schemas/charts";
import {GeoRecordArraySchema} from "$lib/schemas/geo";

export function loadWorldMap(f: typeof fetch) {
  return f('/rpc/get_latest_geo_coordinates')
    .then(res => res.json())
    .then(data => {
      const parsed = GeoRecordArraySchema.safeParse(data);
      if (!parsed.success) {
        console.error('Failed to parse geo data:', parsed.error);
        throw new Error('Failed to parse geo data');
      }
      return parsed.data;
    });
}

export function loadAggregateMetrics(f: typeof fetch, url: URL, configs: ChartConfig[]) {
  const network = NETWORK as NetworkType;
  const timeParams = extractAndPrepareTimeParams(url)
  if (!timeParams) throw new Error(`Invalid API parameters`);

  const params = new URLSearchParams();
  for (const [key, value] of timeParams) {
    if (params.has(key)) {
      console.warn(`Overriding existing parameter "${key}" with new value "${value}"`);
    }
    params.set(key, value);
  }

  return Object.fromEntries(
    configs.map(v => {
      let apiUrl = '';
      switch (v.type) {
        case "chain":
        case "common":
          apiUrl = '/rpc/get_agg_metric';
          params.set('p_metric_name', v.id);
          break;
        case "cumsum":
          apiUrl = '/rpc/get_agg_cumsum_metric';
          params.set('p_metric_name', v.id);
          break;
        case "supply":
          apiUrl = `/rpc/get_agg_${v.id}`;
          break;
        default:
          throw new Error(`Unsupported metric type: ${v.type}`);
      }

      params.set('p_schema', v.type === "chain" || v.type === "supply" ? network : v.type);
      const promise = f(`${apiUrl}?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
          const parsed = ChartDataPointArraySchema(v.id).safeParse(data);
          if (!parsed.success) {
            console.error('Failed to parse data:', parsed.error);
            throw new Error('Failed to parse data');
          }
          return parsed.data;
        });
      return [v.id, promise];
    })
  )
}