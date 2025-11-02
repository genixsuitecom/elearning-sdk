/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions.js';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type RequestInterceptor = (info: { url: string; init: RequestInit; options: ApiRequestOptions }) => { url?: string; init?: RequestInit } | void;
export type ResponseInterceptor = (info: { response: Response; url: string; options: ApiRequestOptions }) => void;

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string> | undefined;
    USERNAME?: string | Resolver<string> | undefined;
    PASSWORD?: string | Resolver<string> | undefined;
    HEADERS?: Headers | Resolver<Headers> | undefined;
    ENCODE_PATH?: ((path: string) => string) | undefined;
    INTERCEPTORS?: {
        request?: RequestInterceptor[];
        response?: ResponseInterceptor[];
    } | undefined;
};

export const OpenAPI: OpenAPIConfig = {
    BASE: 'https://app.genixsuite.com',
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
    INTERCEPTORS: { request: [], response: [] },
};
