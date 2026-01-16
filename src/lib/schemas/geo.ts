import {z} from "zod/v4";

/**
 * Maps API country names to GeoJSON country names.
 * GeoJSON uses full formal names while APIs often use common names.
 */
const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States': 'United States of America',
};

/** Normalize country name to match GeoJSON naming conventions */
function normalizeCountryName(name: string): string {
  return COUNTRY_NAME_MAP[name] ?? name;
}

// A record representing a geographical location as returned by the API
const RawGeoRecordSchema = z.object({
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  country_name: z.string().nullish(),
  city: z.string().nullish(),
});

const StrictGeoRecordSchema = z.object({
  latitude:      z.number(),
  longitude:     z.number(),
  country_name:  z.string(),
  city:          z.string(),
});

// An array of geographical records, used for the world map
export const GeoRecordArraySchema = z
  .array(RawGeoRecordSchema)
  .transform((records) => {
    const valid: z.infer<typeof StrictGeoRecordSchema>[] = [];

    for (const record of records) {
      const result = StrictGeoRecordSchema.safeParse(record);
      if (!result.success) {
        console.warn("Excluding record with null field:", record);
      } else {
        // Normalize country name to match GeoJSON naming
        valid.push({
          ...result.data,
          country_name: normalizeCountryName(result.data.country_name),
        });
      }
    }

    return valid;
  });

export type GeoRecordArray = z.infer<typeof GeoRecordArraySchema>;
export type GeoRecord = z.infer<typeof StrictGeoRecordSchema>;
