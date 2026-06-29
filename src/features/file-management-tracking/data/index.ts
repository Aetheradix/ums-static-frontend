// ─── Core Master Data ───

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  roleName: string;
  departmentId?: number;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FileCategory {
  id: number;
  name: string;
  description?: string;
}

export interface FilePriority {
  id: number;
  name: string;
  level: number;
}

export interface ConfidentialityLevel {
  id: number;
  name: string;
  description?: string;
}

export interface FileType {
  id: number;
  title: string;
  shortCode: string;
  description?: string;
  isActive: boolean;
}

export type DiaryScope = 'Global' | 'OU-Wise';

export interface DiaryTemplate {
  id: number;
  scope: DiaryScope;
  departmentId?: number;
  departmentName?: string;
  ouCode: string;
  userDefinedVar1?: string;
  userDefinedVar2?: string;
  userDefinedVar3?: string;
  separatorChar: string;
  includeYear: boolean;
  includeMonth: boolean;
  isActive: boolean;
}

export type ModeOfReceipt = 'Physical' | 'Email' | 'Post' | 'Courier' | 'Other';
export type DakStatus = 'Registered' | 'Processed' | 'LinkedToFile';

export interface DAKReceipt {
  id: number;
  diaryNumber: string;
  receivedDate: string;
  senderName: string;
  senderAddress?: string;
  senderContact?: string;
  subject: string;
  modeOfReceipt: ModeOfReceipt;
  description?: string;
  assignedDepartmentId?: number;
  assignedDepartmentName?: string;
  assignedToUserId?: number;
  assignedToUserName?: string;
  scannedCopyUrl?: string;
  status: DakStatus;
  createdBy: number;
  createdByName: string;
  createdAt: string;
}

export type FileStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Forwarded'
  | 'Returned for Clarification'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Archived'
  | 'On Hold'
  | 'Kept in Abeyance';

export interface File {
  id: number;
  fileNumber: string;
  quickAccessCode: string;
  title: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  departmentId: number;
  departmentName: string;
  priorityId: number;
  priorityName: string;
  confidentialityId: number;
  confidentialityName: string;
  fileTypeId: number;
  fileTypeName: string;
  currentHolderUserId?: number | null;
  currentHolderUserName?: string;
  currentStatus: FileStatus;
  workflowId?: number;
  workflowName?: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  linkedDakId?: number;
  archivedAt?: string;
  retentionPeriodYears?: number;
  isLocked: boolean;
  isConfidential: boolean;
  isAbeyance: boolean;
  parentFileId?: number;
  parentFileNumber?: string;
  mergedIntoFileId?: number;
  mergedIntoFileNumber?: string;
}

export type FileMovementAction =
  | 'Created'
  | 'Forwarded'
  | 'Approved'
  | 'Rejected'
  | 'Sent Back'
  | 'Escalated'
  | 'Put On Hold'
  | 'Reassigned'
  | 'Closed'
  | 'Archived'
  | 'Accepted Hard Copy'
  | 'Revoked';

export type SlaStatus = 'OnTrack' | 'Approaching' | 'Violated';

export interface FileMovement {
  id: number;
  fileId: number;
  fileNumber: string;
  fromUserId?: number;
  fromUserName?: string;
  toUserId?: number | null;
  toUserName?: string;
  action: FileMovementAction;
  remarks?: string;
  actionDate: string;
  supportingDocumentUrl?: string;
  digitalSignatureData?: string;
  slaStatus?: SlaStatus;
  daysPending?: number;
}

export interface FileAttachment {
  id: number;
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileExtension: string;
  fileSizeKb: number;
  version: number;
  uploadedBy: number;
  uploadedByName: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface DigitalNoting {
  id: number;
  fileId: number;
  notingContent: string;
  notedBy: number;
  notedByName: string;
  notedAt: string;
  digitalSignatureData?: string;
}

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  departmentId?: number;
  departmentName?: string;
  categoryId?: number;
  categoryName?: string;
  isActive: boolean;
  createdBy: number;
  createdByName: string;
  createdAt: string;
}

export interface WorkflowStep {
  id: number;
  workflowId: number;
  workflowName: string;
  stepSequence: number;
  approverRoleId?: number;
  approverRoleName?: string;
  approverUserId?: number;
  approverUserName?: string;
  stepName: string;
  isMandatory: boolean;
}

export interface SLA {
  id: number;
  workflowStepId: number;
  stepName: string;
  expectedCompletionHours: number;
  warningThresholdHours?: number;
}

export type EscalationActionType =
  | 'ReminderEmail'
  | 'EscalateToRole'
  | 'EscalateToUser'
  | 'MarkOverdue';

export interface EscalationRule {
  id: number;
  workflowStepId: number;
  stepName: string;
  delayHours: number;
  actionType: EscalationActionType;
  targetRoleId?: number;
  targetRoleName?: string;
  targetUserId?: number;
  targetUserName?: string;
  notificationTemplate?: string;
}

export interface RetentionPolicy {
  id: number;
  recordType: string;
  retentionPeriodYears: number;
  description?: string;
}

export type NotificationType =
  | 'FileAssigned'
  | 'FileApproved'
  | 'FileRejected'
  | 'FileReturned'
  | 'FileOverdue'
  | 'DAKAssigned';
export type NotificationChannel = 'InApp' | 'Email' | 'SMS';

export interface Notification {
  id: number;
  recipientUserId: number;
  recipientUserName: string;
  type: NotificationType;
  message: string;
  fileId?: number;
  fileNumber?: string;
  dakId?: number;
  diaryNumber?: string;
  isRead: boolean;
  sentVia: NotificationChannel;
  createdAt: string;
}

export type AuditLogAction =
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'DOWNLOAD'
  | 'APPROVE'
  | 'REJECT'
  | 'FORWARD'
  | 'LOCK'
  | 'UNLOCK'
  | 'REVOKE'
  | 'ABEYANCE';

