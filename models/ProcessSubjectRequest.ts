/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessSubjectRequest = {
    /**
     * A lightweight subject definition to process.
     */
    subject: {
        /**
         * Title of the subject.
         */
        title: string;
        /**
         * Generation options for the subject content (if any; structure may vary).
         */
        options?: Record<string, any>;
    };
    /**
     * Optional Content sources to be ingested as part of the subject. Each must have either a `sourceId` or a direct `url`.
     */
    sources?: Array<{
        /**
         * Reference to a previously registered source to include.
         */
        sourceId?: string;
        /**
         * URL of external content to fetch and include.
         */
        url?: string;
    }>;
    /**
     * One or more output formats to generate from the subject. (*For full list of output types, use the `/api/v1/exports` endpoint on a pre-created subject.*)
     */
    outputs: Array<'pptx' | 'pdf' | 'txt' | 'video'>;
    /**
     * Optional Webhook configuration for job status callbacks.
     */
    webhook?: {
        /**
         * Endpoint to receive POST updates about job status.
         */
        url?: string;
        /**
         * Identifier of a secret (e.g., HMAC key) to sign webhook payloads for verification.
         */
        secretId?: string;
    };
};

