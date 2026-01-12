import {createDataLoader} from "./createDataLoader";
import {network} from "$lib/config/network";

export function loadAggregateMetric(id: string, type: ChartType) {
  return createDataLoader(id,'/rpc/get_agg_metric', new URLSearchParams({
    p_metric_name: id,
    p_schema: type === "chain" ? network : type,
  }));
}
