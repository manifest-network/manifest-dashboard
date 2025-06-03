import {createSingleLoader} from "./createDataLoader";
import {BetaChainMetricsByKeySchema} from "$lib/schemas/betaChainMetrics";

export function loadLatestChainMetric(network: NetworkType) {
  return createSingleLoader(
    () => `/rpc/get_all_latest_${network}_metrics`,
    BetaChainMetricsByKeySchema
  );
}
