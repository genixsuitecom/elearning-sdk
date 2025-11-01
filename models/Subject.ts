/* istanbul ignore file */
/* tslint:disable */
/* eslint:disable */
/**
 * Subject entity.
 */
export type Subject = {
    /** The unique identifier for the subject. */
    id: string;
    /** The curriculum this subject belongs to. */
    curriculum_id: string;
    /** The title of the subject. */
    title: string;
    /** An optional description of the subject. */
    description?: string | null;
    /** The ID of the user who owns the subject. */
    user_id: string;
    /** The timestamp when the subject was created. */
    created_at: string;
    /** The number of source documents associated with the subject. */
    source_count?: number;
    /** The number of topics in the subject's curriculum. */
    topic_count?: number;
};


