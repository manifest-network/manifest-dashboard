import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/decentralized-network-details/$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import { NETWORK } from '$env/static/private';
import { loadLatestSupplyMetric } from "$lib/loaders/loadLatestSupplyMetrics";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType;

  const [latestMetric, latestChainMetric, latestCumsumMetric, latestCirculatingSupplyMetric, worldMap] = await Promise.all([
    loadLatestMetric()(event),
    loadLatestChainMetric(network)(event),
    loadLatestCumsumMetric()(event),
    loadLatestSupplyMetric(network, "circulating_supply")(event),
    loadWorldMapData()(event),
  ]);

  return {
    latestMetric: latestMetric.data,
    latestChainMetric: latestChainMetric.data,
    latestCumsumMetric: latestCumsumMetric.data,
    latestCirculatingSupplyMetric: latestCirculatingSupplyMetric.data,
    worldMap: worldMap.data,
  };
};
