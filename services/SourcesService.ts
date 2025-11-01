/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUploadRequest } from '../models/CreateUploadRequest.js';
import type { CreateUploadResponse } from '../models/CreateUploadResponse.js';
import type { RegisterSourceRequest } from '../models/RegisterSourceRequest.js';
import type { RegisterSourceResponse } from '../models/RegisterSourceResponse.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SourcesService {
    /**
     * Create pre-signed upload URL
     * Issues a short-lived pre-signed URL (and form fields) for direct file upload to storage.
     * Clients can upload a file directly to the storage bucket using the returned URL and fields.
     * **Notes:**
     * - Idempotent: if an `Idempotency-Key` header is provided, sending the same request body with the same key will return the same upload URL and `sourceId` (avoid duplicate uploads).
     * - The `sha256` field must be a 64-character hexadecimal string (content hash).
     * - Maximum allowed `sizeBytes` is 1 GiB; larger values result in 413 Payload Too Large.
     * - On success, use the `uploadUrl` and `fields` in a standard HTML form POST (or simulated form upload) to actually upload the file.
     * @param requestBody
     * @param idempotencyKey An idempotency key to ensure a POST request is executed only once.
     * If the same key is reused with an identical request body, the server will return the original result instead of creating a duplicate resource.
     * The key should be unique per distinct operation attempt.
     * @returns CreateUploadResponse Pre-signed URL created
     * @throws ApiError
     */
    public static createUpload(
        requestBody: CreateUploadRequest,
        idempotencyKey?: string,
    ): CancelablePromise<CreateUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ingest/uploads',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response (Problem Details)`,
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                413: `Payload too large (file size exceeds allowed maximum)`,
                429: `Rate limit exceeded`,
            },
        });
    }
    /**
     * Register an uploaded source
     * Registers a previously uploaded file as a content **Source** for processing. This step finalizes the ingestion:
     * it validates and records the uploaded object so it can be referenced in learning content or export jobs.
     * **Notes:**
     * - Provide the exact `sourceId` obtained from the upload step. The sourceId is prefixed with your client identifier (e.g., `ci_12345/...`).
     * - You may override metadata (filename, mimeType, sizeBytes, sha256) if different from the original upload; otherwise those fields are optional.
     * - After registration, the source is eligible to be used in subject processing or curriculum export jobs.
     * @param requestBody
     * @param idempotencyKey An idempotency key to ensure a POST request is executed only once.
     * If the same key is reused with an identical request body, the server will return the original result instead of creating a duplicate resource.
     * The key should be unique per distinct operation attempt.
     * @returns RegisterSourceResponse Source registered
     * @throws ApiError
     */
    public static registerSource(
        requestBody: RegisterSourceRequest,
        idempotencyKey?: string,
    ): CancelablePromise<RegisterSourceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ingest/sources',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response (Problem Details)`,
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                409: `Conflict – e.g., the source is not yet virus-scanned or was flagged`,
                429: `Rate limit exceeded`,
            },
        });
    }
}
