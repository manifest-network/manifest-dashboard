import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {LAUNCH_DATE, NETWORK} from "$env/static/private";
import {BigNumber} from "bignumber.js";
import memoize from "lodash/memoize";
import {METRIC_OFFSETS} from "$lib/config/offsets";
import {METRIC_MODIFIERS} from "$lib/config/modifiers";

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

export type MetricRecord = z.infer<typeof MetricRecordSchema>;

function buildSingleValueSchema(metricKey: string) {
  return z
    .array(makePreprocessedMetricRecordSchema(metricKey))
    .transform((arr) => (arr.length !== 1 ? "N/A" : arr[0].value));
}

export const makeSingleMetricValueSchema = memoize(buildSingleValueSchema);

function buildSchemaForMetric(metricKey: string) {
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
    const modifier = METRIC_MODIFIERS[metricKey];
    const hasModifier = modifier !== undefined;

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

    // Adjust the value by applying the modifier if:
    // - has a modifier
    if (hasModifier) {
      baseValueBN = modifier(baseValueBN);
    }

    const adjusted = baseValueBN.toString();

    return { timestamp, value: adjusted };
  }, MetricRecordSchema);

}

// All metric preprocessing happens here. Includes adjustments for
// - Mainnet offsets and launch date
// - Special cases where the value is stored in the tags object
export const makePreprocessedMetricRecordSchema = memoize(buildSchemaForMetric)
