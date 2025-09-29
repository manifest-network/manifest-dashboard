import type {PageServerLoad} from "./$types";
import {NETWORK} from '$env/static/private';
import {BetaChainMetricsByKeySchema} from "$lib/schemas/betaChainMetrics";
import {CommonMetricsByKeySchema} from "$lib/schemas/commonMetrics";
import {CumsumMetricsByKeySchema} from "$lib/schemas/cumsumMetrics";
import {GeoRecordArraySchema} from "$lib/schemas/geo";
import {TokenomicMetricsByKeySchema} from "$lib/schemas/tokenomicMetrics";

export const load: PageServerLoad = async ({fetch}) => {
  const network = NETWORK as NetworkType;
    return {
    latestMetric: fetch('/rpc/get_all_latest_common_metrics')
      .then(r => r.json())
      .then(data => {
        const parsed = CommonMetricsByKeySchema.safeParse(data);
        if (!parsed.success) {
          console.error('Failed to parse data:', parsed.error);
          throw new Error('Failed to parse data');
        }
        return parsed.data;
      }),
    latestChainMetric: fetch(`/rpc/get_all_latest_${network}_metrics`)
      .then(r => r.json())
      .then(data => {
        const parsed = BetaChainMetricsByKeySchema.safeParse(data);
        if (!parsed.success) {
          console.error('Failed to parse data:', parsed.error);
          throw new Error('Failed to parse data');
        }
        return parsed.data;
      }),
    latestCumsumMetric: fetch(`/rpc/get_all_latest_cumsum_metrics`)
      .then(r => r.json())
      .then(data => {
        const parsed = CumsumMetricsByKeySchema.safeParse(data);
        if (!parsed.success) {
          console.error('Failed to parse data:', parsed.error);
          throw new Error('Failed to parse data');
        }
        return parsed.data;
      }),
    latestTokenMetric: fetch(`/rpc/get_all_latest_token_metrics?p_schema=${network}`)
      .then(r => r.json())
      .then(data => {
        const parsed = TokenomicMetricsByKeySchema.safeParse(data);
        if (!parsed.success) {
          console.error('Failed to parse data:', parsed.error);
          throw new Error('Failed to parse data');
        }
        return parsed.data;
      }),
    worldMap: fetch('/rpc/get_latest_geo_coordinates')
      .then(r => r.json())
      .then(data => {
        const parsed = GeoRecordArraySchema.safeParse(data);
        if (!parsed.success) {
          console.error('Failed to parse data:', parsed.error);
          throw new Error('Failed to parse data');
        }
        return parsed.data;
      })
  }
}
