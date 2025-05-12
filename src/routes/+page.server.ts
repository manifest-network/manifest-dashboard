import {type MetricKey, MetricsSchema} from "$lib/schemas";
import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/decentralized-network-details/$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";

export const load: PageServerLoad = async (event) => {
  const metricKeys = Object.keys(MetricsSchema.shape) as MetricKey[];
  const [latestMetric, worldMap] = await Promise.all([
    loadLatestMetric(metricKeys)(event),
    loadWorldMapData()(event)
  ]);

  return {
    latestMetric,
    worldMap
  };
};
