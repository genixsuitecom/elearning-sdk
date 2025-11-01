# eLearning API v1 – TypeScript SDK

Install
```bash
npm i @genixsuitecom/elearning-sdk
```

Usage
```ts
import { ElearningApiClient } from './index'

// Option A: static bearer token (e.g., client_credentials or SSO access token)
const client = new ElearningApiClient({
  baseUrl: 'https://app.genixsuite.com',
  token: process.env.GENIXSUITE_API_TOKEN!,
  verbose: true,
})

// Option B: async token resolver (rotate/refresh as needed)
// const client = new ElearningApiClient({
//   baseUrl: 'https://app.genixsuite.com',
//   token: async () => {
//     return process.env.GENIXSUITE_API_TOKEN
//   },
// })

// Step 1: presign upload
const upload = await client.createUpload({ filename: 'doc.pdf', mimeType: 'application/pdf', sizeBytes: 1024, sha256: '...' }, 'idem-123')

// Step 2: register source
await client.registerSource({ sourceId: upload.sourceId, filename: 'doc.pdf', mimeType: 'application/pdf', sizeBytes: 1024, sha256: '...' }, 'idem-123')

// Single-POST orchestration (creates subject and starts export job)
const job = await client.processSubject({ subject: { title: 'Safety Training' }, outputs: ['pptx', 'pdf'] }, 'idem-456')

// Export from existing subject (supports all output types: pptx, pdf, jira, confluence, image, video)
const exportJob = await client.createExport({
  subjectId: '550e8400-e29b-41d4-a716-446655440000',
  outputs: ['pptx', 'pdf', 'jira'],
  options: { includeImages: true }
})

// Poll job status
const status = await client.getJob(exportJob.jobId)

// List artifacts when job completes
const artifacts = await client.listJobArtifacts(exportJob.jobId)

// Download artifact
const link = await client.getArtifact(artifacts.items[0].id)
```

OAuth quickstart

Client Credentials grant (server-to-server):
```ts
import fetch from 'node-fetch'

async function getClientCredentialsToken() {
  const url = 'https://app.genixsuite.com/api/oauth2/token'
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'jobs:read',
    client_id: process.env.GENIXSUITE_CLIENT_ID!,
    client_secret: process.env.GENIXSUITE_CLIENT_SECRET!,
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`token error: ${res.status}`)
  const json = await res.json() as { access_token: string }
  return json.access_token
}

const token = await getClientCredentialsToken()
const client = new ElearningApiClient({ baseUrl: 'https://app.genixsuite.com', token })
```

Refresh Token grant:
```ts
import fetch from 'node-fetch'

async function refreshAccessToken(refreshToken: string) {
  const url = 'https://app.genixsuite.com/api/oauth2/token'
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`refresh error: ${res.status}`)
  return res.json() as Promise<{ access_token: string; refresh_token?: string }>
}
```

Environment and settings

- base URL: `https://app.genixsuite.com` (production)
- issuer: `https://app.genixsuite.com`
- audience: `elearning-api`
- token endpoint: `https://app.genixsuite.com/api/oauth2/token`
- access tokens are short-lived; use refresh or client credentials for server jobs

Note: The domain `learn.genixsuite.com` may be used for specific partner integrations or staging environments. Use `app.genixsuite.com` for standard API access.

Notes

- All methods return typed results; no `any` types are used in public APIs.
- Enable `verbose: true` to get debug logs with sensitive fields redacted.