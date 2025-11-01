/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCurriculumRequest = {
    /**
     * Title of the curriculum.
     */
    title: string;
    /**
     * List of modules in the curriculum.
     */
    modules: Array<{
        /**
         * Title of the module.
         */
        title: string;
        /**
         * Lessons within the module.
         */
        lessons: Array<{
            /**
             * Title of the lesson.
             */
            title?: string;
            /**
             * Content of the lesson (plain text or Markdown).
             */
            content?: string;
        }>;
    }>;
    /**
     * Arbitrary metadata key/value pairs for the curriculum.
     */
    metadata?: Record<string, any>;
};

