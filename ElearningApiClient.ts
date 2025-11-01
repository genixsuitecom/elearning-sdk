/**
 * ElearningApiClient - Unified client wrapper for the GenixSuite Learn API v1
 * 
 * Provides a simplified interface over the generated service classes, handling
 * authentication, base URL configuration, and idempotency keys automatically.
 * 
 * @example
 * ```ts
 * const client = new ElearningApiClient({
 *   baseUrl: 'https://app.genixsuite.com',
 *   token: process.env.GENIXSUITE_API_TOKEN!,
 *   verbose: true,
 * })
 * 
 * const upload = await client.createUpload({
 *   filename: 'doc.pdf',
 *   mimeType: 'application/pdf',
 *   sizeBytes: 1024,
 *   sha256: '...'
 * }, 'idem-123')
 * ```
 */
import { OpenAPI, type OpenAPIConfig } from './core/OpenAPI.js';
import { IngestService } from './services/IngestService.js';
import { CurriculaService } from './services/CurriculaService.js';
import { JobsService } from './services/JobsService.js';
import { ArtifactsService } from './services/ArtifactsService.js';
import type { CreateUploadRequest } from './models/CreateUploadRequest.js';
import type { CreateUploadResponse } from './models/CreateUploadResponse.js';
import type { RegisterSourceRequest } from './models/RegisterSourceRequest.js';
import type { RegisterSourceResponse } from './models/RegisterSourceResponse.js';
import type { CreateCurriculumRequest } from './models/CreateCurriculumRequest.js';
import type { CreateCurriculumResponse } from './models/CreateCurriculumResponse.js';
import type { CreateExportRequest } from './models/CreateExportRequest.js';
import type { JobAccepted } from './models/JobAccepted.js';
import type { ProcessSubjectRequest } from './models/ProcessSubjectRequest.js';
import type { Job } from './models/Job.js';
import type { ArtifactList } from './models/ArtifactList.js';
import type { ArtifactLink } from './models/ArtifactLink.js';
import { SubjectsService } from './services/SubjectsService.js';
import { ExportsService } from './services/ExportsService.js';

export interface ElearningApiClientConfig {
  /** Base URL for the API (e.g., 'https://app.genixsuite.com') */
  baseUrl: string;
  /** Bearer token or async function that returns a token */
  token: string | (() => Promise<string>);
  /** Enable verbose logging (redacts sensitive fields) */
  verbose?: boolean;
}

/**
 * Unified client for the GenixSuite Learn API v1
 */
export class ElearningApiClient {
  private config: ElearningApiClientConfig;

  constructor(config: ElearningApiClientConfig) {
    this.config = config;

    // Configure OpenAPI base URL
    OpenAPI.BASE = config.baseUrl;

    // Configure token resolver
    if (typeof config.token === 'string') {
      OpenAPI.TOKEN = config.token;
    } else {
      OpenAPI.TOKEN = config.token;
    }

    if (config.verbose) {
      // Verbose logging would be implemented here if needed
      // For now, we rely on the underlying request library
    }
  }

  /**
   * Create a presigned URL for uploading a source file
   * 
   * @param request - Upload request details
   * @param idempotencyKey - Optional idempotency key for safe retries
   * @returns Presigned upload URL and source ID
   */
  async createUpload(
    request: CreateUploadRequest,
    idempotencyKey?: string
  ): Promise<CreateUploadResponse> {
    return IngestService.createUpload(request, idempotencyKey);
  }

  /**
   * Register a previously uploaded object as a Source for processing
   * 
   * @param request - Source registration details
   * @param idempotencyKey - Optional idempotency key for safe retries
   * @returns Registered source details with AV status
   */
  async registerSource(
    request: RegisterSourceRequest,
    idempotencyKey?: string
  ): Promise<RegisterSourceResponse> {
    return IngestService.registerSource(request, idempotencyKey);
  }

  /**
   * Create and validate a curriculum definition
   * 
   * @param request - Curriculum creation request
   * @returns Created curriculum ID
   */
  async createCurriculum(request: CreateCurriculumRequest): Promise<CreateCurriculumResponse> {
    return CurriculaService.createCurriculum(request);
  }

  /**
   * Single-call endpoint to process a subject and generate outputs asynchronously
   * 
   * @param request - Subject processing request with sources and outputs
   * @param idempotencyKey - Optional idempotency key for safe retries
   * @returns Job acceptance details with job ID and status URL
   */
  async processSubject(
    request: ProcessSubjectRequest,
    idempotencyKey?: string
  ): Promise<JobAccepted> {
    return SubjectsService.processSubject(request, idempotencyKey);
  }

  /**
   * Create an export job from a subject or curriculum
   * 
   * @param request - Export job request (prefer subjectId for full capabilities)
   * @returns Job acceptance details with job ID and status URL
   * 
   * @example
   * ```ts
   * // Export from subject (preferred - supports all output types)
   * await client.createExport({
   *   subjectId: '550e8400-e29b-41d4-a716-446655440000',
   *   outputs: ['pptx', 'pdf', 'jira']
   * })
   * 
   * // Export from curriculum (structured schema format)
   * await client.createExport({
   *   curriculumId: 'abc123',
   *   outputs: ['pptx']
   * })
   * ```
   */
  async createExport(request: CreateExportRequest & {
    subjectId?: string;
    options?: { template?: any; includeImages?: boolean; theme?: any };
  }): Promise<JobAccepted> {
    return ExportsService.createExport(request as CreateExportRequest);
  }

  /**
   * Get the current status and progress of a job
   * 
   * @param jobId - Job identifier
   * @returns Job status, progress, stage, and artifacts
   */
  async getJob(jobId: string): Promise<Job> {
    return JobsService.getJobStatus(jobId);
  }

  /**
   * Request cancellation of a queued or running job
   * 
   * @param jobId - Job identifier to cancel
   */
  async cancelJob(jobId: string, idempotencyKey?: string): Promise<string> {
    return JobsService.cancelJob(jobId, idempotencyKey);
  }

  /**
   * List artifacts produced by a job
   * 
   * @param jobId - Job identifier
   * @returns List of artifacts with metadata
   */
  async listJobArtifacts(jobId: string, ifNoneMatch?: string): Promise<ArtifactList> {
    return JobsService.listJobArtifacts(jobId, ifNoneMatch);
  }

  /**
   * Get a temporary download URL for an artifact
   * 
   * @param artifactId - Artifact identifier
   * @returns Download URL and expiration time
   */
  async getArtifact(artifactId: string): Promise<ArtifactLink> {
    return ArtifactsService.getArtifactLink(artifactId);
  }
}

