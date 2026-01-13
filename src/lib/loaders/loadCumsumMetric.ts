import {createDataLoader} from "./createDataLoader";

export function loadCumsumMetric(id: string) {
  return createDataLoader(id, "/rpc/get_agg_cumsum_metric", new URLSearchParams({
    p_metric_name: id,
    p_schema: "cumsum",
  }));
}
