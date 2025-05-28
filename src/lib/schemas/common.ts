import {z} from "zod";
import {BigNumber} from "bignumber.js";

// Runtime validation the value can be represented as a BigNumber
// Return a string representation of the number (POJO).
export const bigNumberLike = z.union([
  z.string(),
  z.bigint(),
  z.number(),
  z.instanceof(BigNumber)
]).transform((v) => BigNumber(v).toFixed());
