import type {PageServerLoad} from "./$types";
import {loadAggregateMetric} from "$lib/loaders/loadAggregateMetric";
import {loadCumsumMetric} from "$lib/loaders/loadCumsumMetric";
import {configs} from "./config";

export const load: PageServerLoad = async (event) => {
  const { aggregate, cumsum } = configs.reduce(
    (acc, { id, type }) => {
      if (type === 'cumsum') acc.cumsum.push(id)
      else acc.aggregate.push(id)
      return acc
    },
    { aggregate: [] as string[], cumsum: [] as string[] }
  )

  const [aggregateMetric, cumsumMetric] = await Promise.all([
    loadAggregateMetric(aggregate)(event),
    loadCumsumMetric(cumsum)(event)
  ]);

  const aggData = aggregateMetric.data;
  const cumData = cumsumMetric.data;
  let ai = 0, ci = 0;
  const data = configs.map(({ type }) =>
    type === 'cumsum' ? cumData[ci++] : aggData[ai++]
  );


  return { data };
};
