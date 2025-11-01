/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Learning point entity.
 */
export type LearningPoint = {
    /** The unique identifier for the learning point. */
    id: string;
    /** The main content or text of the learning point. */
    content: string;
    /** Optional list of source IDs (UUIDs) that support this point for citations. */
    source?: string[];
    /** The zero-based index for ordering points within a topic. */
    order_index: number;
    /** The ID of the topic this point belongs to. */
    topic_id: string;
    /** The ID of the user who owns the point. */
    user_id: string;
    /** The timestamp when the point was created. */
    created_at: string;
};


