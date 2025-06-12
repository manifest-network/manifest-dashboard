import {createSingleLoader} from "./createDataLoader";
import {SingleMetricValueSchema} from "$lib/schemas/metricRecord";

export function loadLatestSupplyMetric(network: NetworkType, id: string) {
  return createSingleLoader(
    () => `/rpc/get_latest_${network}_${id}`,
    SingleMetricValueSchema
  );
}
