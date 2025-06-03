import {createDataLoader} from "./createDataLoader";

export function loadCumsumMetric(ids: string[]) {
  return createDataLoader(ids, (id, params) =>
    `/rpc/get_cumsum_${id}?${params.toString()}`
  );
}
