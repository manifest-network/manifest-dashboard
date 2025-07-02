import {createDataLoader} from "./createDataLoader";
import {NETWORK} from "$env/static/private";

export function loadAggregateSupplyMetric(id: string) {
  return createDataLoader(id,`/rpc/get_agg_${id}`, new URLSearchParams({
    p_schema: NETWORK as NetworkType,
  }));
}
