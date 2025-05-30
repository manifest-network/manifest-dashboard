import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";

// A metric record as returned by the API when querying all metrics
export const AllMetricRecordSchema = z.object({
  table_name: z.string(),
  timestamp: z.string().refine((s) => !isNaN(Date.parse(s)), {message: 'Invalid timestamp'}),
  tags: z.object({ supply: bigNumberLike }).partial().default({}),
  value: bigNumberLike,
})
// An array of metric records as returned by the API when querying all metrics
export const AllMetricRecordArraySchema = z.array(AllMetricRecordSchema)

// A metric record as returned by the API when querying a specific metric
export const MetricRecordSchema = z.object({
  timestamp: z.string().refine((s) => !isNaN(Date.parse(s)), {message: 'Invalid timestamp'}),
  tags: z.object({ supply: bigNumberLike }).partial().default({}),
  value: bigNumberLike,
})
// An array of metric records as returned by the API when querying a specific metric
export const MetricRecordArraySchema = z.array(MetricRecordSchema)
