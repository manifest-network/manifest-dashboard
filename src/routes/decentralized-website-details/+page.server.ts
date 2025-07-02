import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const tasks = configs.reduce((acc, {id, type}) => {
    if (type !== 'cumsum') acc[`aggregateMetric_${id}`] = loadAggregateMetric(id, type)
    else if (type === 'cumsum') acc[`cumsumMetric_${id}`] = loadCumsumMetric(id, type)
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, tasks);
};
