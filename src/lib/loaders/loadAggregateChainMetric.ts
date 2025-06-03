import {createDataLoader} from "./createDataLoader";

export function loadAggregateChainMetric(network: NetworkType, ids: string[]) {
  return createDataLoader(ids, (id, params) =>
    `/rpc/get_${network}_agg_${id}?${params.toString()}`
  );
}
