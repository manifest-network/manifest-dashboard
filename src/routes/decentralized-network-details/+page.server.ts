import {configs} from './config'
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const metricTasks = configs.reduce((acc, { id }) => {
    acc[`aggregateMetric_${id}`] = loadAggregateMetric(id);
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);

  return runTasks(event, {
    ...metricTasks,
    worldMap: loadWorldMapData()
  });
};
