import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import { NETWORK } from '$env/static/private';
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const metricTasks = configs.reduce((acc, { id }) => {
    acc[`aggregateMetric_${id}`] = loadAggregateChainMetric(NETWORK as NetworkType, id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, {...metricTasks})
};
