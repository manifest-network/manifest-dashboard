import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const metricTasks = configs.reduce((acc, { id }) => {
    acc[`cumsumMetric_${id}`] = loadCumsumMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, metricTasks)
};
