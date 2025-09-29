import type {PageServerLoad} from "./$types";
import {loadAggregateMetrics} from "$lib/loaders/loaders";
import {configs} from "./config";

export const load: PageServerLoad = async ({fetch, url}) => {
  return loadAggregateMetrics(fetch, url, configs)
};
