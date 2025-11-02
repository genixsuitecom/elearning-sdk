#!/usr/bin/env node
/*
  GenixSuite eLearning SDK – Doctor (environment diagnostics)
  Checks: env vars, token fetch, scopes, clock skew, connectivity, /health, optional debug.
*/

import { ElearningApiClient } from '../ElearningApiClient.js';
import type { ElearningApiClientConfig } from '../ElearningApiClient.js'
import { getEnv } from './util/utils.js'
import { OpenAPI } from '../core/OpenAPI.js'

type Json = Record<string, unknown>
const baseUrl = getEnv('GENIXSUITE_BASE')
const clientId = getEnv('GENIXSUITE_CLIENT_ID')
const clientSecret = getEnv('GENIXSUITE_CLIENT_SECRET')
const scopes = getEnv('GENIXSUITE_SCOPES', 'jobs:write jobs:read artifacts:read ingest:write curriculums:write')
const DEBUG = getEnv('DEBUG', 'false') === 'true'

function decodeJwt(token: string): { header: Json; payload: Json } | undefined {
  const parts = token.split('.')
  if (parts.length < 2) return undefined
  const b64ToStr = (b64: string) => Buffer.from(b64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
  try {
    const header = JSON.parse(b64ToStr(parts[0]!)) as Json
    const payload = JSON.parse(b64ToStr(parts[1]!)) as Json
    return { header, payload }
  } catch {
    return undefined
  }
}

async function fetchToken(baseUrl: string, clientId: string, clientSecret: string, scope: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret, scope }),
  })
  if (!res.ok) throw new Error(`Token HTTP ${res.status}`)
  const u: unknown = await res.json()
  if (typeof u === 'object' && u !== null && 'access_token' in u && typeof (u as { access_token: unknown }).access_token === 'string') {
    return (u as { access_token: string }).access_token
  }
  throw new Error('Token shape invalid')
}

async function main(): Promise<ElearningApiClient> {
  const nodeMajor = Number(process.versions.node.split('.')[0] ?? '0')
  if (!Number.isFinite(nodeMajor) || nodeMajor < 18) {
    throw new Error(`Node ${process.version} detected; Node >=18 is required (native fetch)`)
  }
  console.log('Doctor – base:', baseUrl)
  console.log('Doctor – scopes:', scopes)

  // Clock skew hint (coarse)
  const now = Math.floor(Date.now() / 1000)
  console.log('Doctor – epoch:', now)

  // Resolve token
  let token = getEnv('GENIXSUITE_API_TOKEN')
  if (!token) {
    if (!clientId || !clientSecret) throw new Error('Provide GENIXSUITE_API_TOKEN or CLIENT_ID/CLIENT_SECRET')
    token = await fetchToken(baseUrl, clientId, clientSecret, scopes)
  }
  console.log('Doctor – token acquired')

  // Decode JWT locally
  const decoded = decodeJwt(token)
  if (decoded) {
    const pl = decoded.payload
    const scopeStr = typeof pl.scope === 'string' ? pl.scope : undefined
    const exp = typeof pl.exp === 'number' ? pl.exp : undefined
    const iat = typeof pl.iat === 'number' ? pl.iat : undefined
    console.log('Doctor – token scopes:', scopeStr ?? '<unknown>')
    if (exp) {
      const secs = exp - now
      console.log('Doctor – token expires in (s):', secs)
      if (secs < 30) console.warn('Doctor – token expires imminently; renew')
    }
    if (iat) {
      const skew = Math.abs(now - iat)
      if (skew > 300) console.warn('Doctor – clock skew detected (>5m). Check system time/NTP.')
    }
  } else {
    console.warn('Doctor – could not decode JWT (non-standard issuer?)')
  }

  // Connectivity checks
  try {
    const health = await fetch(`${baseUrl}/health`)
    console.log('Doctor – /health:', health.status)
  } catch (e) {
    console.warn('Doctor – /health unreachable:', (e as Error).message)
  }

  try {
    const who = await fetch(`${baseUrl}/api/v1/_debug/whoami`, { headers: { Authorization: `Bearer ${token}` } })
    console.log('Doctor – /_debug/whoami:', who.status)
  } catch (e) {
    console.warn('Doctor – /_debug/whoami not available:', (e as Error).message)
  }

  // Proxy detection hints
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy
  const noProxy = process.env.NO_PROXY || process.env.no_proxy
  if (httpProxy || httpsProxy) {
    console.warn('Doctor – proxy environment detected (HTTP(S)_PROXY). Note: native fetch requires a custom agent to use proxies.')
    if (noProxy) console.warn('Doctor – NO_PROXY present:', noProxy)
  }

  // Prepare client config (ensures SDK wiring is valid)
  const cfg: ElearningApiClientConfig = { baseUrl: baseUrl!, token: token! as string, verbose: DEBUG }
  const client = new ElearningApiClient(cfg)
  console.log('Doctor – OpenAPI base configured:', OpenAPI.BASE)
  console.log('Doctor – OK')
  return client
}

main().catch((e: unknown) => {
  if (e instanceof Error) console.error('Doctor error:', e.message)
  process.exitCode = 1
})

