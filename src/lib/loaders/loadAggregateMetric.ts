import {error, type RequestEvent} from "@sveltejs/kit";
import {type ChartDataPoint, ChartDataPointArraySchema} from "$lib/schemas";
import {extractAndPrepareApiParams} from "$lib/loaders/aggregateUtils";

export function loadAggregateMetric(ids: string[]) {
  return async ({fetch, url}: RequestEvent) => {
    const baseApiParams = extractAndPrepareApiParams(url);
    if (!baseApiParams) {
      error(500, `Invalid API parameters`);
    }

    const data = await Promise.all(
      ids.map(async (id) => {
        const currentParams = new URLSearchParams(baseApiParams);

        // Workaround for the total supply metric.
        // The total supply metric is too large to be store as a number in netdata.
        // We need to store it as a string in the metadata instead.
        let apiUrl
        if (id === "manifest_tokenomics_total_supply") {
          apiUrl = `/rpc/get_aggregated_total_supply?${currentParams.toString()}`;
        } else {
          currentParams.set('metric_name', id);
          apiUrl = `/rpc/get_aggregated_metrics?${currentParams.toString()}`;
        }

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
