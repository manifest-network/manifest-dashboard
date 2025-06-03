import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/decentralized-network-details/$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import { NETWORK } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType;

  const [latestMetric, latestChainMetric, latestCumsumMetric, worldMap] = await Promise.all([
    loadLatestMetric()(event),
    loadLatestChainMetric(network)(event),
    loadLatestCumsumMetric()(event),
    loadWorldMapData()(event),
  ]);

  return {
    latestMetric: latestMetric.data,
    latestChainMetric: latestChainMetric.data,
    latestCumsumMetric: latestCumsumMetric.data,
    worldMap: worldMap.data,
  };
};
