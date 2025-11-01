/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtifactLink = {
    /**
     * A pre-signed URL to download the artifact. This URL will expire after a short time.
     */
    downloadUrl: string;
    /**
     * Timestamp when the `downloadUrl` will expire.
     */
    expiresAt: string;
};

