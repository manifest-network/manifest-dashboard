import type {PageServerLoad} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";

export const load: PageServerLoad = loadAggregateMetric(configs.map(config => config.id));