import {loadLatestMetric} from "$lib/utils/loadLatestMetric";
import {type MetricKey, MetricsSchema} from "$lib/schemas";

const metricKeys = Object.keys(MetricsSchema.shape) as MetricKey[];
export const load = loadLatestMetric(metricKeys)
