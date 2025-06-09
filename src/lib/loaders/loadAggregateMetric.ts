import {createDataLoader} from "./createDataLoader";

export function loadAggregateMetric(ids: string[]) {
  return createDataLoader(ids, (id, params) => `/rpc/get_common_agg_${id}?${params.toString()}`);
}
