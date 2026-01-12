import type { HttpError } from '@sveltejs/kit';

export async function runTasks<T>(
  event: T,
  tasks: Record<string, (e: T) => Promise<{ data: any }>>
): Promise<Record<string, any>> {
  const entries = await Promise.allSettled(
    Object.entries(tasks).map(([key, loader]) =>
      loader(event)
        .then(res => ({ key, data: res.data, error: null }))
        .catch(err => ({ key, data: null, error: (err as HttpError)?.body?.message ?? 'Unknown error' }))
    )
  );

  return entries.reduce((acc, e) => {
    if (e.status === 'fulfilled') {
      const { key, data, error } = e.value;
      acc[key] = data;
      if (error) acc[`${key}Error`] = error;
    }
    return acc;
  }, {} as Record<string, any>);
}
