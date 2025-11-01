/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class AuthService {
    /**
     * OpenID Connect discovery metadata
     * Returns OAuth2/OIDC configuration metadata, including issuer, authorization, token, and JWKS endpoints, supported scopes, and other capabilities.
     * @returns any OIDC discovery document
     * @throws ApiError
     */
    public static oidcDiscovery(): CancelablePromise<{
        /**
         * The OIDC issuer identifier URL.
         */
        issuer: string;
        /**
         * Authorization endpoint for user sign-in (authorization code flow).
         */
        authorization_endpoint?: string;
        /**
         * Token endpoint for exchanging codes or client credentials.
         */
        token_endpoint: string;
        /**
         * URL of the JWKS for verifying JWTs.
         */
        jwks_uri: string;
        /**
         * OAuth2 grant types supported.
         */
        grant_types_supported?: Array<string>;
        /**
         * OAuth2 response types supported.
         */
        response_types_supported?: Array<string>;
        /**
         * PKCE code challenge methods supported.
         */
        code_challenge_methods_supported?: Array<string>;
        /**
         * List of OAuth2 scopes supported by this API.
         */
        scopes_supported?: Array<string>;
        /**
         * Supported auth methods for the token endpoint (e.g. client secrets).
         */
        token_endpoint_auth_methods_supported?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/.well-known/openid-configuration',
        });
    }
    /**
     * JSON Web Key Set (JWKS)
     * Returns the public JSON Web Key Set. These keys are used to verify JWT signatures (e.g., access tokens).  The keys rotate periodically; cache accordingly (`Cache-Control: max-age=300`).
     * @returns any JSON Web Key set
     * @throws ApiError
     */
    public static getJwks(): CancelablePromise<{
        keys: Array<{
            /**
             * Key identifier
             */
            kid?: string;
            /**
             * Key usage (e.g.
             */
            use?: string;
            /**
             * Signing algorithm
             */
            alg?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/.well-known/jwks.json',
        });
    }
    /**
     * OAuth2 token issuance
     * Token endpoint for exchanging credentials for tokens. Supports:
     * - **Authorization Code (with PKCE)** – Exchange a code (and code_verifier) for an access token (and refresh token).
     * - **Refresh Token** – Exchange a refresh token for a new access token (rotating refresh tokens if applicable).
     * - **Client Credentials** – Obtain an access token directly using a client’s ID and secret.
     * The response is a JSON object containing the token and related fields.
     * @param formData
     * @returns any Successful token response
     * @throws ApiError
     */
    public static oauthToken(
        formData: {
            /**
             * OAuth2 grant type.
             */
            grant_type?: 'authorization_code' | 'refresh_token' | 'client_credentials';
            /**
             * Authorization code (for authorization_code grant).
             */
            code?: string;
            /**
             * PKCE code verifier (if using authorization_code).
             */
            code_verifier?: string;
            /**
             * Refresh token (for refresh_token grant).
             */
            refresh_token?: string;
            /**
             * Client ID (for client_credentials; can also be provided via Basic auth).
             */
            client_id?: string;
            /**
             * Client secret (for client_credentials; can also be provided via Basic auth).
             */
            client_secret?: string;
            /**
             * Redirect URI (required if multiple are registered and grant_type=authorization_code).
             */
            redirect_uri?: string;
            /**
             * Space-delimited scopes to request. If omitted, defaults to configured default scopes.
             */
            scope?: string;
        },
    ): CancelablePromise<{
        /**
         * The OAuth2 access token. Typically a JWT to be used as a Bearer token.
         */
        access_token: string;
        /**
         * Token type (always "Bearer").
         */
        token_type: string;
        /**
         * Lifetime in seconds of the access token.
         */
        expires_in: number;
        /**
         * Refresh token (present if issuing a refresh token).
         */
        refresh_token?: string;
        /**
         * Space-delimited list of scopes granted.
         */
        scope?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/oauth2/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                400: `Error response (Problem Details)`,
                401: `Error response (Problem Details)`,
                429: `Rate limit exceeded`,
            },
        });
    }
}
