/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Problem = {
    /**
     * URI identifying the error type (category of error).
     */
    type?: string;
    /**
     * Short description of the error.
     */
    title: string;
    /**
     * HTTP status code.
     */
    status: number;
    /**
     * Human-readable details about this specific occurrence of the error.
     */
    detail?: string;
    /**
     * URI identifying the specific occurrence of the problem (if applicable).
     */
    instance?: string;
    /**
     * Application-specific error code (machine-readable).
     */
    code?: string;
    /**
     * A request correlation identifier useful for tracing logs.
     */
    correlationId?: string;
};

