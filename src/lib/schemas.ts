import {z} from 'zod';
import {BigNumber} from "bignumber.js";

// Accepts bigint, number, or BigNumber and converts to a string
const bigNumberLike = z.union([
  z.bigint(),
  z.number(),
  z.instanceof(BigNumber)
]).transform((v) => BigNumber(v).toFixed());

// Schema for dashboard metrics
export const MetricsSchema = z.object({
  manifest_tokenomics_total_supply: bigNumberLike.default(0),
  manifest_tokenomics_token_count: bigNumberLike.default(0),
  node_count: bigNumberLike.default(0),
  system_cpu_cores: bigNumberLike.default(0),
  system_memory: bigNumberLike.default(0),
  disk_space_total: bigNumberLike.default(0),
  gpu_total: bigNumberLike.default(0),
  web_sites: bigNumberLike.default(0),
  kube_pods: bigNumberLike.default(0),
  kube_nodes: bigNumberLike.default(0),
  minio_buckets: bigNumberLike.default(0),
  minio_total: bigNumberLike.default(0),
  // total_mfx_burned_mainnet: bigNumberLike,
  // total_mfx_minted_mainnet: bigNumberLike,
  // total_tx_count_mainnet: bigNumberLike,
  // total_unique_user_mainnet: bigNumberLike,
  // total_unique_group_mainnet: bigNumberLike,
  total_mfx_burned_testnet: bigNumberLike.default(0),
  total_mfx_minted_testnet: bigNumberLike.default(0),
  total_tx_count_testnet: bigNumberLike.default(0),
  total_unique_user_testnet: bigNumberLike.default(0),
  total_unique_group_testnet: bigNumberLike.default(0),
})
export const PartialMetricsSchema = MetricsSchema.partial();

export type Metrics = z.infer<typeof MetricsSchema>;
export type PartialMetrics = z.infer<typeof PartialMetricsSchema>;
export type MetricKey = keyof z.infer<typeof MetricsSchema>;
