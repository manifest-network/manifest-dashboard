import {error, type RequestEvent} from "@sveltejs/kit";
import {extractAndPrepareApiParams} from "$lib/loaders/aggregateUtils";
import {type ChartDataPoint, ChartDataPointArraySchema} from "$lib/schemas/charts";

export function loadAggregateChainMetric(network: NetworkType, ids: string[]) {
  return async ({fetch, url}: RequestEvent) => {
    const baseApiParams = extractAndPrepareApiParams(url);
    if (!baseApiParams) {
      error(500, `Invalid API parameters`);
    }

    const data = await Promise.all(
      ids.map(async (id) => {
        const currentParams = new URLSearchParams(baseApiParams);
        const apiUrl = `/rpc/get_${network}_agg_${id}?${currentParams.toString()}`;

        try {
          const res = await fetch(apiUrl);
          if (!res.ok) {
            console.error(`Failed to fetch data for ${id}: ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
          }

          const raw = await res.json();
          const parsed = ChartDataPointArraySchema(id).safeParse(raw);

          if (!parsed.success) {
            console.error(`Invalid response format for ${id}:`, parsed.error);
            throw new Error(`Invalid response format for ${id}`);
          }

          const chartData: ChartDataPoint[] = parsed.data;
          return chartData;

        } catch (e) {
          console.error(`Error fetching data for ${id}:`, e);
          error(500, `Error fetching data for ${id}`);
        }
      })
    );

    return {ids, data};
  };
}
