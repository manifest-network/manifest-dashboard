import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import { NETWORK } from '$env/static/private';

export const load: PageServerLoad = loadAggregateChainMetric(NETWORK as NetworkType, configs.map(config => config.id));
