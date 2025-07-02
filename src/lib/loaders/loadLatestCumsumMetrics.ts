import {CumsumMetricsByKeySchema} from "$lib/schemas/cumsumMetrics";
import {createSingleLoader} from "$lib/loaders/createDataLoader";

export function loadLatestCumsumMetric() {
  return createSingleLoader(`/rpc/get_all_latest_cumsum_metrics`, CumsumMetricsByKeySchema);
}
