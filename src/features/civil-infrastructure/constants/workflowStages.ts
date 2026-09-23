/**
 * The end-to-end civil work lifecycle, expressed as an ordered list of stages.
 *
 * Used to render stage-flow indicators (see `.civil-stage-flow` in civil.css)
 * and to reason about which step a work has reached. Each stage names the role
 * that owns it and the canonical status(es) that mark it complete.
 */
import type { CivilRole } from './roles';

export interface WorkflowStage {
  key: string;
  label: string;
  /** Role that performs this stage. */
  owner: CivilRole;
  /** Short description for tooltips / timelines. */
  description: string;
}

export const WORK_LIFECYCLE_STAGES: WorkflowStage[] = [
  {
    key: 'registration',
    label: 'Work Registration',
    owner: 'admin',
    description: 'Work registered with project, category and funding source.',
  },
  {
    key: 'boq',
    label: 'BOQ Compilation',
    owner: 'engineer',
    description: 'Bill of quantities compiled and baseline locked.',
  },
  {
    key: 'aa',
    label: 'Administrative Approval',
    owner: 'admin',
    description: 'Administrative approval granted within estimated cost.',
  },
  {
    key: 'ts',
    label: 'Technical Sanction',
    owner: 'admin',
    description: 'Technical sanction granted within AA amount.',
  },
  {
    key: 'budget',
    label: 'Budget Lock',
    owner: 'admin',
    description: 'Fiscal budget locked against the work.',
  },
  {
    key: 'tender',
    label: 'Tender & Award',
    owner: 'admin',
    description: 'Tender floated and awarded to the L1 agency.',
  },
  {
    key: 'workOrder',
    label: 'Work Order',
    owner: 'admin',
    description: 'Work order signed with the awarded agency.',
  },
  {
    key: 'execution',
    label: 'Execution & E-MB',
    owner: 'engineer',
    description: 'Site execution, measurements recorded in the E-MB.',
  },
  {
    key: 'billing',
    label: 'RA / Final Billing',
    owner: 'finance',
    description: 'Running-account and final bills processed and paid.',
  },
  {
    key: 'completion',
    label: 'Completion & DLP',
    owner: 'admin',
    description: 'Completion certificate issued; defect liability tracked.',
  },
];

/** Returns the index of a stage by key, or -1. */
export function stageIndex(key: string): number {
  return WORK_LIFECYCLE_STAGES.findIndex(s => s.key === key);
}
