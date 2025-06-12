import {createDataLoader} from "./createDataLoader";

export function loadCumsumMetric(id: string) {
  return createDataLoader(id, (params) => `/rpc/get_cumsum_agg_${id}?${params.toString()}`);
}
