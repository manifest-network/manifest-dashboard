import {createSingleLoader} from "$lib/loaders/createDataLoader";
import {TokenomicMetricsByKeySchema} from "$lib/schemas/tokenomicMetrics";

export function loadLatestTokenomicMetric(network: NetworkType) {
  const params = new URLSearchParams({"p_schema": network});
  return createSingleLoader(`/rpc/get_all_latest_token_metrics?${params.toString()}`, TokenomicMetricsByKeySchema);
}
