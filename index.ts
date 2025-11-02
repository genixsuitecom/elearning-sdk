/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError.js';
export { CancelablePromise, CancelError } from './core/CancelablePromise.js';
export { OpenAPI } from './core/OpenAPI.js';
export type { OpenAPIConfig } from './core/OpenAPI.js';
export type { RequestInterceptor, ResponseInterceptor } from './core/OpenAPI.js';
export type { ApiResult } from './core/ApiResultTyped.js';
export * as Schemas from './schemas/index.js';

export type { ArtifactLink } from './models/ArtifactLink.js';
export type { ArtifactList } from './models/ArtifactList.js';
export type { CreateClientRequest } from './models/CreateClientRequest.js';
export type { CreateClientResponse } from './models/CreateClientResponse.js';
export type { CreateCurriculumRequest } from './models/CreateCurriculumRequest.js';
export type { CreateCurriculumResponse } from './models/CreateCurriculumResponse.js';
export type { Curriculum } from './models/Curriculum.js';
export type { CurriculumList } from './models/CurriculumList.js';
export type { Subject } from './models/Subject.js';
export type { Topic } from './models/Topic.js';
export type { LearningPoint } from './models/LearningPoint.js';
export type { CreateExportRequest } from './models/CreateExportRequest.js';
export type { CreateUploadRequest } from './models/CreateUploadRequest.js';
export type { CreateUploadResponse } from './models/CreateUploadResponse.js';
export type { DeveloperClient } from './models/DeveloperClient.js';
export type { IdempotencyKey } from './models/IdempotencyKey.js';
export { Job } from './models/Job.js';
export type { JobAccepted } from './models/JobAccepted.js';
export type { Problem } from './models/Problem.js';
export type { ProcessSubjectRequest } from './models/ProcessSubjectRequest.js';
export type { RegisterSourceRequest } from './models/RegisterSourceRequest.js';
export type { RegisterSourceResponse } from './models/RegisterSourceResponse.js';
export type { RotateSecretResponse } from './models/RotateSecretResponse.js';

export { ArtifactsService } from './services/ArtifactsService.js';
export { AuthService } from './services/AuthService.js';
export { ClientManagementService } from './services/ClientManagementService.js';
export { CurriculumService } from './services/CurriculumService.js';
export { ExportsService } from './services/ExportsService.js';
export { JobsService } from './services/JobsService.js';
export { SourcesService } from './services/SourcesService.js';
export { SubjectsService } from './services/SubjectsService.js';

// High-level client wrapper
export { ElearningApiClient, type ElearningApiClientConfig } from './ElearningApiClient.js';

// Consumer-facing type aliases for export customization
export type { ExportTemplate, ExportTheme, ExportOptions } from './types/index.js';

// Utilities for consumers
export { waitForJob, getEnv } from './examples/util/utils.js';