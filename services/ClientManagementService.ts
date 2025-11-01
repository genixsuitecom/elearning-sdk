/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateClientRequest } from '../models/CreateClientRequest.js';
import type { CreateClientResponse } from '../models/CreateClientResponse.js';
import type { DeveloperClient } from '../models/DeveloperClient.js';
import type { RotateSecretResponse } from '../models/RotateSecretResponse.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ClientManagementService {
    /**
     * List OAuth clients
     * Retrieves all OAuth2 client applications associated with the current user (developer).
     * Requires a valid user session cookie and matching CSRF token.
     * @returns any OK
     * @throws ApiError
     */
    public static listClients(): CancelablePromise<{
        items: Array<DeveloperClient>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dev/clients',
        });
    }
    /**
     * Create a new OAuth client
     * Registers a new OAuth2 client (credentials for machine-to-machine access or OAuth flows).
     * The client ID and a one-time client secret are returned. **This secret is shown only once – record it securely.**
     * Requires a user session and CSRF protection.
     * @param requestBody
     * @returns CreateClientResponse Created
     * @throws ApiError
     */
    public static createClient(
        requestBody: CreateClientRequest,
    ): CancelablePromise<CreateClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dev/clients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error, e.g. missing name or scopes)`,
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
            },
        });
    }
    /**
     * Enable a client
     * Re-enables an OAuth client that was disabled, allowing it to be used for token issuance again.
     * No request body is needed. Requires user session + CSRF.
     * @param clientId
     * @returns void
     * @throws ApiError
     */
    public static enableClient(
        clientId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dev/clients/{clientId}/enable',
            path: {
                'clientId': clientId,
            },
            errors: {
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                404: `Error response (Problem Details)`,
            },
        });
    }
    /**
     * Disable a client
     * Disables an OAuth client, immediately revoking its ability to obtain new tokens. Existing tokens may be invalidated depending on implementation.
     * Requires user session + CSRF. No request body.
     * @param clientId
     * @returns void
     * @throws ApiError
     */
    public static disableClient(
        clientId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dev/clients/{clientId}/disable',
            path: {
                'clientId': clientId,
            },
            errors: {
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                404: `Error response (Problem Details)`,
            },
        });
    }
    /**
     * Rotate client secret
     * Generates a new client secret for the specified OAuth client. The old secret is immediately invalidated.
     * The new secret is returned in the response (treat it with the same care as a password). Requires session + CSRF.
     * @param clientId
     * @returns RotateSecretResponse New secret generated
     * @throws ApiError
     */
    public static rotateClientSecret(
        clientId: string,
    ): CancelablePromise<RotateSecretResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dev/clients/{clientId}/rotate',
            path: {
                'clientId': clientId,
            },
            errors: {
                401: `Error response (Problem Details)`,
                403: `Error response (Problem Details)`,
                404: `Error response (Problem Details)`,
            },
        });
    }
}
