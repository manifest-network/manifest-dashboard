import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateMetrics} from "$lib/loaders/loaders";

export const load: PageServerLoad = async ({fetch, url}) => {
  return loadAggregateMetrics(fetch, url, configs)
};
