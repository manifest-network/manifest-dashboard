import type { HttpError } from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import {loadLatestMetric} from "$lib/loaders/loadLatestMetric";
import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {loadLatestCumsumMetric} from "$lib/loaders/loadLatestCumsumMetrics";
import {NETWORK} from '$env/static/private';
import {loadLatestSupplyMetric} from "$lib/loaders/loadLatestSupplyMetrics";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType;

  const tasks = {
    latestMetric: loadLatestMetric(),
    latestChainMetric: loadLatestChainMetric(network),
    latestCumsumMetric: loadLatestCumsumMetric(),
    latestCirculatingSupplyMetric: loadLatestSupplyMetric(network, "circulating_supply"),
    worldMap: loadWorldMapData()
  };

  const entries = await Promise.allSettled(
    Object.entries(tasks).map(([key, loader]) =>
      loader(event)
        .then(res => ({key, data: (res as any).data, error: null}))
        .catch(err => ({key, data: null, error: (err as HttpError).body.message || "Unknown error"}))
    )
  );


  const result: Record<string, any> = {};
  for (const e of entries) {
    if (e.status === "fulfilled") {
      const { key, data, error } = e.value;
      result[key] = data;
      if (error) result[`${key}Error`] = error;
    }
  }

  return result;
};
