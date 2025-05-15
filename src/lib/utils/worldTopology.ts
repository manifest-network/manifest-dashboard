import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import worldTopoRaw from '../../assets/countries-110m.json'

type ObjectsType = Objects<Record<string, any>> // Can't use GeoJsonProperties here because it can be `null`. Use `Record<> instead.
type TopologyType = Topology<ObjectsType>

export const worldTopoJson: TopologyType = worldTopoRaw as unknown as TopologyType;
export const worldTopoJsonSimplified: TopologyType = simplify<ObjectsType>(presimplify<ObjectsType>(worldTopoJson), 0.5)

export const worldGeoJson: FeatureCollection = feature(
  worldTopoJsonSimplified,
  worldTopoJsonSimplified.objects.countries
) as FeatureCollection;

export const worldFeatures = (worldGeoJson as FeatureCollection).features;