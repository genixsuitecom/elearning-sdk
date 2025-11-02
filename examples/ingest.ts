/*
  GenixSuite eLearning SDK – Ingest example (TypeScript)
  - Presign upload → (perform form upload) → register source
*/

import { ElearningApiClient } from '../ElearningApiClient.js'
import { getEnv } from './util/utils.js'

type PresignedPost = { url: string; fields: Record<string, string>; method: string }

async function main(): Promise<void> {
  const baseUrl = getEnv('GENIXSUITE_BASE')
  const token = getEnv('GENIXSUITE_API_TOKEN')
  const client = new ElearningApiClient({ baseUrl: baseUrl!, token: token! })

  const idem = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)

  // 1) Presign upload
  const sha256 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const presigned = await client.createUpload({
    filename: 'doc.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 123_456,
    sha256,
  }, idem)

  console.log('uploadUrl:', presigned.uploadUrl)
  console.log('sourceId:', presigned.sourceId)
  console.log('fields keys:', Object.keys(presigned.fields ?? {}))

  // Optional: shape the presigned payload for upload routines
  const post: PresignedPost = { url: presigned.uploadUrl, fields: presigned.fields, method: presigned.method }
  void post

  // 2) Perform the form POST to storage using presigned.uploadUrl + fields
  // This step is environment-specific (browser/server). Not performed here.

  // 3) Register the uploaded source
  const registered = await client.registerSource({
    sourceId: presigned.sourceId,
    filename: 'doc.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 123_456,
    sha256,
  }, (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`))

  console.log('registered:', Boolean(registered.sourceId))
}

main().catch((e: unknown) => {
  if (e instanceof Error) console.error(e.message)
  process.exitCode = 1
})


