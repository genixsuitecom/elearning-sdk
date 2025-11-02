// Type-level tests for createExport discriminated union
// To run: npx tsd

import { ElearningApiClient } from '../../dist/ElearningApiClient.js'
import type { CreateExportRequest } from '../../dist/models/CreateExportRequest.js'

const client = new ElearningApiClient({ BASE: 'https://example.com', TOKEN: 'x', VERSION: '1.0.0', WITH_CREDENTIALS: false, CREDENTIALS: 'include' })

// Valid: subjectId variant
const reqSubject = { subjectId: 'uuid', outputs: ['pptx'] } satisfies CreateExportRequest & { subjectId: string; curriculumId?: never }
// Valid: curriculumId variant
const reqCurriculum = { curriculumId: 'abc', outputs: ['pptx'] } satisfies CreateExportRequest & { curriculumId: string; subjectId?: never }

void client
  .createExport(reqSubject)
  .then(() => { })

void client
  .createExport(reqCurriculum)
  .then(() => { })

void client.createExport({ subjectId: 'u' } satisfies CreateExportRequest & { subjectId: string; curriculumId?: never })

// Invalid: both subjectId and curriculumId should not be provided
// @ts-expect-error
void client.createExport({ subjectId: 'u', curriculumId: 'c', outputs: ['pptx'] })

