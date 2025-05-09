import type {PageLoad} from './$types';

export const load: PageLoad = async ({data, fetch}) => {
  // const res = await fetch(`/api/proxy-talib`);
  // const item = await res.json();
  // return {data: data, pwrMfx: item.data};
  return {data: data, pwrMfx: "3.79"}; // TODO: Don't hardcode this but use the API. Talib too slow for dev...
};