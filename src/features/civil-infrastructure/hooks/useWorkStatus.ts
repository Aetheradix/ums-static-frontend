import { useCallback } from 'react';
import {
  type CivilStatus,
  STATUS_META,
  STATUS_TRANSITIONS,
  canTransition,
  statusBadgeVariant,
  statusColor,
} from '../constants/statusFlow';

/**
 * Helpers for reading and validating civil work status transitions against the
 * central STATUS_TRANSITIONS config. Pure/stateless — the actual persistence
 * still happens through civilStorage in each page.
 */
export function useWorkStatus() {
  const nextStatuses = useCallback(
    (from: CivilStatus): CivilStatus[] => STATUS_TRANSITIONS[from] ?? [],
    []
  );

  const isAllowed = useCallback(
    (from: CivilStatus, to: CivilStatus): boolean => canTransition(from, to),
    []
  );

  const meta = useCallback((status: CivilStatus) => STATUS_META[status], []);

  return {
    nextStatuses,
    isAllowed,
    meta,
    color: statusColor,
    badgeVariant: statusBadgeVariant,
  };
}
