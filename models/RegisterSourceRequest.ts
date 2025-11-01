/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterSourceRequest = {
    /**
     * The `sourceId` originally returned by the upload creation. This should include the client prefix (e.g., `ci_12345/uploads/filename.ext`).
     */
    sourceId: string;
    /**
     * Optional override for the file name (if different from initial upload metadata).
     */
    filename?: string;
    /**
     * Optional override for MIME type.
     */
    mimeType?: string;
    /**
     * Optional override for file size in bytes.
     */
    sizeBytes?: number;
    /**
     * Optional override for the SHA-256 hash (should match the file content if provided).
     */
    sha256?: string;
};

