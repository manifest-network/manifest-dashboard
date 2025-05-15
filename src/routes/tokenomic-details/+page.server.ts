import type {PageServerLoad} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";

export const load: PageServerLoad = loadAggregateMetric(configs.map(config => config.id));
