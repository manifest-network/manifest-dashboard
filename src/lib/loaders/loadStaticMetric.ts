import {error, type RequestEvent} from "@sveltejs/kit";
import {extractAndPrepareTimeParams} from "$lib/loaders/aggregateUtils";
import type {ChartDataPoint} from "$lib/schemas/charts";

const SCALE_TO_MS: Record<TimeScale, number> = {
  "10 seconds": 10 * 1000,
  "1 minute": 60 * 1000,
  "1 hour": 60 * 60 * 1000,
  "5 hours": 5 * 60 * 60 * 1000,
  "12 hours": 12 * 60 * 60 * 1000,
  "1 day": 24 * 60 * 60 * 1000,
  "1 week": 7 * 24 * 60 * 60 * 1000,
  "1 month": 30 * 24 * 60 * 60 * 1000,
  "3 months": 90 * 24 * 60 * 60 * 1000,
  "1 year": 365 * 24 * 60 * 60 * 1000,
};

// Maximum number of data points to generate to prevent memory issues
const MAX_DATA_POINTS = 1000;

/**
 * Creates a loader that returns static chart data with a constant value.
 * Generates data points at the same intervals as API-backed charts.
 * Limits output to MAX_DATA_POINTS to prevent memory issues with large time ranges.
 */
export function loadStaticMetric(id: string, staticValue: number) {
  return async ({url}: RequestEvent) => {
    const timeParams = extractAndPrepareTimeParams(url);

    if (!timeParams) {
      error(500, "Invalid time parameters");
    }

    const p_from = timeParams.get("p_from");
    const p_to = timeParams.get("p_to");
    const p_interval = timeParams.get("p_interval") as TimeScale | null;

    if (!p_from || !p_to || !p_interval) {
      error(500, "Invalid time parameters");
    }

    const startDate = new Date(p_from);
    const endDate = new Date(p_to);
    const value = String(staticValue);
    const requestedIntervalMs = SCALE_TO_MS[p_interval];

    const start = startDate.getTime();
    const end = endDate.getTime();
    const timeRange = end - start;

    // Calculate actual interval to use - increase if needed to stay within limits
    const estimatedPoints = Math.ceil(timeRange / requestedIntervalMs);
    const intervalMs =
      estimatedPoints > MAX_DATA_POINTS
        ? Math.ceil(timeRange / MAX_DATA_POINTS)
        : requestedIntervalMs;

    const data: ChartDataPoint[] = [];
    let current = start;

    while (current <= end && data.length < MAX_DATA_POINTS) {
      const date = new Date(current);
      data.push({
        group: id,
        key: date.toISOString(),
        value,
        date,
      });
      current += intervalMs;
    }

    // Return newest first to match API behavior
    return {data: data.reverse()};
  };
}
