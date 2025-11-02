/*
  GenixSuite eLearning SDK – Quickstart (TypeScript)
  - Node 18+ (global fetch)
  - Run with: npx tsx examples/quickstart.ts
*/

import { CreateExportRequest } from '../models/CreateExportRequest.js'
import { ElearningApiClient } from '../ElearningApiClient.js'
import { getEnv } from './util/utils.js'
import { ProblemSchema } from '../schemas/index.js'

function newIdempotencyKey(): string {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
}

async function main(): Promise<void> {
  const baseUrl = getEnv('GENIXSUITE_BASE')!
  const token = getEnv('GENIXSUITE_API_TOKEN')!

  const client = new ElearningApiClient({ baseUrl, token, validateResponses: true })

  // 1) Create a curriculum
  console.log('Creating curriculum…')
  const created = await client.createCurriculum({ title: 'TS Quickstart Curriculum' })
  const curriculumId = created.curriculumId
  console.log('curriculumId:', curriculumId)

  // 2) Process a subject (single-call orchestration)
  console.log('Processing subject…')
  const idem = newIdempotencyKey()
  const processRes = await client.processSubject({
    subject: { title: 'TS Quickstart Subject' },
    sources: [{ url: 'https://clerk.house.gov/committee_info/scsoal.pdf' }],
    outputs: ['pptx', 'pdf'],
  }, idem)
  let jobId = processRes.jobId
  console.log('jobId:', jobId)

  // 3) Create an export from subjectId (demonstrate both paths)
  console.log('Creating export from subjectId…')
  const exportJob = await client.createExport({ subjectId: jobId, outputs: ['pptx', 'pdf'] })
  jobId = exportJob.jobId
  console.log('export jobId:', jobId)

  // 4) Poll job status once (SDK users typically poll until terminal)
  console.log('Job status…')
  const job = await client.getJob(jobId)
  console.log('status:', job.status, 'progress:', job.progress, 'stage:', job.stage)

  // 5) List artifacts and resolve first download link (if any)
  console.log('Listing artifacts…')
  const arts = await client.listJobArtifacts(jobId)
  if (Array.isArray(arts.items) && arts.items.length > 0) {
    const artifactId = arts.items[0]!.id
    const link = await client.getArtifact(artifactId!)
    console.log('downloadUrl:', link.downloadUrl)
  } else {
    console.log('No artifacts yet. Re-run after job completes.')
  }

  // 6) Export from curriculum for parity (if created)
  if (curriculumId) {
    console.log('Creating export from curriculumId…')
    const exp2 = await client.createExport({
      curriculumId: curriculumId!,
      outputs: ['pptx'],
    } satisfies CreateExportRequest & { curriculumId: string })
    console.log('curriculum export jobId:', exp2.jobId)
  }
}

main().catch((e: unknown) => {
  const maybeApiError = e as { status?: number; body?: unknown; headers?: Record<string, string> }
  const prob = ProblemSchema.safeParse(maybeApiError?.body)
  if (prob.success) {
    const p = prob.data
    const corr = p.correlationId ?? maybeApiError.headers?.['x-correlation-id']
    console.error('[API ERROR]', p.status, p.title, p.detail ?? '')
    if (corr) console.error('correlationId:', corr)
  } else if (e instanceof Error) {
    console.error('Quickstart error:', e.message)
  } else {
    console.error('Quickstart error (unknown)')
  }
  process.exitCode = 1
})
