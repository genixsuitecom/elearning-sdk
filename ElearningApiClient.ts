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
 *   validateResponses: true,
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
import { OpenAPI } from './core/OpenAPI.js';
import { IngestService } from './services/IngestService.js';
import { JobsService } from './services/JobsService.js';
import { ArtifactsService } from './services/ArtifactsService.js';
import type { CreateUploadRequest } from './models/CreateUploadRequest.js';
import type { CreateUploadResponse } from './models/CreateUploadResponse.js';
import type { RegisterSourceRequest } from './models/RegisterSourceRequest.js';
import type { RegisterSourceResponse } from './models/RegisterSourceResponse.js';
import type { CreateCurriculumRequest } from './models/CreateCurriculumRequest.js';
import type { CreateCurriculumResponse } from './models/CreateCurriculumResponse.js';
import type { CreateExportRequest } from './models/CreateExportRequest.js';
import type { Curriculum } from './models/Curriculum.js';
import type { CurriculumList } from './models/CurriculumList.js';
import type { JobAccepted } from './models/JobAccepted.js';
import type { ProcessSubjectRequest } from './models/ProcessSubjectRequest.js';
import type { Job } from './models/Job.js';
import type { ArtifactList } from './models/ArtifactList.js';
import type { ArtifactLink } from './models/ArtifactLink.js';
import { SubjectsService } from './services/SubjectsService.js';
import { ExportsService } from './services/ExportsService.js';
import { CurriculumService } from './services/CurriculumService.js';
import {
  ArtifactLinkSchema,
  ArtifactListSchema,
  CreateCurriculumResponseSchema,
  CreateUploadResponseSchema,
  CurriculumListSchema,
  CurriculumSchema,
  JobAcceptedSchema,
  JobSchema,
  RegisterSourceResponseSchema,
} from './schemas/index.js';
import type { RequestInterceptor, ResponseInterceptor } from './core/OpenAPI.js';
import type { ApiRequestOptions } from './core/ApiRequestOptions.js';

export type ElearningApiClientConfig = {
  /** Base URL of the API, e.g. https://app.genixsuite.com */
  baseUrl: string;
  /** Bearer token or async supplier */
  token: string | (() => string | Promise<string>);
  /** Enable verbose request/response logging */
  verbose?: boolean;
  /** Enable Zod validation of responses in high-level helpers */
  validateResponses?: boolean;
  /** Optional request interceptors applied before fetch */
  requestInterceptors?: ReadonlyArray<RequestInterceptor>;
  /** Optional response interceptors applied after fetch */
  responseInterceptors?: ReadonlyArray<ResponseInterceptor>;
};

/**
 * Unified client for the GenixSuite Learn API v1
 */
export class ElearningApiClient {
  private config: ElearningApiClientConfig;
  private cachedToken?: string;

  constructor(config: ElearningApiClientConfig) {
    this.config = config;

    // Configure OpenAPI base URL
    OpenAPI.BASE = this.config.baseUrl.replace(/\/+$/, '');

    // Configure token resolver
    OpenAPI.TOKEN = async (_options: ApiRequestOptions): Promise<string> => {
      if (typeof this.config.token === 'string') {
        return this.config.token;
      }
      // lightweight cache (no expiry handling here)
      if (!this.cachedToken) {
        const supplied = await this.config.token();
        this.cachedToken = supplied;
      }
      return this.cachedToken ?? '';
    };

    // Interceptors: user-provided and optional verbose logging
    const redacted = (h: Headers | Record<string, string> | string[][] | undefined): Record<string, string> | undefined => {
      if (!h) return undefined;
      const out: Record<string, string> = {};
      let entries: Array<[string, string]>;
      if (h instanceof Headers) {
        entries = Array.from(h as unknown as Iterable<[string, string]>);
      } else if (Array.isArray(h)) {
        entries = h as Array<[string, string]>;
      } else {
        entries = Object.entries(h as Record<string, string>);
      }
      for (const [k, v] of entries) {
        const key = k.toLowerCase();
        out[k] = ['authorization', 'proxy-authorization', 'x-api-key'].includes(key) ? '<redacted>' : v;
      }
      return out;
    };

    const requestLog: RequestInterceptor = (info) => {
      if (this.config.verbose) {
        // eslint-disable-next-line no-console
        console.log('[SDK][request]', info.init?.method ?? 'GET', info.url, { headers: redacted(info.init?.headers as Record<string, string>) });
      }
    };

    const responseLog: ResponseInterceptor = (info) => {
      if (this.config.verbose) {
        // eslint-disable-next-line no-console
        console.log('[SDK][response]', info.response.status, info.url, { headers: redacted(info.response.headers) });
      }
    };

    OpenAPI.INTERCEPTORS = OpenAPI.INTERCEPTORS || { request: [], response: [] };
    OpenAPI.INTERCEPTORS.request = [
      ...(OpenAPI.INTERCEPTORS.request ?? []),
      ...(this.config.requestInterceptors ?? []),
      requestLog,
    ];
    OpenAPI.INTERCEPTORS.response = [
      ...(OpenAPI.INTERCEPTORS.response ?? []),
      ...(this.config.responseInterceptors ?? []),
      responseLog,
    ];
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
    const key = idempotencyKey ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    const raw = await IngestService.createUpload(request, key);
    return this.config.validateResponses ? CreateUploadResponseSchema.parse(raw) : raw;
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
    const key = idempotencyKey ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    const raw = await IngestService.registerSource(request, key);
    return this.config.validateResponses ? RegisterSourceResponseSchema.parse(raw) : raw;
  }

