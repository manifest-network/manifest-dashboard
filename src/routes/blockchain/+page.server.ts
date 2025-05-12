import { loadAggregateMetric } from "$lib/loaders/loadAggregateMetric";
import {configs} from "./config";

export const load = loadAggregateMetric(configs);
