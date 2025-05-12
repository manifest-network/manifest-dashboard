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
  manifest_tokenomics_total_supply: bigNumberLike,
  manifest_tokenomics_token_count: bigNumberLike,
  node_count: bigNumberLike,
  system_cpu_cores: bigNumberLike,
  system_memory: bigNumberLike,
  disk_space_total: bigNumberLike,
  // total_mfx_burned_mainnet: bigNumberLike,
  // total_mfx_minted_mainnet: bigNumberLike,
  // total_tx_count_mainnet: bigNumberLike,
  // total_unique_user_mainnet: bigNumberLike,
  // total_unique_group_mainnet: bigNumberLike,
  total_mfx_burned_testnet: bigNumberLike,
  total_mfx_minted_testnet: bigNumberLike,
  total_tx_count_testnet: bigNumberLike,
  total_unique_user_testnet: bigNumberLike,
  total_unique_group_testnet: bigNumberLike,
})
export const PartialMetricsSchema = MetricsSchema.partial();

export type Metrics = z.infer<typeof MetricsSchema>;
export type PartialMetrics = z.infer<typeof PartialMetricsSchema>;
export type MetricKey = keyof z.infer<typeof MetricsSchema>;
