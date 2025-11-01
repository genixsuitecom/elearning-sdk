/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Curriculum entity returned by the API.
 */
export type Curriculum = {
    /**
     * Unique identifier for the curriculum.
     */
    id: string;
    /**
     * Human-facing name of this curriculum (e.g., "Onboarding Training v1").
     */
    title: string;
    /**
     * Optional description / who it's for / scope.
     */
    description?: string | null;
    /**
     * The owner/creator of this curriculum.
     */
    userId: string;
    /**
     * When the curriculum was created (ISO timestamp).
     */
    createdAt: string;
    /**
     * How many subjects are currently in this curriculum.
     */
    subjectCount?: number;
};


