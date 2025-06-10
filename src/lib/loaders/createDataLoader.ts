import {error, type RequestEvent} from "@sveltejs/kit";
import {extractAndPrepareApiParams} from "$lib/loaders/aggregateUtils";
import {type ChartDataPoint, ChartDataPointArraySchema} from "$lib/schemas/charts";
import type {ZodType} from "zod/v4";

export function createDataLoader(
  ids: string[],
  buildUrl: (id: string, params: URLSearchParams) => string
) {
  return async ({fetch, url}: RequestEvent) => {
    const baseParams = extractAndPrepareApiParams(url);
    if (!baseParams) error(500, `Invalid API parameters`);

    const data = await Promise.all(
      ids.map(async (id) => {
        const params = new URLSearchParams(baseParams);
        const apiUrl = buildUrl(id, params);
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) {
            console.error(`Failed to fetch ${id}: ${res.status}`);
            throw new Error(`API request failed: ${res.status}`);
          }
          const raw = await res.json();
          const parsed = ChartDataPointArraySchema(id).safeParse(raw);
          if (!parsed.success) {
            console.error(`Invalid format ${id}:`, parsed.error);
            throw new Error(`Invalid response format`);
          }
          return parsed.data as ChartDataPoint[];
        } catch (e) {
          console.error(`Error fetching ${id}:`, e);
          error(500, `Error fetching data for ${id}`);
        }
      })
    );

    return {ids, data};
  };
}

export function createSingleLoader<T>(
  buildUrl: () => string,
  schema: ZodType<T, any>
) {
  return async ({fetch}: RequestEvent) => {
    try {
      const res = await fetch(buildUrl());
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