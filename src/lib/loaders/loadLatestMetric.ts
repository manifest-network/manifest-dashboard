import {type MetricKey, type PartialMetrics, PartialMetricsSchema} from "$lib/schemas";
import type {RequestEvent} from "@sveltejs/kit";

export function loadLatestMetric(metrics: MetricKey[]) {
  return async ({fetch}: RequestEvent) => {
    const params = new URLSearchParams({
      metric_names: `{${metrics.map(m => `"${m}"`).join(", ")}}`
    });
    const apiUrl = `/rpc/get_latest_values_from?${params.toString()}`;

    let data: PartialMetrics = PartialMetricsSchema.parse({});
    try {
      const raw = await fetch(apiUrl);
      if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
      const res = await raw.json();
      const parsed = PartialMetricsSchema.safeParse(res);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      return {data: parsed.data}
    } catch (e) {
      console.error(`Error fetching data:`, e);
      return {data}
    }
  };
}
