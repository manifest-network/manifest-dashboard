import {z} from "zod/v4";
import {bigNumberLike} from "$lib/schemas/common";
import {NETWORK} from "$env/static/private";
import {BigNumber} from "bignumber.js";
import {memoize} from "lodash-es";
import {METRIC_OFFSETS} from "$lib/config/offsets";
import {METRIC_MODIFIERS} from "$lib/config/modifiers";
import {getLaunchTime} from "$lib/server/launchTime";

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

    // On Mainnet, offset metrics are launch-anchored: pre-launch reads 0, post-launch
    // has the offset subtracted (clamped >= 0). getLaunchTime() is resolved lazily here
    // (request time) and only when it actually matters, so it never runs during the
    // build's analyse pass (see $lib/server/launchTime).
    if (isMainnet && hasOffset) {
      const launchTime = getLaunchTime();
      if (ts < launchTime) {
        baseValueBN = new BigNumber(0);
      } else {
        baseValueBN = baseValueBN.minus(offset);
        if (baseValueBN.isNegative()) {
          baseValueBN = new BigNumber(0);
        }
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
