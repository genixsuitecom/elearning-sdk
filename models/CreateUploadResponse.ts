/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUploadResponse = {
    /**
     * Identifier of the uploaded file within the system (includes a client prefix like `ci_12345/`). This will be used to register or reference the source.
     */
    sourceId: string;
    /**
     * The URL to which the file should be uploaded (using an HTTP form POST).
     */
    uploadUrl: string;
    /**
     * Timestamp (UTC) when the upload URL will expire.
     */
    expiresAt: string;
    /**
     * Key-value form fields to include in the upload POST (if provided, typically includes `key`, `policy`, `signature`, etc. for S3 or similar storage).
     */
    fields: Record<string, string>;
    /**
     * HTTP method to use for the upload (usually "POST").
     */
    method: string;
    /**
     * Sanitized filename stored (may differ slightly from input filename to ensure uniqueness).
     */
    filename: string;
    /**
     * Maximum allowed upload size in bytes for this pre-signed URL.
     */
    sizeLimitBytes: number;
};

