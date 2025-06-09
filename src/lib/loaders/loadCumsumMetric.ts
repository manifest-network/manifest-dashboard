import {createDataLoader} from "./createDataLoader";

export function loadCumsumMetric(ids: string[]) {
  return createDataLoader(ids, (id, params) =>
    `/rpc/get_cumsum_agg_${id}?${params.toString()}`
  );
}
