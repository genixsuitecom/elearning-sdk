/**
 * Consumer-facing type aliases for export customization fields.
 *
 * These are intentionally `unknown` to avoid leaking `any` into the public API
 * while allowing consumers to define their own strongly-typed template/theme
 * structures in their applications.
 */
export type ExportTemplate = unknown;
export type ExportTheme = unknown;
export type ExportOptions = Record<string, unknown>;


