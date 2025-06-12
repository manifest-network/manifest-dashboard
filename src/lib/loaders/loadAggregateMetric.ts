import {createDataLoader} from "./createDataLoader";

export function loadAggregateMetric(id: string) {
  return createDataLoader(id, (params) => `/rpc/get_common_agg_${id}?${params.toString()}`);
}
