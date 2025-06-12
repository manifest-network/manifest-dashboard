import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const tasks = configs.reduce((acc, {id, type}) => {
    if (type === 'common') acc[`aggregateMetric_${id}`] = loadAggregateMetric(id)
    else if (type === 'cumsum') acc[`cumsumMetric_${id}`] = loadCumsumMetric(id)
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, tasks);
};