  /**
   * Create and validate a curriculum definition
   * 
   * @param request - Curriculum creation request
   * @returns Created curriculum ID
   */
  async createCurriculum(request: CreateCurriculumRequest): Promise<CreateCurriculumResponse> {
    const raw = await CurriculumService.createCurriculum(request);
    return this.config.validateResponses ? CreateCurriculumResponseSchema.parse(raw) : raw;
  }

  /**
   * List all curriculums visible to the caller
   */
  async listCurriculums(): Promise<CurriculumList> {
    const raw = await CurriculumService.listCurriculums();
    return this.config.validateResponses ? CurriculumListSchema.parse(raw) : raw;
  }

  /**
   * Get a single curriculum by ID
   */
  async getCurriculum(curriculumId: string): Promise<Curriculum> {
    const raw = await CurriculumService.getCurriculum(curriculumId);
    return this.config.validateResponses ? CurriculumSchema.parse(raw) : raw;
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
    const key = idempotencyKey ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    const raw = await SubjectsService.processSubject(request, key);
    return this.config.validateResponses ? JobAcceptedSchema.parse(raw) : raw;
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
  async createExport(request: (
    (CreateExportRequest & { subjectId: string; curriculumId?: never; options?: { template?: unknown; includeImages?: boolean; theme?: unknown } }) |
    (CreateExportRequest & { curriculumId: string; subjectId?: never; options?: { template?: unknown; includeImages?: boolean; theme?: unknown } })
  )): Promise<JobAccepted> {
    if (('subjectId' in request) && ('curriculumId' in request)) {
      throw new Error('Provide either subjectId or curriculumId, not both');
    }
    const raw = await ExportsService.createExport(request as CreateExportRequest);
    return this.config.validateResponses ? JobAcceptedSchema.parse(raw) : raw;
  }

  /**
   * Get the current status and progress of a job
   * 
   * @param jobId - Job identifier
   * @returns Job status, progress, stage, and artifacts
   */
  async getJob(jobId: string): Promise<Job> {
    const raw = await JobsService.getJobStatus(jobId);
    return this.config.validateResponses ? JobSchema.parse(raw) : raw;
  }

  /**
   * Request cancellation of a queued or running job
   * 
   * @param jobId - Job identifier to cancel
   */
  async cancelJob(jobId: string, idempotencyKey?: string): Promise<string> {
    const key = idempotencyKey ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    return JobsService.cancelJob(jobId, key);
  }

  /**
   * List artifacts produced by a job
   * 
   * @param jobId - Job identifier
   * @returns List of artifacts with metadata
   */
  async listJobArtifacts(jobId: string, ifNoneMatch?: string): Promise<ArtifactList> {
    const raw = await JobsService.listJobArtifacts(jobId, ifNoneMatch);
    return this.config.validateResponses ? ArtifactListSchema.parse(raw) : raw;
  }

  /**
   * Get a temporary download URL for an artifact
   * 
   * @param artifactId - Artifact identifier
   * @returns Download URL and expiration time
   */
  async getArtifact(artifactId: string): Promise<ArtifactLink> {
    const raw = await ArtifactsService.getArtifactLink(artifactId);
    return this.config.validateResponses ? ArtifactLinkSchema.parse(raw) : raw;
  }
}

