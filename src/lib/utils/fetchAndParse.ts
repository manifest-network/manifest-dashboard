import type {ZodType} from "zod";

export async function fetchAndParse<T>(
  f: typeof fetch,
  url: string,
  schema: ZodType<T, any>
): Promise<T> {
  return f(url).then(r => r.json()).then(data => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.error(`Failed to parse ${url}:`, parsed.error);
      throw new Error(`Failed to parse data from ${url}`);
    }
    return parsed.data;
  })
}