import { z } from 'zod'
import { Job as JobModel } from '../models/Job.js'

export const ProblemSchema = z.object({
  type: z.string().optional(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  code: z.string().optional(),
  correlationId: z.string().optional(),
})

export const ArtifactLinkSchema = z.object({
  downloadUrl: z.string(),
  expiresAt: z.string(),
})

export const ArtifactItemSchema = z.object({
  id: z.string().optional(),
  type: z
    .enum(['pptx', 'pdf', 'txt', 'video', 'jira', 'confluence', 'image'])
    .optional(),
  filename: z.string().optional(),
  sha256: z.string().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
  expiresAt: z.string().optional(),
})

export const ArtifactListSchema = z.object({
  items: z.array(ArtifactItemSchema),
})

const JobStatusLiterals = Object.values(JobModel.status) as [JobModel.status, ...JobModel.status[]]
export const JobStatusSchema = z
  .enum(JobStatusLiterals)
  .transform((v) => v as JobModel.status)

export const JobSchema = z.object({
  id: z.string(),
  status: JobStatusSchema,
  progress: z.number().min(0).max(100).optional(),
  stage: z.string().optional(),
  submittedAt: z.string(),
  updatedAt: z.string().optional(),
  artifacts: ArtifactListSchema.optional(),
  error: ProblemSchema.optional(),
})

export const JobAcceptedSchema = z.object({
  jobId: z.string(),
  statusUrl: z.string(), // relative URL allowed
})

export const CreateUploadResponseSchema = z.object({
  sourceId: z.string(),
  uploadUrl: z.string(),
  expiresAt: z.string(),
  fields: z.record(z.string(), z.string()),
  method: z.string(),
  filename: z.string(),
  sizeLimitBytes: z.number().int().nonnegative(),
})

export const RegisterSourceResponseSchema = z.object({
  sourceId: z.string(),
})

export const CreateCurriculumResponseSchema = z.object({
  curriculumId: z.string(),
})

export const CurriculumSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  user_id: z.string(),
  created_at: z.string(),
  subject_count: z.number().int().nonnegative().optional(),
})

export const CurriculumListSchema = z.object({
  items: z.array(CurriculumSchema),
})

// Optional: request schemas (exported for consumers who want to validate inputs)
export const CreateCurriculumRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
})

export const ProcessSubjectRequestSchema = z.object({
  subject: z.object({
    title: z.string().min(1),
    options: z.record(z.string(), z.unknown()).optional(),
  }),
  curriculum_id: z.string().optional(),
  sources: z
    .array(
      z.object({
        sourceId: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .optional(),
  outputs: z.array(z.enum(['pptx', 'pdf', 'txt', 'video'])),
  webhook: z
    .object({
      url: z.string().optional(),
      secretId: z.string().optional(),
    })
    .optional(),
})

export const CreateExportRequestSchema = z.object({
  subjectId: z.string().optional(),
  curriculumId: z.string().optional(),
  outputs: z
    .array(
      z.enum(['pptx', 'pdf', 'txt', 'video', 'jira', 'confluence', 'image'])
    )
    .optional(),
  sources: z.array(z.object({ sourceId: z.string().optional() })).optional(),
  options: z.record(z.string(), z.unknown()).optional(),
})

export type Problem = z.infer<typeof ProblemSchema>

export const isProblem = (u: unknown): u is Problem => ProblemSchema.safeParse(u).success

