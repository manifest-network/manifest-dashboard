import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import { NETWORK } from '$env/static/private';
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType

  const { chain, common, supply } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'chain') acc.chain.push(id)
      else if (type === 'common') acc.common.push(id)
      else if (type === 'supply') acc.supply.push(id)
      else throw new Error(`Unknown type: ${type} for id: ${id}`)
      return acc
    },
    { chain: [] as string[], common: [] as string[], supply: [] as string[] }
  )

  const [chainMetric, commonMetric, circulatingSupply] = await Promise.all([
    loadAggregateChainMetric(network, chain)(event),
    loadAggregateMetric(common)(event),
    loadAggregateSupplyMetric(network, supply)(event)
  ]);

  const chainData = chainMetric.data;
  const commonData = commonMetric.data;
  const supplyData = circulatingSupply.data;
  let ai = 0, ci = 0, si = 0;
  const data = configs.map(({ type }) =>
    type === 'supply' ? supplyData[si++] :
      type === 'chain' ? chainData[ci++] :
        commonData[ai++]
  );


  return { data };
};
