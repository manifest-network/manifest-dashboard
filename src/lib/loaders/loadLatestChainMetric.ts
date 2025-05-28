import {error, type RequestEvent} from "@sveltejs/kit";
import {BetaChainMetricsByKeySchema} from "$lib/schemas/betaChainMetrics";

export function loadLatestChainMetric(network: NetworkType) {
  return async ({fetch}: RequestEvent) => {
    const apiUrl = `/rpc/get_all_latest_${network}_metrics`;

    try {
      const raw = await fetch(apiUrl);
      if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
      const res = await raw.json();
      const parsed = BetaChainMetricsByKeySchema.safeParse(res);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      return {data: parsed.data}
    } catch (e) {
      console.error(`Error fetching data:`, e);
      error(500, `Error fetching metrics data`);
    }
  };
}
