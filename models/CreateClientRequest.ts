/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateClientRequest = {
    /**
     * Human-friendly name for the new client.
     */
    name: string;
    /**
     * Scopes to grant to the client. Must include at least one scope. Only scopes allowed by the system can be set.
     */
    scopes: Array<string>;
    /**
     * Allowed OAuth2 redirect URIs for this client (for Authorization Code flow). Can be empty if not applicable.
     */
    redirectUris?: Array<string>;
};

