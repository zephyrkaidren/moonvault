export function extractErrorMessages(body: unknown): string[] {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body
  ) {
    const msg = (body as { message: unknown }).message;
    if (Array.isArray(msg)) return msg.map(String);
    if (typeof msg === 'string') return [msg];
  }
  return ['Something went wrong'];
}