export interface AuditLog {
  id: number;
  tableName: string;
  recordId?: number;
  action: AuditLogAction;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  performedBy: number;
  performedByName: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ─── Mock Data ───

export const mockRoles: Role[] = [
  { id: 1, name: 'System Administrator', description: 'Full system access' },
  {
    id: 2,
    name: 'Department Clerk',
    description: 'Prepares and forwards files',
  },
  { id: 3, name: 'Department Head', description: 'Reviews and approves files' },
  { id: 4, name: 'Finance Officer', description: 'Financial verification' },
  { id: 5, name: 'Registrar', description: 'Final approvals' },
  { id: 6, name: 'Vice Chancellor', description: 'High-level approvals' },
  { id: 7, name: 'Employee', description: 'Creates and tracks own files' },
];

export const mockDepartments: Department[] = [
  { id: 1, name: 'Computer Science', code: 'CS', isActive: true },
  { id: 2, name: 'Mathematics', code: 'MTH', isActive: true },
  { id: 3, name: 'Physics', code: 'PHY', isActive: true },
  { id: 4, name: 'Administration', code: 'ADMIN', isActive: true },
  { id: 5, name: 'Finance', code: 'FIN', isActive: true },
  { id: 6, name: 'Examination', code: 'EXAM', isActive: true },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@univ.edu',
    roleId: 1,
    roleName: 'System Administrator',
    departmentId: 4,
    departmentName: 'Administration',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    email: 'rajesh@univ.edu',
    roleId: 2,
    roleName: 'Department Clerk',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@univ.edu',
    roleId: 2,
    roleName: 'Department Clerk',
    departmentId: 2,
    departmentName: 'Mathematics',
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Dr. Verma',
    email: 'verma@univ.edu',
    roleId: 3,
    roleName: 'Department Head',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 5,
    name: 'Dr. Gupta',
    email: 'gupta@univ.edu',
    roleId: 3,
    roleName: 'Department Head',
    departmentId: 2,
    departmentName: 'Mathematics',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 6,
    name: 'Suresh Iyer',
    email: 'suresh@univ.edu',
    roleId: 4,
    roleName: 'Finance Officer',
    departmentId: 5,
    departmentName: 'Finance',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 7,
    name: 'Registrar Office',
    email: 'registrar@univ.edu',
    roleId: 5,
    roleName: 'Registrar',
    departmentId: 4,
    departmentName: 'Administration',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 8,
    name: 'Vice Chancellor',
    email: 'vc@univ.edu',
    roleId: 6,
    roleName: 'Vice Chancellor',
    departmentId: 4,
    departmentName: 'Administration',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 9,
    name: 'Amit Singh',
    email: 'amit@univ.edu',
    roleId: 7,
    roleName: 'Employee',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-03-01',
  },
  {
    id: 10,
    name: 'Neha Patel',
    email: 'neha@univ.edu',
    roleId: 7,
    roleName: 'Employee',
    departmentId: 2,
    departmentName: 'Mathematics',
    isActive: true,
    createdAt: '2024-03-15',
  },
];

export const mockFileCategories: FileCategory[] = [
  {
    id: 1,
    name: 'Administrative',
    description: 'General administrative files',
  },
  { id: 2, name: 'Academic', description: 'Academic-related files' },
  { id: 3, name: 'Student Services', description: 'Student-related files' },
  { id: 4, name: 'Finance', description: 'Financial files' },
  { id: 5, name: 'Examination', description: 'Examination-related files' },
  {
    id: 6,
    name: 'Infrastructure',
    description: 'Infrastructure and facility files',
  },
];

export const mockFilePriorities: FilePriority[] = [
  { id: 1, name: 'Low', level: 1 },
  { id: 2, name: 'Medium', level: 2 },
  { id: 3, name: 'High', level: 3 },
  { id: 4, name: 'Urgent', level: 4 },
];

export const mockConfidentialityLevels: ConfidentialityLevel[] = [
  { id: 1, name: 'Public', description: 'Accessible to all' },
  { id: 2, name: 'Internal', description: 'Internal department use' },
  { id: 3, name: 'Confidential', description: 'Restricted access' },
  { id: 4, name: 'Restricted', description: 'Highly restricted' },
];

export const mockFileTypes: FileType[] = [
  {
    id: 1,
    title: 'Notice',
    shortCode: 'NOT',
    description: 'Official notices',
    isActive: true,
  },
  {
    id: 2,
    title: 'Office Order',
    shortCode: 'OO',
    description: 'Office orders',
    isActive: true,
  },
  {
    id: 3,
    title: 'Circular',
    shortCode: 'CIR',
    description: 'Circulars',
    isActive: true,
  },
  {
    id: 4,
    title: 'Proposal',
    shortCode: 'PRO',
    description: 'Proposals',
    isActive: true,
  },
  {
    id: 5,
    title: 'Report',
    shortCode: 'RPT',
    description: 'Reports',
    isActive: true,
  },
  {
    id: 6,
    title: 'Application',
    shortCode: 'APP',
    description: 'Applications',
    isActive: true,
  },
];

export const mockDiaryTemplates: DiaryTemplate[] = [
  {
    id: 1,
    scope: 'Global',
    ouCode: 'UMS',
    separatorChar: '/',
    includeYear: true,
    includeMonth: true,
    userDefinedVar1: 'FMTS',
    isActive: true,
  },
  {
    id: 2,
    scope: 'OU-Wise',
    departmentId: 1,
    departmentName: 'Computer Science',
    ouCode: 'CS',
    separatorChar: '/',
    includeYear: true,
    includeMonth: false,
    isActive: true,
  },
  {
    id: 3,
    scope: 'OU-Wise',
    departmentId: 5,
    departmentName: 'Finance',
    ouCode: 'FIN',
    separatorChar: '-',
    includeYear: true,
    includeMonth: true,
    isActive: true,
  },
];

export const mockRetentionPolicies: RetentionPolicy[] = [
  {
    id: 1,
    recordType: 'Student Certificates',
    retentionPeriodYears: 0,
    description: 'Permanent retention',
  },
  {
    id: 2,
    recordType: 'Examination Records',
    retentionPeriodYears: 0,
    description: 'Permanent retention',
  },
  {
    id: 3,
    recordType: 'Purchase Files',
    retentionPeriodYears: 10,
    description: '10 years retention',
  },
  {
    id: 4,
    recordType: 'Leave Applications',
    retentionPeriodYears: 5,
    description: '5 years retention',
  },
  {
    id: 5,
    recordType: 'Meeting Minutes',
    retentionPeriodYears: 0,
    description: 'Permanent retention',
  },
];

