/**
 * Shared civil-infrastructure components barrel.
 *
 * These wrap the app-wide design system (shared/new-components) with the
 * module-specific behaviour the spec requires: central status colouring,
 * approval timelines, validated document uploads and empty states.
 */
export { default as ApprovalTimeline } from './ApprovalTimeline';
export { default as CivilStatusBadge } from './CivilStatusBadge';
export { default as DocumentUploader } from './DocumentUploader';
export { default as EmptyState } from './EmptyState';
export type { CivilDocument } from './DocumentUploader';
