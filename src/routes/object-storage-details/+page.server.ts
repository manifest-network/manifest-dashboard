import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {buildStreamingTasks} from "$lib/loaders/createStreamingLoader";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";

export const load: PageServerLoad = async (event) => {
  event.depends('data:object-storage-details');

  const charts = buildStreamingTasks(event, configs, (config) =>
    loadAggregateMetric(config.id, config.type)
  );

  return {charts};
};