// ─── DAK Receipts ───

export const mockDAKReceipts: DAKReceipt[] = [
  {
    id: 1,
    diaryNumber: 'DAK/2026/00001',
    receivedDate: '2026-06-01 09:30',
    senderName: 'UGC Office',
    senderAddress: 'New Delhi',
    subject: 'Grant approval letter for research project',
    modeOfReceipt: 'Post',
    assignedDepartmentId: 5,
    assignedDepartmentName: 'Finance',
    assignedToUserId: 6,
    assignedToUserName: 'Suresh Iyer',
    status: 'Processed',
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-06-01 09:35',
  },
  {
    id: 2,
    diaryNumber: 'DAK/2026/00002',
    receivedDate: '2026-06-03 11:00',
    senderName: 'AICTE',
    senderAddress: 'Bangalore',
    subject: 'Approval for new course curriculum',
    modeOfReceipt: 'Email',
    status: 'Registered',
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-06-03 11:05',
  },
  {
    id: 3,
    diaryNumber: 'DAK/2026/00003',
    receivedDate: '2026-06-05 14:15',
    senderName: 'Finance Department',
    subject: 'Budget allocation for 2026-27',
    modeOfReceipt: 'Physical',
    assignedDepartmentId: 5,
    assignedDepartmentName: 'Finance',
    assignedToUserId: 6,
    assignedToUserName: 'Suresh Iyer',
    status: 'LinkedToFile',
    createdBy: 2,
    createdByName: 'Rajesh Kumar',
    createdAt: '2026-06-05 14:20',
  },
  {
    id: 4,
    diaryNumber: 'DAK/2026/00004',
    receivedDate: '2026-06-10 10:00',
    senderName: 'Parent Association',
    subject: 'Request for fee revision committee',
    modeOfReceipt: 'Email',
    assignedDepartmentId: 4,
    assignedDepartmentName: 'Administration',
    status: 'Registered',
    createdBy: 3,
    createdByName: 'Priya Sharma',
    createdAt: '2026-06-10 10:10',
  },
  {
    id: 5,
    diaryNumber: 'DAK/2026/00005',
    receivedDate: '2026-06-12 16:30',
    senderName: 'Examination Branch',
    subject: 'Semester exam schedule proposal',
    modeOfReceipt: 'Post',
    assignedDepartmentId: 6,
    assignedDepartmentName: 'Examination',
    status: 'Processed',
    createdBy: 2,
    createdByName: 'Rajesh Kumar',
    createdAt: '2026-06-12 16:35',
  },
];

// ─── Workflows ───

export const mockWorkflows: Workflow[] = [
  {
    id: 1,
    name: 'Purchase Approval Workflow',
    description: 'For purchase-related files',
    departmentId: 5,
    departmentName: 'Finance',
    isActive: true,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    name: 'Leave Application Workflow',
    description: 'For leave applications',
    isActive: true,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-01-01',
  },
  {
    id: 3,
    name: 'Student Request Workflow',
    description: 'For student-related requests',
    isActive: true,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-01-01',
  },
  {
    id: 4,
    name: 'General Admin Workflow',
    description: 'For general administrative files',
    isActive: true,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2026-01-01',
  },
];

export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: 1,
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    stepSequence: 1,
    approverRoleId: 3,
    approverRoleName: 'Department Head',
    stepName: 'HOD Approval',
    isMandatory: true,
  },
  {
    id: 2,
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    stepSequence: 2,
    approverRoleId: 4,
    approverRoleName: 'Finance Officer',
    stepName: 'Finance Review',
    isMandatory: true,
  },
  {
    id: 3,
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    stepSequence: 3,
    approverRoleId: 5,
    approverRoleName: 'Registrar',
    stepName: 'Registrar Approval',
    isMandatory: true,
  },
  {
    id: 4,
    workflowId: 2,
    workflowName: 'Leave Application Workflow',
    stepSequence: 1,
    approverRoleId: 3,
    approverRoleName: 'Department Head',
    stepName: 'HOD Approval',
    isMandatory: true,
  },
  {
    id: 5,
    workflowId: 3,
    workflowName: 'Student Request Workflow',
    stepSequence: 1,
    approverRoleId: 3,
    approverRoleName: 'Department Head',
    stepName: 'HOD Review',
    isMandatory: true,
  },
  {
    id: 6,
    workflowId: 3,
    workflowName: 'Student Request Workflow',
    stepSequence: 2,
    approverRoleId: 5,
    approverRoleName: 'Registrar',
    stepName: 'Registrar Approval',
    isMandatory: true,
  },
  {
    id: 7,
    workflowId: 4,
    workflowName: 'General Admin Workflow',
    stepSequence: 1,
    approverRoleId: 3,
    approverRoleName: 'Department Head',
    stepName: 'HOD Review',
    isMandatory: true,
  },
];

export const mockSLAs: SLA[] = [
  {
    id: 1,
    workflowStepId: 1,
    stepName: 'HOD Approval',
    expectedCompletionHours: 48,
    warningThresholdHours: 24,
  },
  {
    id: 2,
    workflowStepId: 2,
    stepName: 'Finance Review',
    expectedCompletionHours: 72,
    warningThresholdHours: 48,
  },
  {
    id: 3,
    workflowStepId: 3,
    stepName: 'Registrar Approval',
    expectedCompletionHours: 48,
    warningThresholdHours: 24,
  },
  {
    id: 4,
    workflowStepId: 4,
    stepName: 'HOD Approval',
    expectedCompletionHours: 24,
    warningThresholdHours: 12,
  },
];

