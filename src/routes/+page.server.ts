import type {PageServerLoad} from "./$types";
import {createStreamingLoader} from "$lib/loaders/createStreamingLoader";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import {loadLatestTokenomicMetric} from "$lib/loaders/loadLatestTokenomicMetrics";
import {network} from "$lib/config/network";

export const load: PageServerLoad = async (event) => {
  return {
    latestMetric: createStreamingLoader(loadLatestMetric())(event),
    latestChainMetric: createStreamingLoader(loadLatestChainMetric(network))(event),
    latestCumsumMetric: createStreamingLoader(loadLatestCumsumMetric())(event),
    latestTokenMetric: createStreamingLoader(loadLatestTokenomicMetric(network))(event),
    worldMap: createStreamingLoader(loadWorldMapData())(event),
  };
};
