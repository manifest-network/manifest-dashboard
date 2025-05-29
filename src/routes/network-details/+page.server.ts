import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";

export const load: PageServerLoad = loadCumsumMetric(configs.map(config => config.id));
