import {configs} from './config'
import type {HttpError} from "@sveltejs/kit";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadWorldMapData} from "$lib/loaders/loadWorldMapData";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const metricTasks: Record<string, ReturnType<typeof loadAggregateMetric>> =
    configs.reduce((acc, {id}) => {
      acc[`aggregateMetric_${id}`] = loadAggregateMetric(id)
      return acc
    }, {} as Record<string, ReturnType<typeof loadAggregateMetric>>)

  const tasks = {
    ...metricTasks,
    worldMap: loadWorldMapData()
  }

  const entries = await Promise.allSettled(
    Object.entries(tasks).map(([key, loader]) =>
      loader(event)
        .then(res => ({key, data: (res as any).data, error: null}))
        .catch(err => ({key, data: null, error: (err as HttpError).body.message || "Unknown error"}))
    )
  );

  const result: Record<string, any> = {};
  for (const e of entries) {
    if (e.status === "fulfilled") {
      const {key, data, error} = e.value;
      result[key] = data;
      if (error) result[`${key}Error`] = error;
    }
  }

  return result;
};
