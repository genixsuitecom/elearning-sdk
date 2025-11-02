/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PlatformService {
    /**
     * OIDC discovery document
     * OpenID Provider Configuration Information (per OIDC).
     * @returns any OK
     * @throws ApiError
     */
    public static openIdConfiguration(): CancelablePromise<unknown> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/.well-known/openid-configuration',
        });
    }
    /**
     * JSON Web Key Set
     * Public keys used to verify RS256 access tokens.
     * @returns any OK
     * @throws ApiError
     */
    public static jwks(): CancelablePromise<unknown> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/.well-known/jwks.json',
        });
    }
    /**
     * Health check
     * Returns 200 OK when the API is up. No authentication required.
     * @returns any OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
