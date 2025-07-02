import type {PageServerLoad} from "./$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import {loadLatestTokenomicMetric} from "$lib/loaders/loadLatestTokenomicMetrics";
import {NETWORK} from '$env/static/private';
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType;
    return runTasks(event, {
    latestMetric: loadLatestMetric(),
    latestChainMetric: loadLatestChainMetric(network),
    latestCumsumMetric: loadLatestCumsumMetric(),
    latestTokenMetric: loadLatestTokenomicMetric(network),
    worldMap: loadWorldMapData()
  });
};
