import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const metricTasks = configs.reduce((acc, { id }) => {
    acc[`aggregateMetric_${id}`] = loadAggregateMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, metricTasks)
};
