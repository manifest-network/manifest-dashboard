import type {PageServerLoad} from "./$types";
import {configs} from "./config";
import {loadAggregateChainMetric} from "$lib/loaders/loadAggregateChainMetric";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";

// export const load: PageServerLoad = loadAggregateChainMetric("testnet", configs.map(config => config.id));

export const load: PageServerLoad = async (event) => {
  const { chain, common } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'chain') acc.chain.push(id)
      else acc.common.push(id)
      return acc
    },
    { chain: [] as string[], common: [] as string[] }
  )

  const [chainMetric, commonMetric] = await Promise.all([
    loadAggregateChainMetric("testnet", chain)(event),
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
