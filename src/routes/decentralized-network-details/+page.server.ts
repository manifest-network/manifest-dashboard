import {configs} from './config'
import {loadAggregateMetrics, loadWorldMap} from "$lib/loaders/loaders";
import type {PageServerLoad} from "./$types";
import {fetchAndParse} from "$lib/utils/fetchAndParse";
import {ChartDataPointArraySchema} from "$lib/schemas/charts";

export const load: PageServerLoad = async ({fetch, url}) => {
  return {
    world: loadWorldMap(fetch),
    metrics: loadAggregateMetrics(fetch, url, configs),
    // metrics: fetchAndParse(fetch, '/rpc/get_agg_metric?order=timestamp.desc&p_interval=12+hours&p_from=2024-10-22T19%3A55%3A22.921Z&p_to=2025-10-22T19%3A55%3A22.921Z&p_metric_name=node_count&p_schema=common', ChartDataPointArraySchema('node_count')),
  }
};
