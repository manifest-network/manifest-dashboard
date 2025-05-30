import {z} from "zod/v4";
import {MetricRecordArraySchema} from "$lib/schemas/metricRecord";
import {bigNumberLike} from "$lib/schemas/common";

// A single data point for internal charts, representing a metric at a specific time
export const ChartDataPointSchema = z.object({
  group: z.string(),
  key: z.string(),
  value: bigNumberLike,
  date: z.date(),
})

export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;

// Factory for a schema that transforms a `MetricRecord[]` (from the API) to a `ChartDataPoint[]` (for internal charts).
export const ChartDataPointArraySchema = (group: string) =>
  MetricRecordArraySchema.transform((arr) =>
    arr.map((r) => {
      const date = new Date(r.timestamp);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return ChartDataPointSchema.parse({
        group,
        key: date.toLocaleString(),
        value: r?.tags?.supply ? r.tags.supply : r.value, // Use supply tag if available, otherwise use value. Workaround for total supply metric.
        date: new Date(r.timestamp),
      });
    })
  );
