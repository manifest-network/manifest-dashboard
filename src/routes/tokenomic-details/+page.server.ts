import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import { NETWORK } from '$env/static/private';
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";
import type {PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType

  const { chain, common, supply } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'chain') acc.chain.push(id)
      else if (type === 'common') acc.common.push(id)
      else if (type === 'supply') acc.supply.push(id)
      else throw new Error(`Unknown type: ${type} for id: ${id}`)
      return acc
    },
    { chain: [] as string[], common: [] as string[], supply: [] as string[] }
  )
  const metricTasks = common.reduce((acc, id ) => {
    acc[`aggregateMetric_${id}`] = loadAggregateMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  const chainTasks = chain.reduce((acc, id ) => {
    acc[`aggregateChainMetric_${id}`] = loadAggregateChainMetric(network, id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  const supplyTasks = supply.reduce((acc, id ) => {
    acc[`aggregateSupplyMetric_${id}`] = loadAggregateSupplyMetric(network, id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);


  return runTasks(event, {
    ...metricTasks,
    ...chainTasks,
    ...supplyTasks
  });
};
