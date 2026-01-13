import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {buildStreamingTasks, createStreamingLoader} from "$lib/loaders/createStreamingLoader";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";

export const load: PageServerLoad = async (event) => {
  const charts = buildStreamingTasks(event, configs, (config) =>
    loadAggregateMetric(config.id, config.type)
  );

  // Stream worldMap data separately
  const worldMap = createStreamingLoader(loadWorldMapData())(event);

  return {charts, worldMap};
};
