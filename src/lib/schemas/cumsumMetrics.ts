import {z} from "zod";
import {bigNumberLike} from "$lib/schemas/common";
import {AllMetricRecordArraySchema} from "$lib/schemas/metricRecord";

export const CumsumMetricSchema = z.object({
  web_requests: bigNumberLike.default("0"),
  system_tcp_sent: bigNumberLike.default("0"),
  system_tcp_received: bigNumberLike.default("0"),
  system_network_sent: bigNumberLike.default("0"),
  system_network_received: bigNumberLike.default("0"),
  decentralized_web_requests: bigNumberLike.default("0"),
})
export const PartialCumsumMetricSchema = CumsumMetricSchema.partial();
export type PartialCumsumMetric = z.infer<typeof PartialCumsumMetricSchema>;

export type CumsumMetricKey = keyof z.infer<typeof CumsumMetricSchema>;

export const CumsumMetricsByKeySchema = AllMetricRecordArraySchema.transform(
  (arr) =>
    arr.reduce((acc, {table_name, value}) => {
      acc[table_name as CumsumMetricKey] = value
      return acc
    }, {} as PartialCumsumMetric)
)