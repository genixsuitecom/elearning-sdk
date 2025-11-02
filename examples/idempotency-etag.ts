/*
  GenixSuite eLearning SDK – Idempotency & ETag demo (TypeScript)
  - Shows idempotent POST replay behavior via SubjectsService
  - Notes ETag usage (SDK returns JSON body; ETag is observed best via curl)
*/

import { ProcessSubjectRequest } from '../models/ProcessSubjectRequest.js'
import { ElearningApiClient } from '../ElearningApiClient.js'
import { ApiError } from '../core/ApiError.js'
import { getEnv } from './util/utils.js'

function newIdempotencyKey(): string {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
}

async function main(): Promise<void> {
  const baseUrl = getEnv('GENIXSUITE_BASE')!
  const token = getEnv('GENIXSUITE_API_TOKEN')

  const client = new ElearningApiClient({ baseUrl: baseUrl!, token: token! })
  const body: ProcessSubjectRequest = {
    subject: { title: 'Idempotency Demo' },
    sources: [{ url: 'https://clerk.house.gov/committee_info/scsoal.pdf' }],
    outputs: ['pptx' as const],
  }

  // Idempotent replay with same body and key
  const key = newIdempotencyKey()
  console.log('First call…')
  const first = await client.processSubject(body, key)
  console.log('jobId:', first.jobId)

  console.log('Replay with same key and same body…')
  const replay = await client.processSubject(body, key)
  console.log('jobId (same logical operation):', replay.jobId)
  console.log('Note: Server should include header Idempotency-Replayed: true (inspect via curl).')

  // Conflict with changed body but same key
  console.log('Replay with same key but different body (should 409)…')
  try {
    await client.processSubject({ ...body, outputs: ['pdf' as const] }, key)
    console.log('Unexpected success; server should refuse body change for same key')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      console.log('Got expected error for body mismatch (409).')
    } else {
      throw e
    }
  }

  console.log('\nETag note: To demonstrate 304 Not Modified on artifacts, use curl to capture ETag, then set If-None-Match on subsequent GET.')
}

main().catch((e: unknown) => {
  if (e instanceof Error) console.error(e.message)
  process.exitCode = 1
})


