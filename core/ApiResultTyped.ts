/**
 * Consumer-facing typed API result wrapper.
 *
 * This is a thin generic alias that mirrors the generated ApiResult shape
 * but provides a typed `body` field. The generated files continue to use
 * their own `ApiResult` with `unknown` body for internal plumbing.
 */
export type ApiResult<T = unknown> = {
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly headers?: Record<string, string>;
    readonly body: T;
};

/**
 * Typed ApiResult wrapper for SDK public surface.
 *
 * Do not modify the generated `core/ApiResult.ts`. Use this type instead
 * anywhere we need a safe, generic shape for HTTP results with a typed body.
 */
export type ApiResultTyped<T = unknown> = {
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly headers?: Record<string, string>;
    readonly body: T;
};


