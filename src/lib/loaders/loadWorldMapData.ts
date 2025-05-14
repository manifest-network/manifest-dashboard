import {type GeoRecord, GeoRecordArraySchema} from "$lib/schemas";
import {error, type RequestEvent} from "@sveltejs/kit";

export function loadWorldMapData() {
  return async ({ fetch }: RequestEvent) => {
    const apiUrl = `/rpc/get_latest_geo_coordinates`;

    try {
      const raw = await fetch(apiUrl);
      if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
      const res = await raw.json();
      const parsed = GeoRecordArraySchema.safeParse(res);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      const geoData: GeoRecord[] = parsed.data;
      return { geo: geoData };
    } catch (e) {
      console.error(`Error fetching data:`, e);
      throw error(500, `Error fetching world map data`);
    }
  }
}
