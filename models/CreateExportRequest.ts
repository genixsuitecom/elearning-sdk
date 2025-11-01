/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parameters for creating an export job for either a subject or curriculum. Exactly one of `subjectId` or `curriculumId` must be provided.
 */
export type CreateExportRequest = {
    /**
     * UUID of an existing Subject to export.
     */
    subjectId?: string;
    /**
     * Identifier of a Curriculum to export.
     */
    curriculumId?: string;
    /**
     * List of output formats to generate.
     * - `pptx` (PowerPoint), `pdf` (PDF), `txt` (plain text summary), `video` (MP4 video),
     * - `jira` (Jira markdown), `confluence` (Confluence markdown), `image` (slide images).
     * **Note:** If exporting a curriculum (as opposed to a subject), only `pptx`, `pdf`, `txt`, `video` are applicable.
     */
    outputs?: Array<'pptx' | 'pdf' | 'txt' | 'video' | 'jira' | 'confluence' | 'image'>;
    /**
     * Optional additional content sources to include (applicable to certain export types or curriculum exports).
     */
    sources?: Array<{
        /**
         * Identifier of an uploaded source to attach/include in the export. Must belong to the same client.
         */
        sourceId?: string;
    }>;
    /**
     * Export-generation options and customizations (various fields may be recognized by the generator).
     */
    options?: Record<string, any>;
};

