import type {Handle} from '@sveltejs/kit';

export const handle: Handle = async ({event, resolve}) => {
  const response = await resolve(event);

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache-Control headers for static assets
  const {pathname} = event.url;
  if (pathname.startsWith('/_app/')) {
    // SvelteKit hashed assets - safe to cache immutably for 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|svg|ico|webp)$/)) {
    // Other static assets - cache for 1 day with revalidation (not immutable since
    // files in /static are not hashed and could change between deployments)
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
  } else if (pathname.match(/\.(json)$/)) {
    // JSON files - cache for 1 hour, revalidate
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  return response;
};
