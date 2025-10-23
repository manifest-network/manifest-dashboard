import type {PageServerLoad} from "./$types";
import {NETWORK} from '$env/static/private';
import {BetaChainMetricsByKeySchema} from "$lib/schemas/betaChainMetrics";
import {CommonMetricsByKeySchema} from "$lib/schemas/commonMetrics";
import {CumsumMetricsByKeySchema} from "$lib/schemas/cumsumMetrics";
import {GeoRecordArraySchema} from "$lib/schemas/geo";
import {TokenomicMetricsByKeySchema} from "$lib/schemas/tokenomicMetrics";
import {fetchAndParse} from "$lib/utils/fetchAndParse";

export const load: PageServerLoad = async ({fetch}) => {
  const network = NETWORK as NetworkType;

  return {
    latestMetric: fetchAndParse(fetch, '/rpc/get_all_latest_common_metrics', CommonMetricsByKeySchema),
    latestChainMetric: fetchAndParse(fetch, `/rpc/get_all_latest_${network}_metrics`, BetaChainMetricsByKeySchema),
    latestCumsumMetric: fetchAndParse(fetch, '/rpc/get_all_latest_cumsum_metrics', CumsumMetricsByKeySchema),
    latestTokenMetric: fetchAndParse(fetch, `/rpc/get_all_latest_token_metrics?p_schema=${network}`, TokenomicMetricsByKeySchema),
    worldMap: fetchAndParse(fetch, '/rpc/get_latest_geo_coordinates', GeoRecordArraySchema),
  };
};
