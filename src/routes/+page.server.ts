import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/decentralized-network-details/$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";

export const load: PageServerLoad = async (event) => {
  const [latestMetric, latestChainMetric, worldMap] = await Promise.all([
    loadLatestMetric()(event),
    loadLatestChainMetric("testnet")(event),
    loadWorldMapData()(event),
  ]);

  return {
    latestMetric: latestMetric.data,
    latestChainMetric: latestChainMetric.data,
    worldMap: worldMap.data,
  };
};
