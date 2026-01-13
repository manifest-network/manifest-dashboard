import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {buildStreamingTasks} from "$lib/loaders/createStreamingLoader";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";

export const load: PageServerLoad = async (event) => {
  const charts = buildStreamingTasks(event, configs, (config) =>
    loadCumsumMetric(config.id)
  );

  return {charts};
};
