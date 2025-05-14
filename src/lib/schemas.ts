import {z} from 'zod';
import {BigNumber} from "bignumber.js";

// Runtime validation the value can be represented as a BigNumber
// Return a string representation of the number (POJO).
const bigNumberLike = z.union([
  z.string(),
  z.bigint(),
  z.number(),
  z.instanceof(BigNumber)
]).transform((v) => BigNumber(v).toFixed());

export const MetricsSchema = z.object({
  // manifest_tokenomics_total_supply: bigNumberLike.default("0"),
  manifest_tokenomics_token_count: bigNumberLike.default("0"),
  node_count: bigNumberLike.default("0"),
  system_cpu_cores: bigNumberLike.default("0"),
  system_memory: bigNumberLike.default("0"),
  disk_space_total: bigNumberLike.default("0"),
  gpu_total: bigNumberLike.default("0"),
  web_sites: bigNumberLike.default("0"),
  kube_pods: bigNumberLike.default("0"),
  kube_nodes: bigNumberLike.default("0"),
  minio_buckets: bigNumberLike.default("0"),
  minio_total: bigNumberLike.default("0"),
  // total_mfx_burned_mainnet: bigNumberLike,
  // total_mfx_minted_mainnet: bigNumberLike,
  // total_tx_count_mainnet: bigNumberLike,
  // total_unique_user_mainnet: bigNumberLike,
  // total_unique_group_mainnet: bigNumberLike,
  total_mfx_burned_testnet: bigNumberLike.default("0"),
  total_mfx_minted_testnet: bigNumberLike.default("0"),
  total_tx_count_testnet: bigNumberLike.default("0"),
  total_unique_user_testnet: bigNumberLike.default("0"),
  total_unique_group_testnet: bigNumberLike.default("0"),
})
export const PartialMetricsSchema = MetricsSchema.partial();
export type Metrics = z.infer<typeof MetricsSchema>;
export type MetricKey = keyof z.infer<typeof MetricsSchema>;
export const MetricRecordSchema = z.object({
  timestamp: z.string(),
  value: bigNumberLike,
});
export const MetricRecordArraySchema = z.array(MetricRecordSchema);

export const ChartDataPointSchema = z.object({
  group: z.string(),
  key: z.string(),
  value: bigNumberLike,
  date: z.date(),
})
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;

// Factory for a schema that transforms an array of `MetricRecord` to ChartDataPoint[]
export const ChartDataPointArraySchema = (group: string) =>
  MetricRecordArraySchema.transform((arr) =>
    arr.map((r) => {
        const date = new Date(r.timestamp);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        return ChartDataPointSchema.parse({
          group,
          key: date.toLocaleString(),
          value: r.value,
          date: new Date(r.timestamp),
        });
    })
  );

const GeoRecordSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  country_name: z.string(),
  city: z.string(),
});
export const GeoRecordArraySchema = z.array(GeoRecordSchema);
export type GeoRecordArray = z.infer<typeof GeoRecordArraySchema>;
export type GeoRecord = z.infer<typeof GeoRecordSchema>;

export const LatestTotalSupplySchema = z.string().transform((v) => BigNumber(v).toFixed());
