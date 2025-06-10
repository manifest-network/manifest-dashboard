import {createSingleLoader} from "./createDataLoader";
import {SingleMetricValueSchema} from "$lib/schemas/metricRecord";

export function loadLatestSupplyMetric(network: NetworkType, id: string) {
  return createSingleLoader(
    () => `/api/latest_${network}_${id}`,
    SingleMetricValueSchema
  );
}
