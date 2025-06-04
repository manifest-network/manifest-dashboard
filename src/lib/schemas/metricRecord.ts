import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {LAUNCH_DATE, NETWORK} from "$env/static/private";
import {METRIC_OFFSETS} from "$lib/utils/metricOffsets";
import {BigNumber} from "bignumber.js";

const launchTime = new Date(LAUNCH_DATE).getTime();

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

    const { timestamp, tags, value } = parsed.data;
    const ts = new Date(timestamp).getTime();

    const isMainnet = NETWORK === "mainnet";
    const offset = METRIC_OFFSETS[metricKey];
    const hasOffset = offset !== undefined;

    let baseValueBN: BigNumber;

    // If the metric is "manifest_tokenomics_total_supply", use the supply tag
    // This is a special case where the value is stored in the tags object.
    if (metricKey === "manifest_tokenomics_total_supply") {
      baseValueBN = new BigNumber(tags.supply ?? "0");
    } else {
      baseValueBN = new BigNumber(value);
    }

    // Set the value to 0 if the metric is
    // - on Mainnet
    // - before the launch time and
    // - has an offset
    if (isMainnet && ts < launchTime && hasOffset) {
      baseValueBN = new BigNumber(0);
    }

    // Adjust the value by subtracting the offset if:
    // - on Mainnet
    // - after the launch time and
    // - has an offset
    if (isMainnet && ts >= launchTime && hasOffset) {
      baseValueBN = baseValueBN.minus(offset);
      if (baseValueBN.isNegative()) {
        baseValueBN = new BigNumber(0);
      }
    }

    const adjusted = baseValueBN.toString();

    if (metricKey === "manifest_tokenomics_total_supply") {
      tags.supply = adjusted;
    }

    return { timestamp, tags, value: adjusted };
  }, MetricRecordSchema);
}
