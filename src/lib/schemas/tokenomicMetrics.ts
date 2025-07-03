import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {AllMetricRecordArraySchema, makePreprocessedMetricRecordSchema} from "$lib/schemas/metricRecord";

export const TokenomicMetricSchema = z.object({
  circulating_supply: bigNumberLike.default("0"),
  burned_supply: bigNumberLike.default("0"),
  fdv: bigNumberLike.default("0"),
  market_cap: bigNumberLike.default("0"),
})
export const PartialTokenomicMetricSchema = TokenomicMetricSchema.partial();
export type PartialTokenomicMetric = z.infer<typeof PartialTokenomicMetricSchema>;

export type TokenomicMetricKey = keyof z.infer<typeof TokenomicMetricSchema>;

export const TokenomicMetricsByKeySchema = AllMetricRecordArraySchema.transform(
  (arr) => TokenomicMetricSchema.parse(
    arr.reduce((acc, raw) => {
      const key = raw.table_name as TokenomicMetricKey;
      const parsed = makePreprocessedMetricRecordSchema(key).parse(raw);
      acc[key] = parsed.value;
      return acc
    }, {} as PartialTokenomicMetric)
  ));
