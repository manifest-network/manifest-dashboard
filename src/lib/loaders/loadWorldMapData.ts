import {error, type RequestEvent} from "@sveltejs/kit";
import {GeoRecordArraySchema} from "$lib/schemas/geo";

export function loadWorldMapData() {
  return async ({ fetch }: RequestEvent) => {
    const apiUrl = `/rpc/get_latest_geo_coordinates`;

    try {
      const raw = await fetch(apiUrl);
      if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
      const res = await raw.json();
      const parsed = GeoRecordArraySchema.safeParse(res);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      return { data: parsed.data };
    } catch (e) {
      console.error(`Error fetching data:`, e);
      error(500, `Error fetching world map data`);
    }
  }
}
