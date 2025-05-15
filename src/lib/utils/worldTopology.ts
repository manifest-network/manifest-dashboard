import type { Topology } from 'topojson-specification';
import type { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import worldTopoRaw from '../../assets/countries-110m.json'

export const worldTopoJson: Topology = worldTopoRaw as unknown as Topology;
export const worldTopoJsonSimplified: Topology = simplify(presimplify(worldTopoJson), 0.5)

export const worldGeoJson: FeatureCollection = feature(
  worldTopoJsonSimplified,
  worldTopoJsonSimplified.objects.countries
) as FeatureCollection;

export const worldFeatures = (worldGeoJson as FeatureCollection).features;