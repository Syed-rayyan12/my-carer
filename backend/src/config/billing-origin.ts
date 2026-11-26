import { z } from 'zod';

// Dashboard copy/paste commonly includes a trailing slash. Accept it while
// keeping return destinations restricted to a complete HTTP(S) origin.
export const billingReturnOriginSchema = z.string().trim().pipe(z.url()).refine(value => {
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password &&
    url.pathname === '/' && !url.search && !url.hash;
}, 'Use the application frontend HTTP(S) origin without a path').transform(value => new URL(value).origin);
