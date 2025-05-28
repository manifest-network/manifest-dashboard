import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";

export const load: PageServerLoad = loadAggregateChainMetric("testnet", configs.map(config => config.id));