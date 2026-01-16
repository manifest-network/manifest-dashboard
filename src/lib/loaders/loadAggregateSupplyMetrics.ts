import {createDataLoader} from "./createDataLoader";
import {network} from "$lib/config/network";

export function loadAggregateSupplyMetric(id: string) {
  return createDataLoader(id,`/rpc/get_agg_${id}`, new URLSearchParams({
    p_schema: network,
  }));
}
