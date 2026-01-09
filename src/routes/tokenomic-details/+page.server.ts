import {error} from "@sveltejs/kit";
import type {PageServerLoad, PageServerLoadEvent} from "./$types";
import {configs} from "./config";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadAggregateSupplyMetric} from "$lib/loaders/loadAggregateSupplyMetrics";
import {loadStaticMetric} from "$lib/loaders/loadStaticMetric";
import {runTasks} from "$lib/utils/runTasks";

export const load: PageServerLoad = async (event) => {
  const tasks = configs.reduce((acc, {id, type, staticValue}) => {
    if (type === 'common' || type === 'chain') acc[`aggregateMetric_${id}`] = loadAggregateMetric(id, type)
    else if (type === 'supply') acc[`aggregateSupplyMetric_${id}`] = loadAggregateSupplyMetric(id);
    else if (type === 'static') {
      if (staticValue === undefined) error(500, `Static chart "${id}" must have a staticValue`);
      acc[`aggregateMetric_${id}`] = loadStaticMetric(id, staticValue);
    }
    return acc;
  }, {} as Record<string, (e: PageServerLoadEvent) => Promise<{ data: any }>>);


  return runTasks(event, tasks);
};
