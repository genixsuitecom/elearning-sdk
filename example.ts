import { ElearningApiClient } from './ElearningApiClient.js'
import dotenv from 'dotenv'
import { setTimeout as delay } from 'node:timers/promises'

dotenv.config()

type Env = Readonly<{
    GENIXSUITE_CLIENT_ID: string
    GENIXSUITE_CLIENT_SECRET: string
    GENIXSUITE_SCOPES?: string
    GENIXSUITE_BASE_URL?: string
    GENIXSUITE_DEBUG?: '0' | '1'
    REQUEST_TIMEOUT_MS?: string
    MAX_TOKEN_RETRIES?: string
}>

const DEBUG = process.env.GENIXSUITE_DEBUG === '1'
const log = {
    info: (msg: string, meta?: Record<string, unknown>) => console.log(`[elearning-sdk] ${msg}`, meta ?? ''),
    debug: (msg: string, meta?: Record<string, unknown>) => { if (DEBUG) console.log(`[elearning-sdk:debug] ${msg}`, meta ?? '') },
    error: (msg: string, meta?: Record<string, unknown>) => console.error(`[elearning-sdk:error] ${msg}`, meta ?? '')
}

function requireNode(minMajor: number): void {
    const major = Number(process.versions.node.split('.')[0])
    if (isNaN(major) || major < minMajor) {
        throw new Error(`Node ${minMajor}+ required (for native fetch). Detected: ${process.versions.node}.`)
    }
}

function loadEnv(): { clientId: string; clientSecret: string; scopes: string; baseUrl: string; timeoutMs: number; maxRetries: number } {
    const env = process.env as Env
    const missing: string[] = []
    if (!env.GENIXSUITE_CLIENT_ID) missing.push('GENIXSUITE_CLIENT_ID')
    if (!env.GENIXSUITE_CLIENT_SECRET) missing.push('GENIXSUITE_CLIENT_SECRET')
    if (missing.length) {
        throw new Error(`Missing env: ${missing.join(', ')}. Create a .env file with:\nGENIXSUITE_CLIENT_ID=...\nGENIXSUITE_CLIENT_SECRET=...`)
    }
    const timeoutMsRaw = env.REQUEST_TIMEOUT_MS ?? '10000'
    const timeoutMs = Number(timeoutMsRaw)
    if (isNaN(timeoutMs) || timeoutMs <= 0) {
        throw new Error(`Invalid REQUEST_TIMEOUT_MS: "${timeoutMsRaw}". Must be >0 number (ms).`)
    }
    const scopes = (env.GENIXSUITE_SCOPES ?? 'jobs:read').trim()
    if (!scopes) {
        throw new Error('GENIXSUITE_SCOPES cannot be empty.')
    }
    const maxRetriesRaw = env.MAX_TOKEN_RETRIES ?? '3'
    const maxRetries = Number(maxRetriesRaw)
    if (!Number.isInteger(maxRetries) || maxRetries < 1) {
        throw new Error(`Invalid MAX_TOKEN_RETRIES: "${maxRetriesRaw}". Must be a positive integer.`)
    }
    return {
        clientId: env.GENIXSUITE_CLIENT_ID,
        clientSecret: env.GENIXSUITE_CLIENT_SECRET,
        scopes,
        baseUrl: env.GENIXSUITE_BASE_URL ?? 'https://app.genixsuite.com',
        timeoutMs,
        maxRetries,
    }
}

async function fetchWithTimeout(input: string, init: (Parameters<typeof fetch>[1] & { timeoutMs?: number }) = {}): Promise<Response> {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), init.timeoutMs ?? 10000)
    try {
        return await fetch(input, { ...init, signal: ac.signal })
    } finally {
        clearTimeout(timer)
    }
}

function explainStatus(status: number): string {
    switch (status) {
        case 400: return 'Bad request. Check client_id/client_secret and grant_type.'
        case 401: return 'Unauthorized. Credentials incorrect or not authorized.'
        case 403: return 'Forbidden. Missing required scopes.'
        case 404: return 'Endpoint not found. Check baseUrl.'
        case 429: return 'Rate limited. Retry after a delay.'
        default:
            if (status >= 500) return 'Server error. Try again later.'
            return 'Unexpected response.'
    }
}

async function getClientCredentialsToken(cfg: { baseUrl: string; clientId: string; clientSecret: string; scopes: string; timeoutMs: number; maxRetries: number }): Promise<string> {
    const url = `${cfg.baseUrl}/api/oauth2/token`
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: cfg.scopes,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
    })
    log.debug('Requesting token', { url, scopes: cfg.scopes })

    let lastErr: unknown
    const maxRetries = cfg.maxRetries
    let delayMs = 100
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
                timeoutMs: cfg.timeoutMs,
            })
            if (!res.ok) {
                const text = await res.text().catch(() => '')
                throw new Error(`Token request failed ${res.status}: ${explainStatus(res.status)}${text ? ` | ${text}` : ''}`)
            }
            const json: unknown = await res.json()
            if (!json || typeof json !== 'object' || typeof (json as { access_token?: unknown }).access_token !== 'string') {
                throw new Error('Token response malformed; expected { access_token: string }')
            }
            return (json as { access_token: string }).access_token
        } catch (e: unknown) {
            lastErr = e
            log.error(`Token attempt ${attempt}/${maxRetries} failed`, { message: e instanceof Error ? e.message : String(e) })
            if (attempt < maxRetries) {
                await delay(delayMs)
                delayMs *= 2.5
            }
        }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

async function createClient(): Promise<{ client: ElearningApiClient }> {
    requireNode(18)
    const cfg = loadEnv()
    const token = await getClientCredentialsToken({
        baseUrl: cfg.baseUrl,
        clientId: cfg.clientId,
        clientSecret: cfg.clientSecret,
        scopes: cfg.scopes,
        timeoutMs: cfg.timeoutMs,
        maxRetries: cfg.maxRetries,
    })
    return { client: new ElearningApiClient({ baseUrl: cfg.baseUrl, token, verbose: DEBUG }) }
}

export { loadEnv, createClient }
export type { Env }
export type { ElearningApiClient as ElearningApiClient }