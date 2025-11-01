/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExportRequest } from '../models/CreateExportRequest.js';
import type { JobAccepted } from '../models/JobAccepted.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ExportsService {
    /**
     * Create an export job
     * Starts an asynchronous **export job** for existing content. You can export either a **Subject** (rich learning content) or a **Curriculum** (structured content).
     * The response is a job reference that can be polled for status or used to retrieve artifacts upon completion.
     * **Terminology:**
     * - **Subject**: User-facing learning content (with topics, points, etc.) identified by a UUID (`subjectId`).
     * - **Curriculum**: Structured course definition (modules/lessons) identified by a string (`curriculumId`).
     * **Notes:**
     * - Either `subjectId` or `curriculumId` **must** be provided (if both are provided, `subjectId` is preferred and used).
     * - Multiple output formats can be requested in one job (e.g., PPTX + PDF + Jira).
     * - Supported outputs differ: a subject can produce all types (slides, docs, integrations, etc.), whereas a curriculum-based export supports core formats (pptx, pdf, txt, video).
     * - Use the returned `statusUrl` (or the `Location` header) to poll for job status. Artifacts will be available via the job’s artifact list when the job succeeds.
     * @param requestBody
     * @returns JobAccepted Accepted; export job created
     * @throws ApiError
     */
    public static createExport(
        requestBody: CreateExportRequest,
    ): CancelablePromise<JobAccepted> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/exports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request – invalid input`,
                401: `Error response (Problem Details)`,
                403: `Forbidden – e.g., missing scope or invalid resource`,
                409: `Conflict – e.g., an antivirus scan is still pending or failed for a referenced source.`,
                429: `Rate limit exceeded`,
            },
        });
    }
}
