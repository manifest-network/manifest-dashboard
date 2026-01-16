import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {buildStreamingTasks} from "$lib/loaders/createStreamingLoader";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";

export const load: PageServerLoad = async (event) => {
  event.depends('data:decentralized-website-details');

  const charts = buildStreamingTasks(event, configs, (config) => {
    if (config.type === "cumsum") return loadCumsumMetric(config.id);
    return loadAggregateMetric(config.id, config.type);
  });

  return {charts};
};
