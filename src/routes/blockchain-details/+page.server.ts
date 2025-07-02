import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";

export const load: PageServerLoad = async (event) => {
  const metricTasks = configs.reduce((acc, { id, type }) => {
    acc[`aggregateMetric_${id}`] = loadAggregateMetric(id, type);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, metricTasks)
};
