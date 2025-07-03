import {GeoRecordArraySchema} from "$lib/schemas/geo";
import {createSingleLoader} from "$lib/loaders/createDataLoader";

export function loadWorldMapData() {
  return createSingleLoader('/rpc/get_latest_geo_coordinates', GeoRecordArraySchema);
}
