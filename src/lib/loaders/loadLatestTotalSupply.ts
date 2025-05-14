import {LatestTotalSupplySchema} from "$lib/schemas";
import {error, type RequestEvent} from "@sveltejs/kit";

export function loadLatestTotalSupply() {
  return async ({fetch}: RequestEvent) => {
    const apiUrl = `/rpc/get_latest_total_supply`;

    try {
      const raw = await fetch(apiUrl);
      if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
      const res = await raw.json();
      const parsed = LatestTotalSupplySchema.safeParse(res);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      return {data: parsed.data}
    } catch (e) {
      console.error(`Error fetching data:`, e);
      throw error(500, `Error fetching latest total supply data`);
    }
  };
}
