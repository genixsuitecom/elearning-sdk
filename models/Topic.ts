/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Topic entity.
 */
export type Topic = {
    /** The unique identifier for the topic. */
    id: string;
    /** The title of the topic. */
    title: string;
    /** An optional, more detailed description of the topic. */
    description?: string | null;
    /** The zero-based index for ordering topics within the curriculum. */
    order_index: number;
    /** The ID of the subject this topic belongs to. */
    subject_id: string;
    /** The ID of the user who owns the topic. */
    user_id: string;
    /** The timestamp when the topic was created. */
    created_at: string;
};


