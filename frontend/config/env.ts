// Server configuration; never import from client components.
const configuredBackend = process.env.BACKEND_URL?.trim() || 'http://127.0.0.1:4000';
// Railway domains are often copied without a scheme. Public domains use HTTPS;
// private HTTP endpoints can still be configured with an explicit http:// URL.
const backendAddress = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackend)
  ? configuredBackend
  : `https://${configuredBackend}`;
let backendUrl: URL;
try {
  backendUrl = new URL(backendAddress);
} catch {
  throw new Error('Invalid BACKEND_URL: use the backend HTTP(S) origin, for example https://your-backend.up.railway.app');
}
if (!['http:', 'https:'].includes(backendUrl.protocol) || backendUrl.username || backendUrl.password)
  throw new Error('Invalid BACKEND_URL: use the backend HTTP(S) origin without credentials');
export const env = Object.freeze({ BACKEND_URL: backendUrl.origin });
