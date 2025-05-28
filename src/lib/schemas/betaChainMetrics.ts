import {AllMetricRecordArraySchema} from "$lib/schemas/metricRecord";
import {z} from "zod";
import {bigNumberLike} from "$lib/schemas/common";

// Metrics common to the Manifest Ledger testnet and mainnet.
export const BetaChainMetricSchema = z.object({
  total_mfx_burned: bigNumberLike.default("0"),
  total_mfx_minted: bigNumberLike.default("0"),
  total_tx_count: bigNumberLike.default("0"),
  total_unique_user: bigNumberLike.default("0"),
  total_unique_group: bigNumberLike.default("0"),
  blockchain_height: bigNumberLike.default("0"),
  manifest_tokenomics_total_supply: bigNumberLike.default("0"),
  manifest_tokenomics_token_count: bigNumberLike.default("0"),
})
export type PartialBetaChainMetric = z.infer<typeof BetaChainMetricSchema>;
export type BetaChainMetricKey = keyof z.infer<typeof BetaChainMetricSchema>;
export const BetaChainMetricsByKeySchema = AllMetricRecordArraySchema.transform(
  (arr) =>
    arr.reduce((acc, {table_name, tags, value}) => {
      const key = table_name as BetaChainMetricKey;
      // Handle the special case for manifest_tokenomics_total_supply
      // The actual value is stored in the tags object under 'supply', not in the value field.
      acc[key] = key === "manifest_tokenomics_total_supply" ? tags?.supply ?? bigNumberLike.parse("0") : value
      return acc
    }, {} as PartialBetaChainMetric)
);