export const mockEscalationRules: EscalationRule[] = [
  {
    id: 1,
    workflowStepId: 1,
    stepName: 'HOD Approval',
    delayHours: 48,
    actionType: 'ReminderEmail',
    notificationTemplate: 'Reminder: File pending for HOD approval',
  },
  {
    id: 2,
    workflowStepId: 1,
    stepName: 'HOD Approval',
    delayHours: 72,
    actionType: 'EscalateToRole',
    targetRoleId: 5,
    targetRoleName: 'Registrar',
    notificationTemplate: 'Escalated: HOD approval pending beyond SLA',
  },
  {
    id: 3,
    workflowStepId: 2,
    stepName: 'Finance Review',
    delayHours: 72,
    actionType: 'ReminderEmail',
    notificationTemplate: 'Reminder: File pending for finance review',
  },
  {
    id: 4,
    workflowStepId: 2,
    stepName: 'Finance Review',
    delayHours: 96,
    actionType: 'EscalateToUser',
    targetUserId: 7,
    targetUserName: 'Registrar Office',
  },
];

// ─── Files (eFile) ───

const now = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ');

const makeDate = (daysAgo: number, hours = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hours);
  return fmt(d);
};

const makeDueDate = (daysFromNow: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  return fmt(d);
};

export const mockFiles: File[] = [
  {
    id: 1,
    fileNumber: 'UMS/CS/2026/001',
    quickAccessCode: 'FMTS-A1B2C',
    title: 'Purchase Request for Lab Equipment',
    description: 'Request to purchase 20 new computers for CS lab',
    categoryId: 4,
    categoryName: 'Finance',
    departmentId: 1,
    departmentName: 'Computer Science',
    priorityId: 3,
    priorityName: 'High',
    confidentialityId: 2,
    confidentialityName: 'Internal',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 4,
    currentHolderUserName: 'Dr. Verma',
    currentStatus: 'Under Review',
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    createdBy: 9,
    createdByName: 'Amit Singh',
    createdAt: makeDate(10),
    updatedAt: makeDate(1),
    dueDate: makeDueDate(5),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 2,
    fileNumber: 'UMS/CS/2026/002',
    quickAccessCode: 'FMTS-D3E4F',
    title: 'Leave Application - Annual Leave',
    description: 'Annual leave request for 15 days',
    categoryId: 1,
    categoryName: 'Administrative',
    departmentId: 1,
    departmentName: 'Computer Science',
    priorityId: 1,
    priorityName: 'Low',
    confidentialityId: 1,
    confidentialityName: 'Public',
    fileTypeId: 6,
    fileTypeName: 'Application',
    currentHolderUserId: 4,
    currentHolderUserName: 'Dr. Verma',
    currentStatus: 'Approved',
    workflowId: 2,
    workflowName: 'Leave Application Workflow',
    createdBy: 9,
    createdByName: 'Amit Singh',
    createdAt: makeDate(15),
    updatedAt: makeDate(5),
    dueDate: makeDueDate(-5),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 3,
    fileNumber: 'UMS/MTH/2026/001',
    quickAccessCode: 'FMTS-G5H6I',
    title: 'Curriculum Revision Proposal',
    description: 'Proposal to revise M.Sc. Mathematics curriculum',
    categoryId: 2,
    categoryName: 'Academic',
    departmentId: 2,
    departmentName: 'Mathematics',
    priorityId: 3,
    priorityName: 'High',
    confidentialityId: 2,
    confidentialityName: 'Internal',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 7,
    currentHolderUserName: 'Registrar Office',
    currentStatus: 'Forwarded',
    workflowId: 3,
    workflowName: 'Student Request Workflow',
    createdBy: 10,
    createdByName: 'Neha Patel',
    createdAt: makeDate(8),
    updatedAt: makeDate(2),
    dueDate: makeDueDate(3),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 4,
    fileNumber: 'UMS/ADMIN/2026/001',
    quickAccessCode: 'FMTS-J7K8L',
    title: 'Annual Report 2025-26',
    description: 'Draft annual report for university',
    categoryId: 1,
    categoryName: 'Administrative',
    departmentId: 4,
    departmentName: 'Administration',
    priorityId: 2,
    priorityName: 'Medium',
    confidentialityId: 1,
    confidentialityName: 'Public',
    fileTypeId: 5,
    fileTypeName: 'Report',
    currentHolderUserId: 8,
    currentHolderUserName: 'Vice Chancellor',
    currentStatus: 'Under Review',
    workflowId: 4,
    workflowName: 'General Admin Workflow',
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: makeDate(20),
    updatedAt: makeDate(3),
    dueDate: makeDueDate(7),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 5,
    fileNumber: 'UMS/FIN/2026/001',
    quickAccessCode: 'FMTS-M9N0O',
    title: 'Budget Proposal 2026-27',
    description: 'Annual budget proposal for all departments',
    categoryId: 4,
    categoryName: 'Finance',
    departmentId: 5,
    departmentName: 'Finance',
    priorityId: 4,
    priorityName: 'Urgent',
    confidentialityId: 3,
    confidentialityName: 'Confidential',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 8,
    currentHolderUserName: 'Vice Chancellor',
    currentStatus: 'Under Review',
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    createdBy: 6,
    createdByName: 'Suresh Iyer',
    createdAt: makeDate(5),
    updatedAt: makeDate(1),
    dueDate: makeDueDate(2),
    isLocked: false,
    isConfidential: true,
    isAbeyance: false,
  },
  {
    id: 6,
    fileNumber: 'UMS/CS/2026/003',
    quickAccessCode: 'FMTS-P1Q2R',
    title: 'Student Internship Request',
    description: 'Request for internship program approval',
    categoryId: 3,
    categoryName: 'Student Services',
    departmentId: 1,
    departmentName: 'Computer Science',
    priorityId: 2,
    priorityName: 'Medium',
    confidentialityId: 1,
    confidentialityName: 'Public',
    fileTypeId: 6,
    fileTypeName: 'Application',
    currentHolderUserId: null,
    currentStatus: 'Closed',
    workflowId: 3,
    workflowName: 'Student Request Workflow',
    createdBy: 9,
    createdByName: 'Amit Singh',
    createdAt: makeDate(30),
    updatedAt: makeDate(25),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 7,
    fileNumber: 'UMS/MTH/2026/002',
    quickAccessCode: 'FMTS-S3T4U',
    title: 'Faculty Recruitment Proposal',
    description: 'Proposal to hire 3 new faculty members',
    categoryId: 1,
    categoryName: 'Administrative',
    departmentId: 2,
    departmentName: 'Mathematics',
    priorityId: 3,
    priorityName: 'High',
    confidentialityId: 3,
    confidentialityName: 'Confidential',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 5,
    currentHolderUserName: 'Dr. Gupta',
    currentStatus: 'Returned for Clarification',
    workflowId: 4,
    workflowName: 'General Admin Workflow',
    createdBy: 10,
    createdByName: 'Neha Patel',
    createdAt: makeDate(12),
    updatedAt: makeDate(3),
    dueDate: makeDueDate(4),
    isLocked: false,
    isConfidential: true,
    isAbeyance: false,
  },
  {
    id: 8,
    fileNumber: 'UMS/EXAM/2026/001',
    quickAccessCode: 'FMTS-V5W6X',
    title: 'Exam Schedule Approval',
    description: 'Final exam schedule for even semester',
    categoryId: 5,
    categoryName: 'Examination',
    departmentId: 6,
    departmentName: 'Examination',
    priorityId: 4,
    priorityName: 'Urgent',
    confidentialityId: 2,
    confidentialityName: 'Internal',
    fileTypeId: 3,
    fileTypeName: 'Circular',
    currentHolderUserId: 7,
    currentHolderUserName: 'Registrar Office',
    currentStatus: 'Forwarded',
    workflowId: 4,
    workflowName: 'General Admin Workflow',
    createdBy: 2,
    createdByName: 'Rajesh Kumar',
    createdAt: makeDate(3),
    updatedAt: makeDate(1),
    dueDate: makeDueDate(1),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 9,
    fileNumber: 'UMS/CS/2026/004',
    quickAccessCode: 'FMTS-Y7Z8A',
    title: 'Software License Renewal',
    description: 'Renewal of MATLAB and SPSS licenses',
    categoryId: 4,
    categoryName: 'Finance',
    departmentId: 1,
    departmentName: 'Computer Science',
    priorityId: 3,
    priorityName: 'High',
    confidentialityId: 2,
    confidentialityName: 'Internal',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 6,
    currentHolderUserName: 'Suresh Iyer',
    currentStatus: 'Under Review',
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    createdBy: 9,
    createdByName: 'Amit Singh',
    createdAt: makeDate(7),
    updatedAt: makeDate(2),
    dueDate: makeDueDate(5),
    isLocked: true,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 10,
    fileNumber: 'UMS/ADMIN/2026/002',
    quickAccessCode: 'FMTS-B9C0D',
    title: 'Committee Formation Order',
    description: 'Formation of anti-ragging committee',
    categoryId: 1,
    categoryName: 'Administrative',
    departmentId: 4,
    departmentName: 'Administration',
    priorityId: 2,
    priorityName: 'Medium',
    confidentialityId: 1,
    confidentialityName: 'Public',
    fileTypeId: 2,
    fileTypeName: 'Office Order',
    currentHolderUserId: null,
    currentStatus: 'Draft',
    workflowId: 4,
    workflowName: 'General Admin Workflow',
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: makeDate(1),
    updatedAt: makeDate(1),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
  {
    id: 11,
    fileNumber: 'UMS/CS/2026/005',
    quickAccessCode: 'FMTS-E1F2G',
    title: 'Research Lab Expansion',
    description: 'Proposal for expanding AI research lab',
    categoryId: 6,
    categoryName: 'Infrastructure',
    departmentId: 1,
    departmentName: 'Computer Science',
    priorityId: 3,
    priorityName: 'High',
    confidentialityId: 3,
    confidentialityName: 'Confidential',
    fileTypeId: 4,
    fileTypeName: 'Proposal',
    currentHolderUserId: 9,
    currentHolderUserName: 'Amit Singh',
    currentStatus: 'Kept in Abeyance',
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    createdBy: 9,
    createdByName: 'Amit Singh',
    createdAt: makeDate(14),
    updatedAt: makeDate(6),
    dueDate: makeDueDate(10),
    isLocked: false,
    isConfidential: true,
    isAbeyance: true,
  },
  {
    id: 12,
    fileNumber: 'UMS/FIN/2026/002',
    quickAccessCode: 'FMTS-H3I4J',
    title: 'Travel Allowance Claim',
    description: 'TA claim for conference attendance',
    categoryId: 4,
    categoryName: 'Finance',
    departmentId: 5,
    departmentName: 'Finance',
    priorityId: 2,
    priorityName: 'Medium',
    confidentialityId: 2,
    confidentialityName: 'Internal',
    fileTypeId: 6,
    fileTypeName: 'Application',
    currentHolderUserId: 6,
    currentHolderUserName: 'Suresh Iyer',
    currentStatus: 'Rejected',
    workflowId: 1,
    workflowName: 'Purchase Approval Workflow',
    createdBy: 10,
    createdByName: 'Neha Patel',
    createdAt: makeDate(20),
    updatedAt: makeDate(15),
    isLocked: false,
    isConfidential: false,
    isAbeyance: false,
  },
];

export const mockFileMovements: FileMovement[] = [
  {
    id: 1,
    fileId: 1,
    fileNumber: 'UMS/CS/2026/001',
    fromUserId: 9,
    fromUserName: 'Amit Singh',
    toUserId: 4,
    toUserName: 'Dr. Verma',
    action: 'Forwarded',
    remarks: 'For HOD review and approval',
    actionDate: makeDate(8),
    slaStatus: 'OnTrack',
    daysPending: 7,
  },
  {
    id: 2,
    fileId: 2,
    fileNumber: 'UMS/CS/2026/002',
    fromUserId: 9,
    fromUserName: 'Amit Singh',
    toUserId: 4,
    toUserName: 'Dr. Verma',
    action: 'Forwarded',
    remarks: 'Leave application for approval',
    actionDate: makeDate(12),
    slaStatus: 'OnTrack',
    daysPending: 3,
  },
  {
    id: 3,
    fileId: 2,
    fileNumber: 'UMS/CS/2026/002',
    fromUserId: 4,
    fromUserName: 'Dr. Verma',
    toUserId: 9,
    toUserName: 'Amit Singh',
    action: 'Approved',
    remarks: 'Leave approved. Enjoy your break!',
    actionDate: makeDate(5),
  },
  {
    id: 4,
    fileId: 3,
    fileNumber: 'UMS/MTH/2026/001',
    fromUserId: 10,
    fromUserName: 'Neha Patel',
    toUserId: 5,
    toUserName: 'Dr. Gupta',
    action: 'Forwarded',
    remarks: 'Curriculum revision proposal for review',
    actionDate: makeDate(6),
    slaStatus: 'OnTrack',
    daysPending: 4,
  },
  {
    id: 5,
    fileId: 3,
    fileNumber: 'UMS/MTH/2026/001',
    fromUserId: 5,
    fromUserName: 'Dr. Gupta',
    toUserId: 7,
    toUserName: 'Registrar Office',
    action: 'Forwarded',
    remarks: 'Recommended for approval. Curriculum meets standards.',
    actionDate: makeDate(2),
    slaStatus: 'OnTrack',
    daysPending: 2,
  },
  {
    id: 6,
    fileId: 4,
    fileNumber: 'UMS/ADMIN/2026/001',
    fromUserId: 1,
    fromUserName: 'Admin User',
    toUserId: 7,
    toUserName: 'Registrar Office',
    action: 'Forwarded',
    remarks: 'Draft annual report for review',
    actionDate: makeDate(15),
  },
  {
    id: 7,
    fileId: 4,
    fileNumber: 'UMS/ADMIN/2026/001',
    fromUserId: 7,
    fromUserName: 'Registrar Office',
    toUserId: 8,
    toUserName: 'Vice Chancellor',
    action: 'Forwarded',
    remarks: 'Reviewed and recommended for VC approval',
    actionDate: makeDate(3),
    slaStatus: 'Approaching',
    daysPending: 3,
  },
  {
    id: 8,
    fileId: 5,
    fileNumber: 'UMS/FIN/2026/001',
    fromUserId: 6,
    fromUserName: 'Suresh Iyer',
    toUserId: 8,
    toUserName: 'Vice Chancellor',
    action: 'Forwarded',
    remarks: 'Budget proposal for VC approval',
    actionDate: makeDate(2),
    slaStatus: 'OnTrack',
    daysPending: 2,
  },
  {
    id: 9,
    fileId: 6,
    fileNumber: 'UMS/CS/2026/003',
    fromUserId: 9,
    fromUserName: 'Amit Singh',
    toUserId: 4,
    toUserName: 'Dr. Verma',
    action: 'Created',
    remarks: 'Internship request initiated',
    actionDate: makeDate(30),
  },
  {
    id: 10,
    fileId: 6,
    fileNumber: 'UMS/CS/2026/003',
    fromUserId: 4,
    fromUserName: 'Dr. Verma',
    toUserId: 7,
    toUserName: 'Registrar Office',
    action: 'Approved',
    remarks: 'Approved. Forwarded to Registrar.',
    actionDate: makeDate(25),
  },
  {
    id: 11,
    fileId: 6,
    fileNumber: 'UMS/CS/2026/003',
    fromUserId: 7,
    fromUserName: 'Registrar Office',
    toUserId: null,
    action: 'Closed',
    remarks: 'Internship program approved. File closed.',
    actionDate: makeDate(22),
  },
  {
    id: 12,
    fileId: 7,
    fileNumber: 'UMS/MTH/2026/002',
    fromUserId: 10,
    fromUserName: 'Neha Patel',
    toUserId: 5,
    toUserName: 'Dr. Gupta',
    action: 'Forwarded',
    remarks: 'Faculty recruitment proposal for HOD review',
    actionDate: makeDate(10),
  },
  {
    id: 13,
    fileId: 7,
    fileNumber: 'UMS/MTH/2026/002',
    fromUserId: 5,
    fromUserName: 'Dr. Gupta',
    toUserId: 10,
    toUserName: 'Neha Patel',
    action: 'Sent Back',
    remarks: 'Please add detailed justification for additional headcount.',
    actionDate: makeDate(3),
  },
  {
    id: 14,
    fileId: 8,
    fileNumber: 'UMS/EXAM/2026/001',
    fromUserId: 2,
    fromUserName: 'Rajesh Kumar',
    toUserId: 7,
    toUserName: 'Registrar Office',
    action: 'Forwarded',
    remarks: 'Exam schedule for approval',
    actionDate: makeDate(2),
    slaStatus: 'OnTrack',
    daysPending: 2,
  },
  {
    id: 15,
    fileId: 9,
    fileNumber: 'UMS/CS/2026/004',
    fromUserId: 9,
    fromUserName: 'Amit Singh',
    toUserId: 4,
    toUserName: 'Dr. Verma',
    action: 'Forwarded',
    remarks: 'License renewal request',
    actionDate: makeDate(5),
  },
  {
    id: 16,
    fileId: 9,
    fileNumber: 'UMS/CS/2026/004',
    fromUserId: 4,
    fromUserName: 'Dr. Verma',
    toUserId: 6,
    toUserName: 'Suresh Iyer',
    action: 'Forwarded',
    remarks: 'Recommended. Finance review needed.',
    actionDate: makeDate(2),
    slaStatus: 'OnTrack',
    daysPending: 2,
  },
  {
    id: 17,
    fileId: 12,
    fileNumber: 'UMS/FIN/2026/002',
    fromUserId: 10,
    fromUserName: 'Neha Patel',
    toUserId: 6,
    toUserName: 'Suresh Iyer',
    action: 'Forwarded',
    remarks: 'TA claim for approval',
    actionDate: makeDate(18),
  },
  {
    id: 18,
    fileId: 12,
    fileNumber: 'UMS/FIN/2026/002',
    fromUserId: 6,
    fromUserName: 'Suresh Iyer',
    toUserId: 10,
    toUserName: 'Neha Patel',
    action: 'Rejected',
    remarks:
      'Incomplete documentation. Please attach conference invitation letter.',
    actionDate: makeDate(15),
  },
];

export const mockFileAttachments: FileAttachment[] = [
  {
    id: 1,
    fileId: 1,
    fileName: 'Lab_Equipment_Quotation.pdf',
    fileUrl: '/uploads/quotation.pdf',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    fileSizeKb: 250,
    version: 1,
    uploadedBy: 9,
    uploadedByName: 'Amit Singh',
    uploadedAt: makeDate(10),
    isActive: true,
  },
  {
    id: 2,
    fileId: 1,
    fileName: 'Justification_Note.docx',
    fileUrl: '/uploads/justification.docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx',
    fileSizeKb: 120,
    version: 1,
    uploadedBy: 9,
    uploadedByName: 'Amit Singh',
    uploadedAt: makeDate(10),
    isActive: true,
  },
  {
    id: 3,
    fileId: 2,
    fileName: 'Leave_Application.pdf',
    fileUrl: '/uploads/leave.pdf',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    fileSizeKb: 80,
    version: 1,
    uploadedBy: 9,
    uploadedByName: 'Amit Singh',
    uploadedAt: makeDate(15),
    isActive: true,
  },
  {
    id: 4,
    fileId: 3,
    fileName: 'Curriculum_Revision_Draft.pdf',
    fileUrl: '/uploads/curriculum.pdf',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    fileSizeKb: 500,
    version: 2,
    uploadedBy: 10,
    uploadedByName: 'Neha Patel',
    uploadedAt: makeDate(8),
    isActive: true,
  },
  {
    id: 5,
    fileId: 4,
    fileName: 'Annual_Report_2025-26.docx',
    fileUrl: '/uploads/annual_report.docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx',
    fileSizeKb: 1024,
    version: 1,
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: makeDate(20),
    isActive: true,
  },
  {
    id: 6,
    fileId: 5,
    fileName: 'Budget_2026-27.xlsx',
    fileUrl: '/uploads/budget.xlsx',
    fileType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtension: 'xlsx',
    fileSizeKb: 350,
    version: 1,
    uploadedBy: 6,
    uploadedByName: 'Suresh Iyer',
    uploadedAt: makeDate(5),
    isActive: true,
  },
  {
    id: 7,
    fileId: 7,
    fileName: 'Recruitment_Justification.docx',
    fileUrl: '/uploads/recruitment.docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx',
    fileSizeKb: 200,
    version: 1,
    uploadedBy: 10,
    uploadedByName: 'Neha Patel',
    uploadedAt: makeDate(12),
    isActive: true,
  },
  {
    id: 8,
    fileId: 9,
    fileName: 'License_Renewal_Quote.pdf',
    fileUrl: '/uploads/license_quote.pdf',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    fileSizeKb: 180,
    version: 1,
    uploadedBy: 9,
    uploadedByName: 'Amit Singh',
    uploadedAt: makeDate(7),
    isActive: true,
  },
  {
    id: 9,
    fileId: 9,
    fileName: 'License_Renewal_Quote_v2.pdf',
    fileUrl: '/uploads/license_quote_v2.pdf',
    fileType: 'application/pdf',
    fileExtension: 'pdf',
    fileSizeKb: 185,
    version: 2,
    uploadedBy: 9,
    uploadedByName: 'Amit Singh',
    uploadedAt: makeDate(6),
    isActive: true,
  },
  {
    id: 10,
    fileId: 5,
    fileName: 'Dept_Wise_Breakdown.xlsx',
    fileUrl: '/uploads/dept_breakdown.xlsx',
    fileType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtension: 'xlsx',
    fileSizeKb: 450,
    version: 1,
    uploadedBy: 6,
    uploadedByName: 'Suresh Iyer',
    uploadedAt: makeDate(4),
    isActive: true,
  },
];

export const mockDigitalNotings: DigitalNoting[] = [
  {
    id: 1,
    fileId: 1,
    notingContent:
      'Verified the quotation. Equipment specifications match requirements. Recommended for approval.',
    notedBy: 4,
    notedByName: 'Dr. Verma',
    notedAt: makeDate(6),
  },
  {
    id: 2,
    fileId: 2,
    notingContent: 'Leave application verified. No pending work. Recommended.',
    notedBy: 4,
    notedByName: 'Dr. Verma',
    notedAt: makeDate(5),
  },
  {
    id: 3,
    fileId: 3,
    notingContent:
      'Curriculum revision is comprehensive and aligns with UGC guidelines. Recommended.',
    notedBy: 5,
    notedByName: 'Dr. Gupta',
    notedAt: makeDate(3),
  },
  {
    id: 4,
    fileId: 4,
    notingContent:
      'Annual report is well-drafted. Reviewed financials and statistics. Approved with minor corrections noted.',
    notedBy: 7,
    notedByName: 'Registrar Office',
    notedAt: makeDate(4),
  },
  {
    id: 5,
    fileId: 5,
    notingContent:
      'Budget proposal is aggressive but necessary for growth. Recommended with suggestion to review contingency allocation.',
    notedBy: 6,
    notedByName: 'Suresh Iyer',
    notedAt: makeDate(2),
  },
  {
    id: 6,
    fileId: 7,
    notingContent:
      'The proposal lacks clear justification for 3 new positions. Please provide workload analysis and current faculty-student ratio.',
    notedBy: 5,
    notedByName: 'Dr. Gupta',
    notedAt: makeDate(3),
  },
  {
    id: 7,
    fileId: 9,
    notingContent:
      'License renewal is essential for ongoing research. Approved for finance processing.',
    notedBy: 4,
    notedByName: 'Dr. Verma',
    notedAt: makeDate(3),
  },
  {
    id: 8,
    fileId: 12,
    notingContent:
      'Claim cannot be processed without conference invitation letter and approval from HOD. Returning for resubmission.',
    notedBy: 6,
    notedByName: 'Suresh Iyer',
    notedAt: makeDate(15),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    recipientUserId: 4,
    recipientUserName: 'Dr. Verma',
    type: 'FileAssigned',
    message: 'New file assigned: Purchase Request for Lab Equipment',
    fileId: 1,
    fileNumber: 'UMS/CS/2026/001',
    isRead: false,
    sentVia: 'InApp',
    createdAt: makeDate(1),
  },
  {
    id: 2,
    recipientUserId: 7,
    recipientUserName: 'Registrar Office',
    type: 'FileAssigned',
    message: 'File forwarded: Curriculum Revision Proposal',
    fileId: 3,
    fileNumber: 'UMS/MTH/2026/001',
    isRead: false,
    sentVia: 'InApp',
    createdAt: makeDate(1),
  },
  {
    id: 3,
    recipientUserId: 9,
    recipientUserName: 'Amit Singh',
    type: 'FileApproved',
    message: 'Your leave application has been approved',
    fileId: 2,
    fileNumber: 'UMS/CS/2026/002',
    isRead: true,
    sentVia: 'InApp',
    createdAt: makeDate(2),
  },
  {
    id: 4,
    recipientUserId: 10,
    recipientUserName: 'Neha Patel',
    type: 'FileReturned',
    message: 'Faculty Recruitment Proposal returned for clarification',
    fileId: 7,
    fileNumber: 'UMS/MTH/2026/002',
    isRead: false,
    sentVia: 'InApp',
    createdAt: makeDate(2),
  },
  {
    id: 5,
    recipientUserId: 6,
    recipientUserName: 'Suresh Iyer',
    type: 'FileOverdue',
    message: 'File overdue: Software License Renewal',
    fileId: 9,
    fileNumber: 'UMS/CS/2026/004',
    isRead: false,
    sentVia: 'InApp',
    createdAt: makeDate(1),
  },
  {
    id: 6,
    recipientUserId: 8,
    recipientUserName: 'Vice Chancellor',
    type: 'FileAssigned',
    message: 'Budget proposal pending your approval',
    fileId: 5,
    fileNumber: 'UMS/FIN/2026/001',
    isRead: true,
    sentVia: 'InApp',
    createdAt: makeDate(1),
  },
  {
    id: 7,
    recipientUserId: 9,
    recipientUserName: 'Amit Singh',
    type: 'FileAssigned',
    message: 'New DAK receipt assigned: UGC Grant Letter',
    isRead: false,
    sentVia: 'InApp',
    createdAt: makeDate(2),
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    tableName: 'files',
    recordId: 1,
    action: 'INSERT',
    newValues: {
      fileNumber: 'UMS/CS/2026/001',
      title: 'Purchase Request for Lab Equipment',
    },
    performedBy: 9,
    performedByName: 'Amit Singh',
    ipAddress: '192.168.1.10',
    createdAt: makeDate(10),
  },
  {
    id: 2,
    tableName: 'file_movements',
    recordId: 1,
    action: 'INSERT',
    newValues: { fileId: 1, action: 'Forwarded' },
    performedBy: 9,
    performedByName: 'Amit Singh',
    ipAddress: '192.168.1.10',
    createdAt: makeDate(10),
  },
  {
    id: 3,
    tableName: 'digital_notings',
    recordId: 1,
    action: 'INSERT',
    newValues: { fileId: 1, notedBy: 4 },
    performedBy: 4,
    performedByName: 'Dr. Verma',
    ipAddress: '192.168.1.20',
    createdAt: makeDate(6),
  },
  {
    id: 4,
    tableName: 'files',
    recordId: 2,
    action: 'UPDATE',
    newValues: { currentStatus: 'Approved' },
    oldValues: { currentStatus: 'Under Review' },
    performedBy: 4,
    performedByName: 'Dr. Verma',
    ipAddress: '192.168.1.20',
    createdAt: makeDate(5),
  },
  {
    id: 5,
    tableName: 'file_attachments',
    recordId: 9,
    action: 'INSERT',
    newValues: {
      fileId: 9,
      fileName: 'License_Renewal_Quote_v2.pdf',
      version: 2,
    },
    performedBy: 9,
    performedByName: 'Amit Singh',
    ipAddress: '192.168.1.10',
    createdAt: makeDate(6),
  },
  {
    id: 6,
    tableName: 'files',
    recordId: 7,
    action: 'UPDATE',
    newValues: { currentStatus: 'Returned for Clarification' },
    oldValues: { currentStatus: 'Under Review' },
    performedBy: 5,
    performedByName: 'Dr. Gupta',
    ipAddress: '192.168.1.30',
    createdAt: makeDate(3),
  },
  {
    id: 7,
    tableName: 'files',
    recordId: 9,
    action: 'UPDATE',
    newValues: { isLocked: true },
    oldValues: { isLocked: false },
    performedBy: 9,
    performedByName: 'Amit Singh',
    ipAddress: '192.168.1.10',
    createdAt: makeDate(4),
  },
  {
    id: 8,
    tableName: 'files',
    recordId: 12,
    action: 'UPDATE',
    newValues: { currentStatus: 'Rejected' },
    oldValues: { currentStatus: 'Under Review' },
    performedBy: 6,
    performedByName: 'Suresh Iyer',
    ipAddress: '192.168.1.40',
    createdAt: makeDate(15),
  },
  {
    id: 9,
    tableName: 'files',
    recordId: 6,
    action: 'UPDATE',
    newValues: { currentStatus: 'Closed' },
    oldValues: { currentStatus: 'Approved' },
    performedBy: 7,
    performedByName: 'Registrar Office',
    ipAddress: '192.168.1.50',
    createdAt: makeDate(22),
  },
  {
    id: 10,
    tableName: 'dak_receipts',
    recordId: 1,
    action: 'INSERT',
    newValues: { diaryNumber: 'DAK/2026/00001', senderName: 'UGC Office' },
    performedBy: 1,
    performedByName: 'Admin User',
    ipAddress: '192.168.1.1',
    createdAt: makeDate(20),
  },
  {
    id: 11,
    tableName: 'files',
    recordId: 11,
    action: 'UPDATE',
    newValues: { currentStatus: 'Kept in Abeyance', isAbeyance: true },
    oldValues: { currentStatus: 'Under Review' },
    performedBy: 9,
    performedByName: 'Amit Singh',
    ipAddress: '192.168.1.10',
    createdAt: makeDate(6),
  },
];

export const mockSystemConfig = {
  autoDiaryNumber: true,
  globalOuCode: 'UMS',
  globalSeparatorChar: '/' as const,
  globalIncludeYear: true,
  globalIncludeMonth: true,
  globalUserDefinedVar1: 'FMTS',
  maxFileSizeMb: 20,
  allowedFileTypes: ['pdf', 'docx', 'xlsx', 'ppt', 'jpg', 'png', 'zip'],
  sessionTimeoutMinutes: 30,
  enableDigitalSignature: false,
};
