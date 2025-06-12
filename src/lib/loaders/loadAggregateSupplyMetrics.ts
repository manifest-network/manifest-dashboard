import {createDataLoader} from "./createDataLoader";

export function loadAggregateSupplyMetric(network: string, id: string) {
  return createDataLoader(id, (params) => `/rpc/get_${network}_${id}?${params.toString()}`);
}
