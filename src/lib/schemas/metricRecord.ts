import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {BigNumber} from "bignumber.js";
import {NETWORK, LAUNCH_DATE} from '$env/static/private';
import {METRIC_OFFSETS} from "$lib/utils/metricOffsets";

const launchTime = new Date(LAUNCH_DATE).getTime()

// A metric record as returned by the API when querying all metrics
export const AllMetricRecordSchema = z.object({
  table_name: z.string(),
  timestamp: z.iso.datetime({offset: true}),
  tags: z.object({ supply: bigNumberLike }).partial().default({}),
  value: bigNumberLike,
})
// An array of metric records as returned by the API when querying all metrics
export const AllMetricRecordArraySchema = z.array(AllMetricRecordSchema)

// A metric record as returned by the API when querying a specific metric
export const MetricRecordSchema = z.object({
  timestamp: z.iso.datetime({offset: true}),
  tags: z.object({ supply: bigNumberLike }).partial().default({}),
  value: bigNumberLike,
})

export function makePreprocessedMetricRecordSchema(metricKey: string) {
  return z.preprocess((raw) => {
    const parsed = MetricRecordSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid metric record for key "${metricKey}": ${parsed.error.message}`);
    }

    const rec = parsed.data;
    const ts = new Date(rec.timestamp).getTime();

    let baseValue: string;
    if (NETWORK === "mainnet" && ts < launchTime) {
      baseValue = bigNumberLike.parse("0");
    } else if (metricKey === "manifest_tokenomics_total_supply") {
      baseValue = bigNumberLike.parse(rec.tags.supply ?? "0");
    } else {
      baseValue = bigNumberLike.parse(rec.value);
    }

    // 1b) If there’s an offset for this metric AND ts ≥ launchTime, subtract it:
    const offsetBn = METRIC_OFFSETS[metricKey];
    if (offsetBn !== undefined && ts >= launchTime) {
      const diff = new BigNumber(baseValue).minus(new BigNumber(offsetBn));
      baseValue = diff.isNegative() ? "0" : diff.toString();
    }

    const adjusted = baseValue.toString();
    if (metricKey === "manifest_tokenomics_total_supply") {
      return {
        timestamp: rec.timestamp,
        tags: { ...rec.tags, supply: adjusted },
        value: adjusted,
      };
    } else {
      return {
        timestamp: rec.timestamp,
        tags: rec.tags,
        value: adjusted,
      };
    }
  }, MetricRecordSchema);
}
