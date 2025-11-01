/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUploadRequest = {
    /**
     * Original file name (including extension).
     */
    filename: string;
    /**
     * MIME type of the file. Must be an allowed type and should match the file extension.
     */
    mimeType: string;
    /**
     * Size of the file in bytes. Uploads exceeding configured limits will be rejected.
     */
    sizeBytes: number;
    /**
     * Hex-encoded SHA-256 hash of the file content, for integrity verification.
     */
    sha256: string;
    /**
     * Optional Region hint for upload (not usually needed; the upload will target the server’s default region).
     */
    region?: string;
};

