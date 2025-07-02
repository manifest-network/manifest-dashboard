import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {NETWORK} from '$env/static/private';
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType

  const tasks = configs.reduce((acc, {id, type}) => {
    if (type === 'common' || type === 'chain') acc[`aggregateMetric_${id}`] = loadAggregateMetric(id, type)
    else if (type === 'supply') acc[`aggregateSupplyMetric_${id}`] = loadAggregateSupplyMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);


  return runTasks(event, tasks);
};
