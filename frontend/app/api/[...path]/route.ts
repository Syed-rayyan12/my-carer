import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { env } from '@/config/env';
import { accountContextHeader, accountContextPattern, selectedSessionCookie, contextualSessionCookie } from '@/config/session-context';
const allowed = /^(platform(?:\/[a-z0-9-]+)*|auth\/(signup|login|me|logout|password)|care-seekers\/me|admin\/registrations(?:\/[a-f0-9-]{36}\/status)?)$/;
async function boundedBody(request: NextRequest, maxBytes = 16384) {
  const reader = request.body?.getReader();
  if (!reader) return undefined;
  let size = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new Error('REQUEST_TOO_LARGE'); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(buffer);
}
async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const path = (await context.params).path.join('/');
  if (!allowed.test(path)) return Response.json({ status: 'error', message: 'Not found' }, { status: 404 });
  const accountContext = request.headers.get(accountContextHeader);
  if (accountContext !== null && !accountContextPattern.test(accountContext))
    return Response.json({ status: 'error', message: 'Invalid account context' }, { status: 400 });
  const headers = new Headers();
  for (const key of ['cookie', 'content-type', 'origin', 'x-csrf-token', 'x-session-activity', 'sec-fetch-site', 'if-none-match']) {
    const value = request.headers.get(key); if (value) headers.set(key, value);
  }
  if (accountContext) {
    headers.delete('cookie');
    const cookie = selectedSessionCookie(request.headers.get('cookie') ?? '', accountContext);
    if (cookie) headers.set('cookie', cookie);
  }
  try {
    const blogImage = /^platform\/blog\/[a-z0-9-]{1,100}\/image$/.test(path);
    const fileRequest = blogImage || /^platform\/(uploads|profile-photos)\/[a-f0-9-]{36}$/.test(path);
    const result = await fetch(`${env.BACKEND_URL}/api/v1/${path}${request.nextUrl.search}`, { method: request.method, headers, body: ['GET', 'HEAD'].includes(request.method) ? undefined : await boundedBody(request, path === 'platform/uploads' ? 15 * 1024 * 1024 : path === 'platform/admin/blog' ? 4 * 1024 * 1024 : path === 'platform/professional' || path === 'platform/profile' ? 64 * 1024 : 16384), cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const outgoing = new Headers({ 'Content-Type': result.headers.get('content-type') ?? 'application/json', 'Cache-Control': 'no-store, private' });
    if (blogImage && (result.ok || result.status === 304)) outgoing.set('Cache-Control', result.headers.get('cache-control') ?? 'public, max-age=3600');
    if (blogImage && result.headers.has('etag')) outgoing.set('ETag', result.headers.get('etag')!);
    if (result.ok && ['POST', 'DELETE', 'PATCH'].includes(request.method) && /^platform\/admin\/blog(?:\/[a-z0-9-]+)?$/.test(path)) revalidateTag('public-blog', { expire: 0 });
    if (fileRequest) for (const key of ['content-disposition', 'content-security-policy', 'x-content-type-options']) { const value = result.headers.get(key); if (value) outgoing.set(key, value); }
    for (const cookie of result.headers.getSetCookie()) outgoing.append('Set-Cookie', accountContext ? contextualSessionCookie(cookie, accountContext) : cookie);
    for (const key of ['retry-after', 'ratelimit', 'ratelimit-policy', 'x-request-id']) { const value = result.headers.get(key); if (value) outgoing.set(key, value); }
    if (result.status === 304) return new Response(null, { status: 304, headers: outgoing });
    return new Response(fileRequest ? await result.arrayBuffer() : await result.text(), { status: result.status, headers: outgoing });
  } catch (error) {
    if (error instanceof Error && error.message === 'REQUEST_TOO_LARGE') return Response.json({ status: 'error', message: 'Request body too large' }, { status: 413 });
    return Response.json({ status: 'error', message: 'The account service is unavailable. Please try again.' }, { status: 503 });
  }
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
