import {CommonMetricsByKeySchema} from "$lib/schemas/commonMetrics";
import {createSingleLoader} from "$lib/loaders/createDataLoader";

export function loadLatestMetric() {
  return createSingleLoader(
    () => `/rpc/get_all_latest_common_metrics`,
    CommonMetricsByKeySchema
  );
}

