import type {RequestEvent} from "@sveltejs/kit";

export function loadWorldMapData() {
  return async ({ fetch }: RequestEvent) => {
    const geoUrl = `/rpc/get_latest_geo_coordinates`;

    const fetchData = async (url: string, resourceName: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const errorMsg = `API request for ${resourceName} (${url}) failed with status ${res.status}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        return await res.json();
      } catch (err) {
        const detailedErrorMsg = `Error fetching ${resourceName} from ${url}: ${err}`;
        console.error(detailedErrorMsg, err);
        throw new Error(detailedErrorMsg);
      }
    };

    try {
      const [geoData] = await Promise.all([
        fetchData(geoUrl, "geo coordinates"),
      ]);

      return {
        geo: geoData as GeoRecord[],
      };
    } catch (error) {
      console.error('Failed to fetch all required page data:', error);
      throw new Error(`Failed to load page data. ${error}`);
    }
  }
}