import {z} from "zod/v4";
import {BigNumber} from "bignumber.js";

// Runtime validation the value can be represented as a BigNumber
// Return a string representation of the number (POJO).
// Rejects invalid values (NaN, Infinity) with a clear error message.
export const bigNumberLike = z
  .union([z.string(), z.bigint(), z.number(), z.instanceof(BigNumber)])
  .transform((v, ctx) => {
    const bn = BigNumber(v);
    if (bn.isNaN() || !bn.isFinite()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid numeric value: ${v}`,
      });
      return z.NEVER;
    }
    return bn.toFixed();
  });
