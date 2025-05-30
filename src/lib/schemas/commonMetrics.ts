import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {AllMetricRecordArraySchema} from "$lib/schemas/metricRecord";

// Metrics common to the entire Manifest network.
export const CommonMetricSchema = z.object({
  node_count: bigNumberLike.default("0"),
  system_cpu_cores: bigNumberLike.default("0"),
  system_memory: bigNumberLike.default("0"),
  system_memory_used: bigNumberLike.default("0"),
  disk_space_total: bigNumberLike.default("0"),
  disk_space_used: bigNumberLike.default("0"),
  gpu_total: bigNumberLike.default("0"),
  gpu_memory: bigNumberLike.default("0"),
  gpu_nvidia_total: bigNumberLike.default("0"),
  gpu_nvidia_memory: bigNumberLike.default("0"),
  gpu_amd_total: bigNumberLike.default("0"),
  gpu_amd_memory: bigNumberLike.default("0"),
  web_sites: bigNumberLike.default("0"),
  web_servers: bigNumberLike.default("0"),
  web_requests_per_sec: bigNumberLike.default("0"),
  kube_pods: bigNumberLike.default("0"),
  kube_memory: bigNumberLike.default("0"),
  kube_nodes: bigNumberLike.default("0"),
  minio_buckets: bigNumberLike.default("0"),
  minio_total: bigNumberLike.default("0"),
  minio_used: bigNumberLike.default("0"),
  total_process: bigNumberLike.default("0"),
  talib_mfx_power_conversion: bigNumberLike.default("1"),
});

// Partial version of the CommonMetricSchema, useful for cases where not all metrics are available.
export const PartialCommonMetricSchema = CommonMetricSchema.partial();
export type PartialCommonMetric = z.infer<typeof PartialCommonMetricSchema>;

// A key of the CommonMetricSchema, used to index into the metrics.
export type CommonMetricKey = keyof z.infer<typeof CommonMetricSchema>;

// A record representing a metric, with a specific key and value
// This is used to transform the array of metric records into key-value pairs.
export const CommonMetricsByKeySchema = AllMetricRecordArraySchema.transform(
  (arr) =>
    arr.reduce((acc, {table_name, value}) => {
      acc[table_name as CommonMetricKey] = value
      return acc
    }, {} as PartialCommonMetric)
)
