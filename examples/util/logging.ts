export type RedactedHeaders = Record<string, string>

const SENSITIVE = new Set(['authorization', 'proxy-authorization', 'x-api-key', 'client_secret'])

export function redactHeaders(headers: Record<string, string | undefined>): RedactedHeaders {
  const out: RedactedHeaders = {}
  for (const [k, v] of Object.entries(headers)) {
    if (v == null) continue
    const key = k.toLowerCase()
    out[k] = SENSITIVE.has(key) ? '<redacted>' : v
  }
  return out
}

export function logStep(step: string): void {
  // eslint-disable-next-line no-console
  console.log(`\n== ${step} ==`)
}

export function logRequest(info: { method: string; url: string; headers?: Record<string, string | undefined> }): void {
  const h = info.headers ? redactHeaders(info.headers) : undefined
  // eslint-disable-next-line no-console
  console.log('request:', { method: info.method, url: info.url, headers: h })
}

export function logResponse(info: { status: number; headers?: Record<string, string | undefined> }): void {
  const h = info.headers ? redactHeaders(info.headers) : undefined
  // eslint-disable-next-line no-console
  console.log('response:', { status: info.status, headers: h })
}


