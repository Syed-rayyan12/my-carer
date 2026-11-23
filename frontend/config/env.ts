// Server configuration; never import from client components.
const backendUrl = new URL(process.env.BACKEND_URL ?? 'http://127.0.0.1:4000');
if (!['http:', 'https:'].includes(backendUrl.protocol) || backendUrl.username || backendUrl.password) throw new Error('Invalid BACKEND_URL');
export const env = Object.freeze({ BACKEND_URL: backendUrl.origin });
