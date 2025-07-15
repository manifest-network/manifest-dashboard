import {z} from "zod/v4";

// A record representing a geographical location as returned by the API
const GeoRecordSchema = z.object({
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  country_name: z.string().nullish(),
  city: z.string().nullish(),
}).transform(
  (item) => {
    if (item.city === null || item.country_name === null || item.latitude === null || item.longitude === null) {
      console.warn("Excluding record with null field:", item);
      return null;
    }

    return item
  }
);
// An array of geographical records, used for the world map
export const GeoRecordArraySchema = z.array(GeoRecordSchema);
export type GeoRecordArray = z.infer<typeof GeoRecordArraySchema>;
export type GeoRecord = z.infer<typeof GeoRecordSchema>;
