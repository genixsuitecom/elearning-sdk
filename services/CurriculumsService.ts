/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCurriculumRequest } from '../models/CreateCurriculumRequest.js';
import type { CreateCurriculumResponse } from '../models/CreateCurriculumResponse.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CurriculumsService {
    /**
     * Create a curriculum definition
     * Creates a new **Curriculum** – a structured collection of modules and lessons. The request body must conform to the curriculum schema.
     * **Notes:**
     * - A `title` and at least one module (with at least one lesson) are required.
     * - The `metadata` field can store arbitrary key-value pairs for internal use.
     * - The response returns a `curriculumId` (string identifier) that can be used to initiate export jobs for this curriculum.
     * @param requestBody
     * @returns CreateCurriculumResponse Curriculum created
     * @throws ApiError
     */
    public static createCurriculum(
        requestBody: CreateCurriculumRequest,
    ): CancelablePromise<CreateCurriculumResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/curriculums',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response (Problem Details)`,
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                429: `Rate limit exceeded`,
            },
        });
    }
}
