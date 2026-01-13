import {error} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import type {ChartDataPoint} from "$lib/schemas/charts";
import {configs, rateConfigs} from "./config";
import {buildStreamingTasks} from "$lib/loaders/createStreamingLoader";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";
import {loadStaticMetric} from "$lib/loaders/loadStaticMetric";

export const load: PageServerLoad = async (event) => {
  const charts = buildStreamingTasks(event, configs, (config) => {
    if (config.type === "common" || config.type === "chain") {
      return loadAggregateMetric(config.id, config.type);
    } else if (config.type === "supply") {
      return loadAggregateSupplyMetric(config.id);
    } else if (config.type === "static") {
      if (config.staticValue === undefined) {
        error(500, `Static chart "${config.id}" must have a staticValue`);
      }
      return loadStaticMetric(config.id, config.staticValue);
    }
    return loadAggregateMetric(config.id, config.type);
  });

  // Rate charts reuse the same promise as their source metrics (no duplicate API calls)
  const rateCharts = rateConfigs.reduce(
    (acc, config) => {
      const sourcePromise = charts[config.sourceMetricId];
      if (sourcePromise) {
        acc[config.id] = sourcePromise;
      }
      return acc;
    },
    {} as Record<string, Promise<ChartResult<ChartDataPoint[]>>>
  );

  return {charts, rateCharts};
};
