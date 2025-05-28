import {z} from "zod";

// A record representing a geographical location as returned by the API
const GeoRecordSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  country_name: z.string(),
  city: z.string(),
});
// An array of geographical records, used for the world map
export const GeoRecordArraySchema = z.array(GeoRecordSchema);
export type GeoRecordArray = z.infer<typeof GeoRecordArraySchema>;
export type GeoRecord = z.infer<typeof GeoRecordSchema>;