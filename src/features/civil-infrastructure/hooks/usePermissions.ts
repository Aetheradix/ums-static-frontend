import { useMemo } from 'react';
import type { CivilRole } from '../constants/roles';
import { useRole } from './useRole';

/**
 * Which civil roles may perform each high-level action.
 *
 * RBAC is inert app-wide (hasPermission() returns true), so this is a UI-shaping
 * helper: it decides which actions/buttons a portal should surface, keeping that
 * logic out of individual pages. It is NOT a security boundary.
 */
export type CivilAction =
  | 'registerWork'
  | 'grantAA'
  | 'grantTS'
  | 'lockBudget'
  | 'manageTender'
  | 'signWorkOrder'
  | 'approveEOT'
  | 'issueCompletionCertificate'
  | 'approveMilestone'
  | 'compileBOQ'
  | 'enterMB'
  | 'recordQuality'
  | 'logProgress'
  | 'processRABill'
  | 'settleFinalBill'
  | 'releasePayment'
  | 'requestMilestoneSignoff'
  | 'requestCC'
  | 'requestEOT';

const ACTION_ROLES: Record<CivilAction, CivilRole[]> = {
  registerWork: ['admin'],
  grantAA: ['admin'],
  grantTS: ['admin'],
  lockBudget: ['admin'],
  manageTender: ['admin'],
  signWorkOrder: ['admin'],
  approveEOT: ['admin'],
  issueCompletionCertificate: ['admin'],
  approveMilestone: ['admin'],
  compileBOQ: ['admin', 'engineer'],
  enterMB: ['engineer'],
  recordQuality: ['engineer'],
  logProgress: ['engineer'],
  processRABill: ['finance'],
  settleFinalBill: ['finance'],
  releasePayment: ['finance', 'admin'],
  requestMilestoneSignoff: ['vendor', 'engineer'],
  requestCC: ['vendor', 'engineer'],
  requestEOT: ['vendor', 'engineer'],
};

export function usePermissions() {
  const { role } = useRole();

  const can = useMemo(
    () =>
      (action: CivilAction): boolean => {
        if (!role) return true; // portal not resolvable → don't hide anything
        return ACTION_ROLES[action]?.includes(role) ?? false;
      },
    [role]
  );

  return { role, can };
}
