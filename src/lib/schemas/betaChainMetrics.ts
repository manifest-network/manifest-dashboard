import {AllMetricRecordArraySchema, makePreprocessedMetricRecordSchema} from "$lib/schemas/metricRecord";
import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";

// Metrics common to the Manifest Ledger testnet and mainnet.
export const BetaChainMetricSchema = z.object({
  total_mfx_minted: bigNumberLike.default("0"),
  total_mfx_burned: bigNumberLike.default("0"),
  total_pwr_minted: bigNumberLike.default("0"),
  total_pwr_burned: bigNumberLike.default("0"),
  total_tx_count: bigNumberLike.default("0"),
  total_unique_user: bigNumberLike.default("0"),
  total_unique_group: bigNumberLike.default("0"),
  blockchain_height: bigNumberLike.default("0"),
  manifest_tokenomics_total_supply: bigNumberLike.default("0"),
  manifest_tokenomics_token_count: bigNumberLike.default("0"),
  locked_tokens: bigNumberLike.default("0"),
  locked_fees: bigNumberLike.default("0"),
})
export type PartialBetaChainMetric = z.infer<typeof BetaChainMetricSchema>;
export type BetaChainMetricKey = keyof z.infer<typeof BetaChainMetricSchema>;
export const BetaChainMetricsByKeySchema = AllMetricRecordArraySchema.transform(
  (arr) => BetaChainMetricSchema.parse(
    arr.reduce((acc, raw) => {
      const key = raw.table_name as BetaChainMetricKey;
      const parsed = makePreprocessedMetricRecordSchema(key).parse(raw);
      acc[key] = parsed.value;
      return acc
    }, {} as PartialBetaChainMetric)
));
