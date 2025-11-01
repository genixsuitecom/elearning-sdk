/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Curriculum entity returned by the API.
 */
export type Curriculum = {
    /** Unique identifier for the curriculum. */
    id: string;
    /** Human-facing name of this curriculum. */
    title: string;
    /** Optional description / who it's for / scope. */
    description?: string | null;
    /** The owner/creator of this curriculum. */
    user_id: string;
    /** When the curriculum was created (ISO timestamp). */
    created_at: string;
    /** How many subjects are currently in this curriculum. */
    subject_count?: number;
};


