import {configs} from './config'
import { loadAggregateMetric } from "$lib/loaders/loadAggregateMetric";
import { loadWorldMapData } from "$lib/loaders/loadWorldMapData";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const metricIds = configs.map(config => config.id);
  	const [aggregateMetric, worldMap] = await Promise.all([
		loadAggregateMetric(metricIds)(event),
		loadWorldMapData()(event)
	]);

  return {
    aggregateMetric,
    worldMap
  };
};
