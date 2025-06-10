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
  value: bigNumberLike,
})
// An array of metric records as returned by the API when querying all metrics
export const AllMetricRecordArraySchema = z.array(AllMetricRecordSchema)

// A metric record as returned by the API when querying a specific metric
export const MetricRecordSchema = z.object({
  timestamp: z.iso.datetime({offset: true}),
  value: bigNumberLike,
})

export const MetricRecordArraySchema = z.array(MetricRecordSchema)

export const SingleMetricValueSchema = MetricRecordArraySchema.transform(
  (arr) => {
    if (arr.length !== 1) {
      throw new Error(`Expected array of length 1, got ${arr.length}`)
    }
    return arr[0].value
  }
)

// All metric preprocessing happens here. Includes adjustments for
// - Mainnet offsets and launch date
// - Special cases where the value is stored in the tags object
export function makePreprocessedMetricRecordSchema(metricKey: string) {
  return z.preprocess((raw) => {
    const parsed = MetricRecordSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid metric record for key "${metricKey}": ${parsed.error.message}`);
    }

    const { timestamp, value } = parsed.data;
    const ts = new Date(timestamp).getTime();

    const isMainnet = NETWORK === "mainnet";
    const offset = METRIC_OFFSETS[metricKey];
    const hasOffset = offset !== undefined;

    let baseValueBN = new BigNumber(value)

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

    return { timestamp, value: adjusted };
  }, MetricRecordSchema);
}
