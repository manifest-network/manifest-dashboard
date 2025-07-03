import {error, type RequestEvent} from "@sveltejs/kit";
import {extractAndPrepareTimeParams} from "$lib/loaders/aggregateUtils";
import {type ChartDataPoint, ChartDataPointArraySchema} from "$lib/schemas/charts";
import type {ZodType} from "zod/v4";
import {formatId} from "$lib/utils/format";

export function createDataLoader(
  id: string,
  basePath: string,
  baseParams: URLSearchParams,
) {
  return async ({fetch, url}: RequestEvent) => {
    const timeParams = extractAndPrepareTimeParams(url);
    if (!timeParams) error(500, `Invalid API parameters`);

    const params = new URLSearchParams(baseParams);
    for (const [key, value] of timeParams) {
      if (params.has(key)) {
        console.warn(`Overriding existing parameter "${key}" with new value "${value}"`);
      }
      params.set(key, value);
    }
    const apiUrl = `${basePath}?${params.toString()}`
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API request failed: ${res.status}`);
      const raw = await res.json();
      const parsed = ChartDataPointArraySchema(id).safeParse(raw);
      if (!parsed.success) throw new Error(`Invalid response format`);
      return {data: parsed.data as ChartDataPoint[]};
    } catch (e) {
      console.error(`Error fetching ${id}:`, e);
      error(500, `Error fetching data for "${formatId(id)}"`);
    }
  };
}

export function createSingleLoader<T>(
  baseUrl: string,
  schema: ZodType<T, any>
) {
  return async ({fetch}: RequestEvent) => {
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error(`API request failed: ${res.status}`);
      const raw = await res.json();
      const parsed = schema.safeParse(raw);
      if (!parsed.success) throw new Error(`Invalid response format: ${parsed.error}`);
      return {data: parsed.data};
    } catch (e) {
      console.error(`Error fetching data:`, e);
      error(500, `Error fetching metrics data`);
    }
  };
}
