import {configs} from './config'
import {loadAggregateMetrics, loadWorldMap} from "$lib/loaders/loaders";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({fetch, url}) => {
  return {
    world: loadWorldMap(fetch),
    metrics: loadAggregateMetrics(fetch, url, configs),
  }
};
