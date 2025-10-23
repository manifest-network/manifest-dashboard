import {configs} from './config'
import {loadAggregateMetrics, loadWorldMap} from "$lib/loaders/loaders";
import type {PageServerLoad} from "./$types";
import {fetchAndParse} from "$lib/utils/fetchAndParse";
import {ChartDataPointArraySchema} from "$lib/schemas/charts";

export const load: PageServerLoad = async ({fetch, url}) => {
  return {
    world: loadWorldMap(fetch),
    metrics: loadAggregateMetrics(fetch, url, configs),
  }
};
