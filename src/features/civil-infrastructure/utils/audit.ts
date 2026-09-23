/**
 * Audit-trail helpers for the Civil Infrastructure module.
 *
 * The spec requires every approval / status change to record who, when and why,
 * and to append to a per-record `statusHistory` for auditability. These helpers
 * produce those entries consistently so pages don't hand-roll them.
 */
import { todayISO } from './format';

export interface AuditEntry {
  /** Canonical or legacy status the record moved TO. */
  status: string;
  /** Actor label, e.g. "Er. Rajesh Sharma (EE)". */
  actor: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  /** ISO timestamp for precise ordering. */
  timestamp: string;
  /** Free-text remarks entered at the time of the action. */
  remarks?: string;
  /** Optional human label of the action taken, e.g. "Approved", "Rejected". */
  action?: string;
}

/** Builds a single audit entry with the current timestamp. */
export function makeAuditEntry(params: {
  status: string;
  actor: string;
  remarks?: string;
  action?: string;
}): AuditEntry {
  const now = new Date();
  return {
    status: params.status,
    actor: params.actor,
    remarks: params.remarks?.trim() || undefined,
    action: params.action,
    date: todayISO(),
    timestamp: now.toISOString(),
  };
}

/**
 * Returns a new statusHistory array with `entry` appended.
 * Tolerates a record whose existing history is missing or malformed.
 */
export function appendAudit(
  existing: AuditEntry[] | undefined | null,
  entry: AuditEntry
): AuditEntry[] {
  const base = Array.isArray(existing) ? existing : [];
  return [...base, entry];
}

/**
 * Convenience: returns a partial record patch that both sets the new status and
 * appends the audit entry to `statusHistory`.
 */
export function withStatusChange<T extends { statusHistory?: AuditEntry[] }>(
  record: T,
  params: { status: string; actor: string; remarks?: string; action?: string }
): T & { status: string; statusHistory: AuditEntry[] } {
  const entry = makeAuditEntry(params);
  return {
    ...record,
    status: params.status,
    statusHistory: appendAudit(record.statusHistory, entry),
  };
}
