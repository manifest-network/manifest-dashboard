import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import { NETWORK } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
  const network = NETWORK as NetworkType

  const { chain, common } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'chain') acc.chain.push(id)
      else acc.common.push(id)
      return acc
    },
    { chain: [] as string[], common: [] as string[] }
  )

  const [chainMetric, commonMetric] = await Promise.all([
    loadAggregateChainMetric(network, chain)(event),
    loadAggregateMetric(common)(event)
  ]);

  const chainData = chainMetric.data;
  const commonData = commonMetric.data;
  let ai = 0, ci = 0;
  const data = configs.map(({ type }) =>
    type === 'chain' ? chainData[ci++] : commonData[ai++]
  );


  return { data };
};
