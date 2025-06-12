import {createDataLoader} from "./createDataLoader";

export function loadAggregateChainMetric(network: NetworkType, id: string) {
  return createDataLoader(id, ( params) => `/rpc/get_${network}_agg_${id}?${params.toString()}`);
}
