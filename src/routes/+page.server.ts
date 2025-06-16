import type {PageServerLoad} from "./$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import {NETWORK} from '$env/static/private';
import {loadLatestSupplyMetric} from "$lib/loaders/loadLatestSupplyMetrics";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType;
    return runTasks(event, {
    latestMetric: loadLatestMetric(),
    latestChainMetric: loadLatestChainMetric(network),
    latestCumsumMetric: loadLatestCumsumMetric(),
    latestCirculatingSupplyMetric: loadLatestSupplyMetric(network, 'circulating_supply'),
    latestBurnedSupplyMetric: loadLatestSupplyMetric(network, 'burned_supply'),
    latestFdv: loadLatestSupplyMetric(network, 'fdv'),
    latestMc: loadLatestSupplyMetric(network, 'market_cap'),
    worldMap: loadWorldMapData()
  });
};
