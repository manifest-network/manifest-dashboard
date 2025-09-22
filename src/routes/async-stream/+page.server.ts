// export const load = async ({fetch}) => {
//   const res = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
//   return {data: res.json()}
// }

import {loadLatestChainMetric} from "$lib/loaders/loadLatestChainMetric";
import {NETWORK} from "$env/static/private";

const network = NETWORK as NetworkType;

export const load = async (event) => {
  return loadLatestChainMetric(network)(event).catch(() => {})
}