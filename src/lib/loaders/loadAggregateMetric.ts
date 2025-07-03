import {createDataLoader} from "./createDataLoader";
import {NETWORK} from "$env/static/private";

export function loadAggregateMetric(id: string, type: ChartType) {
  return createDataLoader(id,'/rpc/get_agg_metric', new URLSearchParams({
    p_metric_name: id,
    p_schema: type === "chain" ? NETWORK as NetworkType : type,
  }));
}
