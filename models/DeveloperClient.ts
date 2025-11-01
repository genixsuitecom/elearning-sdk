/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DeveloperClient = {
    /**
     * Unique client identifier.
     */
    client_id: string;
    /**
     * Developer-provided name for the client application.
     */
    name: string;
    /**
     * List of OAuth2 scopes assigned to this client.
     */
    scopes: Array<string>;
    /**
     * Allowed redirect URIs for OAuth flows (if applicable).
     */
    redirect_uris?: Array<string>;
    /**
     * Timestamp when the client was created.
     */
    created_at: string;
    /**
     * Whether the client is currently disabled (unable to use token endpoint).
     */
    disabled: boolean;
    /**
     * Last 4 characters of the current client secret (for reference).
     */
    secret_last4: string;
};

