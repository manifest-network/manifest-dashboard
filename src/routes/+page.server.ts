import type {PageServerLoad} from "./$types";
import {NETWORK} from '$env/static/private';
import {BetaChainMetricsByKeySchema} from "$lib/schemas/betaChainMetrics";
import {CommonMetricsByKeySchema} from "$lib/schemas/commonMetrics";
import {CumsumMetricsByKeySchema} from "$lib/schemas/cumsumMetrics";
import {GeoRecordArraySchema} from "$lib/schemas/geo";
import {TokenomicMetricsByKeySchema} from "$lib/schemas/tokenomicMetrics";
import type {ZodType} from "zod/v4";

async function fetchAndParse<T>(
  f: typeof fetch,
  url: string,
  schema: ZodType<T, any>
): Promise<T> {
  return f(url).then(r => r.json()).then(data => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.error(`Failed to parse ${url}:`, parsed.error);
      throw new Error(`Failed to parse data from ${url}`);
    }
    return parsed.data;
  })
}

export const load: PageServerLoad = async ({fetch}) => {
  const network = NETWORK as NetworkType;

  return {
    // latestMetric: fetchAndParse(fetch, '/rpc/get_all_latest_common_metrics', CommonMetricsByKeySchema),
    latestMetric: fetchAndParse(fetch, `/api/slow`, CommonMetricsByKeySchema),
    latestChainMetric: fetchAndParse(fetch, `/rpc/get_all_latest_${network}_metrics`, BetaChainMetricsByKeySchema),
    // latestCumsumMetric: fetchAndParse(fetch, '/rpc/get_all_latest_cumsum_metrics', CumsumMetricsByKeySchema),
    latestCumsumMetric: fetchAndParse(fetch, '/api/average', CumsumMetricsByKeySchema),
    latestTokenMetric: fetchAndParse(fetch, `/rpc/get_all_latest_token_metrics?p_schema=${network}`, TokenomicMetricsByKeySchema),
    // worldMap: fetchAndParse(fetch, '/rpc/get_latest_geo_coordinates', GeoRecordArraySchema),
    worldMap: fetchAndParse(fetch, '/api/fast', GeoRecordArraySchema),
  };
};
