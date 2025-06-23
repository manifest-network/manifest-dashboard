import {z} from "zod/v4";
import {makePreprocessedMetricRecordSchema, type MetricRecord} from "$lib/schemas/metricRecord";
import {bigNumberLike} from "$lib/schemas/common";
import memoize from "lodash/memoize";

// A single data point for internal charts, representing a metric at a specific time
export const ChartDataPointSchema = z.object({
  group: z.string(),
  key: z.string(),
  value: bigNumberLike,
  date: z.date(),
})

export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>

function preprocessPoints(group: string, arr: MetricRecord[]): ChartDataPoint[] {
  return arr.map((r) => {
    const date = new Date(r.timestamp);
    return ChartDataPointSchema.parse({
      group,
      key: date.toISOString(),
      value: r.value,
      date,
    });
  });
}

// Factory for a schema that transforms a `MetricRecord[]` (from the API) to a `ChartDataPoint[]` (for internal charts).
export const ChartDataPointArraySchema = memoize(
  (group: string) => {
    return z
      .array(makePreprocessedMetricRecordSchema(group))
      .transform((arr) => preprocessPoints(group, arr))
  }
)
