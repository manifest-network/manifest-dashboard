import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const { aggregate, cumsum } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'cumsum') acc.cumsum.push(id)
      else acc.aggregate.push(id)
      return acc
    },
    { aggregate: [] as string[], cumsum: [] as string[] }
  )

  const metricTasks = aggregate.reduce((acc, id ) => {
    acc[`aggregateMetric_${id}`] = loadAggregateMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  const cumsumTasks = cumsum.reduce((acc, id) => {
    acc[`cumsumMetric_${id}`] = loadCumsumMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, {
    ...metricTasks,
    ...cumsumTasks
  });
};
