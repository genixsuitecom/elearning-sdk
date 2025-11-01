/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtifactList = {
    /**
     * List of artifacts produced by the job.
     */
    items: Array<{
        /**
         * Artifact identifier.
         */
        id?: string;
        /**
         * Artifact type/format.
         */
        type?: 'pptx' | 'pdf' | 'txt' | 'video' | 'jira' | 'confluence' | 'image';
        /**
         * Suggested filename for download (typically includes the appropriate extension).
         */
        filename?: string;
        /**
         * SHA-256 checksum of the artifact content (if available).
         */
        sha256?: string;
        /**
         * Size of the artifact file in bytes (if available).
         */
        sizeBytes?: number;
        /**
         * Timestamp when the artifact will expire from storage (if applicable).
         */
        expiresAt?: string;
    }>;
};

