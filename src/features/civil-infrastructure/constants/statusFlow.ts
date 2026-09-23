/**
 * Central status + workflow configuration for the Civil Infrastructure module.
 *
 * Per the module spec, statuses must NOT be hardcoded as loose strings scattered
 * across pages. This file is the single source of truth for:
 *   - canonical status codes
 *   - allowed transitions between them (STATUS_TRANSITIONS)
 *   - the visual variant (colour) each status maps to
 *
 * The civil module renders status chips two ways:
 *   1. the DS <StatusBadge/> (variant prop), and
 *   2. the legacy `.civil-pill <color>` CSS class (see pages/civil.css).
 * Both are covered by the maps below so pages can migrate incrementally.
 */

/** Canonical status codes used across the civil workflow. */
export type CivilStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'LOCKED'
  | 'COMPLETED'
  | 'ON_HOLD';

/** Colour buckets shared by StatusBadge + the `.civil-pill` CSS classes. */
export type CivilStatusColor =
  | 'gray'
  | 'blue'
  | 'amber'
  | 'green'
  | 'red'
  | 'purple'
  | 'teal'
  | 'orange';

/** DS StatusBadge variants (see shared/new-components/StatusBadge). */
export type StatusBadgeVariant =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'neutral'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted';

interface StatusMeta {
  /** Human-readable label. */
  label: string;
  /** civil-pill colour class. */
  color: CivilStatusColor;
  /** Nearest DS StatusBadge variant. */
  badge: StatusBadgeVariant;
}

/** Canonical status metadata (colour spec from the module brief). */
export const STATUS_META: Record<CivilStatus, StatusMeta> = {
  DRAFT: { label: 'Draft', color: 'gray', badge: 'neutral' },
  SUBMITTED: { label: 'Submitted', color: 'blue', badge: 'info' },
  UNDER_REVIEW: { label: 'Under Review', color: 'amber', badge: 'pending' },
  APPROVED: { label: 'Approved', color: 'green', badge: 'approved' },
  ACTIVE: { label: 'Active', color: 'green', badge: 'success' },
  REJECTED: { label: 'Rejected', color: 'red', badge: 'rejected' },
  LOCKED: { label: 'Locked', color: 'purple', badge: 'info' },
  COMPLETED: { label: 'Completed', color: 'teal', badge: 'success' },
  ON_HOLD: { label: 'On Hold', color: 'orange', badge: 'warning' },
};

/**
 * Allowed forward transitions per canonical status.
 * A transition not listed here is invalid and should be blocked in the UI.
 */
export const STATUS_TRANSITIONS: Record<CivilStatus, CivilStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED', 'ON_HOLD'],
  APPROVED: ['ACTIVE', 'LOCKED'],
  ACTIVE: ['ON_HOLD', 'COMPLETED', 'LOCKED'],
  ON_HOLD: ['ACTIVE', 'REJECTED'],
  LOCKED: ['ACTIVE', 'COMPLETED'],
  REJECTED: ['DRAFT'],
  COMPLETED: [],
};

/** Returns true if `to` is a permitted transition from `from`. */
export function canTransition(from: CivilStatus, to: CivilStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Maps ANY status string — canonical code or a legacy ad-hoc label used by the
 * existing pages — to a civil-pill colour. Falls back to 'gray'.
 */
const LEGACY_COLOR_MAP: Record<string, CivilStatusColor> = {
  // Work registration / approval chain
  registered: 'gray',
  'requirement generated': 'amber',
  'aa approved': 'green',
  'administrative approval': 'green',
  'ts granted': 'green',
  'technical sanction': 'green',
  'budget locked': 'purple',
  // Generic workflow
  draft: 'gray',
  submitted: 'blue',
  'under review': 'amber',
  'pending admin action': 'amber',
  'pending admin approval': 'amber',
  'pending sign-off': 'amber',
  'in progress': 'blue',
  approved: 'green',
  'approved by admin': 'green',
  active: 'green',
  'in service': 'green',
  'dlp active': 'green',
  'certificate issued': 'green',
  'payment released': 'green',
  settled: 'green',
  completed: 'teal',
  rejected: 'red',
  'rejected by admin': 'red',
  delayed: 'red',
  'quality fail': 'red',
  locked: 'purple',
  'on hold': 'orange',
  suspended: 'orange',
};

export function statusColor(
  status: string | undefined | null
): CivilStatusColor {
  if (!status) return 'gray';
  const key = String(status).toLowerCase().trim();
  if (key in STATUS_META) return STATUS_META[key as CivilStatus].color;
  return LEGACY_COLOR_MAP[key] ?? 'gray';
}

/** Maps any status string to the nearest DS StatusBadge variant. */
export function statusBadgeVariant(
  status: string | undefined | null
): StatusBadgeVariant {
  const color = statusColor(status);
  switch (color) {
    case 'green':
    case 'teal':
      return 'approved';
    case 'red':
      return 'rejected';
    case 'amber':
    case 'orange':
      return 'pending';
    case 'blue':
      return 'info';
    case 'purple':
      return 'info';
    default:
      return 'neutral';
  }
}
