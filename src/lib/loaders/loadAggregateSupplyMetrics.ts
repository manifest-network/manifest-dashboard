import {createDataLoader} from "./createDataLoader";

export function loadAggregateSupplyMetric(network: string, ids: string[]) {
  return createDataLoader(ids, (id, params) => `/rpc/get_${network}_${id}?${params.toString()}`);
}
