/**
 * GenixSuite eLearning SDK – Export Example
 *
 * Run with:
 *   GENIXSUITE_BASE=... GENIXSUITE_API_TOKEN=... GENIXSUITE_SUBJECT_ID=123 node dist/example.js
 *
 * Either SUBJECT_ID or CURRICULUM_ID is required.
 */

import { ElearningApiClient } from '../ElearningApiClient.js'
import { getEnv } from './util/utils.js'

const baseUrl = getEnv('GENIXSUITE_BASE')
const token = getEnv('GENIXSUITE_API_TOKEN')
const subjectId = getEnv('GENIXSUITE_SUBJECT_ID')
const curriculumId = getEnv('GENIXSUITE_CURRICULUM_ID')

async function main(): Promise<void> {

  const client = new ElearningApiClient({ baseUrl: baseUrl!, token: token! })

  if (subjectId) {
    const exp = await client.createExport({ subjectId, outputs: ['pptx' as const, 'pdf' as const] })
    console.log('export job from subjectId:', exp.jobId)
  } else if (curriculumId) {
    const exp = await client.createExport({
      curriculumId,
      outputs: ['pptx' as const, 'pdf' as const, 'txt' as const, 'video' as const, 'jira' as const, 'confluence' as const, 'image' as const],
    })
    console.log('export job from curriculumId:', exp.jobId)
  } else {
    throw new Error('Provide GENIXSUITE_SUBJECT_ID or GENIXSUITE_CURRICULUM_ID')
  }
}

main().catch((e: unknown) => {
  if (e instanceof Error) console.error(e.message)
  process.exitCode = 1
})
