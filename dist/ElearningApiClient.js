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
import { OpenAPI } from './core/OpenAPI';
import { IngestService } from './services/IngestService';
import { CurriculaService } from './services/CurriculaService';
import { JobsService } from './services/JobsService';
import { ArtifactsService } from './services/ArtifactsService';
import { SubjectsService } from './services/SubjectsService';
import { ExportsService } from './services/ExportsService';
/**
 * Unified client for the GenixSuite Learn API v1
 */
export class ElearningApiClient {
    constructor(config) {
        this.config = config;
        // Configure OpenAPI base URL
        OpenAPI.BASE = config.baseUrl;
        // Configure token resolver
        if (typeof config.token === 'string') {
            OpenAPI.TOKEN = config.token;
        }
        else {
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
    async createUpload(request, idempotencyKey) {
        return IngestService.createUpload(request, idempotencyKey);
    }
    /**
     * Register a previously uploaded object as a Source for processing
     *
     * @param request - Source registration details
     * @param idempotencyKey - Optional idempotency key for safe retries
     * @returns Registered source details with AV status
     */
    async registerSource(request, idempotencyKey) {
        return IngestService.registerSource(request, idempotencyKey);
    }
    /**
     * Create and validate a curriculum definition
     *
     * @param request - Curriculum creation request
     * @returns Created curriculum ID
     */
    async createCurriculum(request) {
        return CurriculaService.createCurriculum(request);
    }
    /**
     * Single-call endpoint to process a subject and generate outputs asynchronously
     *
     * @param request - Subject processing request with sources and outputs
     * @param idempotencyKey - Optional idempotency key for safe retries
     * @returns Job acceptance details with job ID and status URL
     */
    async processSubject(request, idempotencyKey) {
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
    async createExport(request) {
        return ExportsService.createExport(request);
    }
    /**
     * Get the current status and progress of a job
     *
     * @param jobId - Job identifier
     * @returns Job status, progress, stage, and artifacts
     */
    async getJob(jobId) {
        return JobsService.getJobStatus(jobId);
    }
    /**
     * Request cancellation of a queued or running job
     *
     * @param jobId - Job identifier to cancel
     */
    async cancelJob(jobId, idempotencyKey) {
        return JobsService.cancelJob(jobId, idempotencyKey);
    }
    /**
     * List artifacts produced by a job
     *
     * @param jobId - Job identifier
     * @returns List of artifacts with metadata
     */
    async listJobArtifacts(jobId, ifNoneMatch) {
        return JobsService.listJobArtifacts(jobId, ifNoneMatch);
    }
    /**
     * Get a temporary download URL for an artifact
     *
     * @param artifactId - Artifact identifier
     * @returns Download URL and expiration time
     */
    async getArtifact(artifactId) {
        return ArtifactsService.getArtifactLink(artifactId);
    }
}
