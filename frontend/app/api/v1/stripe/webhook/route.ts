import { env } from '../../../../../config/env';

// The published Railway URL is the frontend. Preserve signed bytes when
// forwarding this public destination to the backend's Stripe-only handler.
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return Response.json({ message: 'Missing Stripe signature' }, { status: 400 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ message: 'Missing webhook body' }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024 * 1024) {
        await reader.cancel();
        return Response.json({ message: 'Webhook body too large' }, { status: 413 });
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    const response = await fetch(`${env.BACKEND_URL}/api/v1/stripe/webhook`, {
      method: 'POST', body,
      headers: { 'Content-Type': 'application/json', 'Stripe-Signature': signature },
      cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(45000),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ message: 'Webhook backend unavailable; retry delivery' }, { status: 503 });
  }
}
