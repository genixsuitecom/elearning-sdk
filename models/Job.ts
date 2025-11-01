/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtifactList } from './ArtifactList.js';
import type { Problem } from './Problem.js';
export type Job = {
    /**
     * Job identifier.
     */
    id: string;
    /**
     * Current status of the job.
     */
    status: Job.status;
    /**
     * Progress percentage (0-100) if applicable.
     */
    progress?: number;
    /**
     * High-level stage of execution (e.g., "ingesting", "processing", "exporting").
     */
    stage?: string;
    /**
     * Timestamp when the job was submitted.
     */
    submittedAt: string;
    /**
     * Timestamp of the last status update.
     */
    updatedAt?: string;
    artifacts?: ArtifactList;
    /**
     * If the job failed, this object provides error details.
     */
    error?: Problem;
};
export namespace Job {
    /**
     * Current status of the job.
     */
    export enum status {
        QUEUED = 'queued',
        RUNNING = 'running',
        SUCCEEDED = 'succeeded',
        FAILED = 'failed',
        CANCELED = 'canceled',
    }
}

