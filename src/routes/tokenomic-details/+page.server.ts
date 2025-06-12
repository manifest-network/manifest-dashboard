import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {NETWORK} from '$env/static/private';
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType

  const tasks = configs.reduce((acc, {id, type}) => {
    if (type === 'common') acc[`aggregateMetric_${id}`] = loadAggregateMetric(id)
    else if (type === 'chain') acc[`aggregateChainMetric_${id}`] = loadAggregateChainMetric(network, id)
    else if (type === 'supply') acc[`aggregateSupplyMetric_${id}`] = loadAggregateSupplyMetric(network, id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);


  return runTasks(event, tasks);
};
