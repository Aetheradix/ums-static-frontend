// ─── Interfaces & Mock Data for Policy & Compliance Management ──────────────

// ── Policy Category ─────────────────────────────────────────────────────────
export interface PolicyCategory {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

// ── Policy ──────────────────────────────────────────────────────────────────
export type PolicyStatus =
  | 'Draft'
  | 'Under Review'
  | 'Reviewed'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Expired'
  | 'Archived';

export interface Policy {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  effectiveDate: string;
  expiryDate?: string;
  department: string;
  applicableTo: string[];
  versionNumber: string;
  attachment?: string;
  approvalRequired: boolean;
  status: PolicyStatus;
  createdBy: string;
  createdDate: string;
  reviewerComments?: string;
  approverComments?: string;
}

// ── Acknowledgement ─────────────────────────────────────────────────────────
export interface Acknowledgement {
  id: string;
  policyId: string;
  policyName: string;
  userId: string;
  userName: string;
  userType: string;
  date: string;
  time: string;
  ipAddress: string;
  versionAccepted: string;
}

// ── Compliance Requirement ──────────────────────────────────────────────────
export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  frequency: string;
  department: string;
  applicableTo: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

// ── Compliance Assignment ───────────────────────────────────────────────────
export type AssignedType =
  | 'Department'
  | 'College'
  | 'Faculty'
  | 'Staff'
  | 'Student';

export interface ComplianceAssignment {
  id: string;
  complianceId: string;
  complianceName: string;
  assignedTo: string;
  assignedType: AssignedType;
  deadline: string;
  status:
    | 'Pending'
    | 'Submitted'
    | 'Under Verification'
    | 'Verified'
    | 'Rejected';
  assignedDate: string;
}

// ── Compliance Submission ───────────────────────────────────────────────────
export type SubmissionStatus =
  | 'Pending'
  | 'Submitted'
  | 'Under Verification'
  | 'Verified'
  | 'Rejected';

export interface ComplianceSubmission {
  id: string;
  assignmentId: string;
  complianceName: string;
  submittedBy: string;
  department: string;
  documents: string[];
  remarks: string;
  status: SubmissionStatus;
  submittedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  verificationRemarks?: string;
}

// ── Audit ───────────────────────────────────────────────────────────────────
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed';

export interface Audit {
  id: string;
  name: string;
  department: string;
  auditDate: string;
  auditor: string;
  checklist: string[];
  findings: string;
  evidence?: string;
  status: AuditStatus;
}

// ── Non-Compliance ──────────────────────────────────────────────────────────
export type NonComplianceStatus =
  | 'Open'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface NonCompliance {
  id: string;
  auditId: string;
  auditName: string;
  issue: string;
  responsiblePerson: string;
  department: string;
  deadline: string;
  status: NonComplianceStatus;
  createdDate: string;
}

// ── Corrective Action (CAPA) ────────────────────────────────────────────────
export type CAPAStatus = 'Pending' | 'Submitted' | 'Verified' | 'Closed';

export interface CorrectiveAction {
  id: string;
  nonComplianceId: string;
  issue: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  completionDate: string;
  documents: string[];
  status: CAPAStatus;
  submittedBy: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const POLICY_CATEGORIES: PolicyCategory[] = [
  { id: 'PCAT-001', name: 'Academic Policy', status: 'Active' },
  { id: 'PCAT-002', name: 'Administrative Policy', status: 'Active' },
  { id: 'PCAT-003', name: 'Safety & Security', status: 'Active' },
  { id: 'PCAT-004', name: 'Data Privacy', status: 'Active' },
  { id: 'PCAT-005', name: 'Financial Policy', status: 'Active' },
];

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'POL-001',
    name: 'Anti-Ragging Policy',
    code: 'ARP-2026',
    category: 'Safety & Security',
    description:
      'Comprehensive policy covering prevention, prohibition and redressal of ragging in the university campus and affiliated colleges as per UGC regulations.',
    effectiveDate: '2026-01-01',
    expiryDate: '2027-12-31',
    department: 'Student Welfare',
    applicableTo: ['Students', 'Faculty', 'Staff'],
    versionNumber: '2.0',
    attachment: 'anti_ragging_policy_v2.pdf',
    approvalRequired: true,
    status: 'Published',
    createdBy: 'Dr. Anita Sharma (Compliance Officer)',
    createdDate: '2025-12-15',
  },
  {
    id: 'POL-002',
    name: 'Data Privacy & Protection Policy',
    code: 'DPP-2026',
    category: 'Data Privacy',
    description:
      'Policy governing the collection, storage, processing and sharing of personal data of students, employees and stakeholders in compliance with IT Act 2000.',
    effectiveDate: '2026-03-01',
    department: 'IT Department',
    applicableTo: ['Students', 'Faculty', 'Staff', 'Departments'],
    versionNumber: '1.0',
    attachment: 'data_privacy_policy_v1.pdf',
    approvalRequired: true,
    status: 'Under Review',
    createdBy: 'Shri Rajesh Kumar (IT Head)',
    createdDate: '2026-02-10',
    reviewerComments:
      'Section 4.3 needs clarity on third-party data sharing protocols.',
  },
  {
    id: 'POL-003',
    name: 'Examination Conduct & Integrity Policy',
    code: 'ECI-2026',
    category: 'Academic Policy',
    description:
      'Guidelines and rules governing the conduct of examinations, prevention of malpractices, and penalties for academic dishonesty.',
    effectiveDate: '2026-06-01',
    department: 'Examination Cell',
    applicableTo: ['Students', 'Faculty'],
    versionNumber: '3.1',
    attachment: 'exam_integrity_v3.pdf',
    approvalRequired: true,
    status: 'Approved',
    createdBy: 'Prof. V.K. Mishra (CoE)',
    createdDate: '2026-05-01',
  },
  {
    id: 'POL-004',
    name: 'Laboratory Safety Inspection Policy',
    code: 'LSI-2026',
    category: 'Safety & Security',
    description:
      'Mandatory safety standards and inspection procedures for all science, engineering and medical laboratories across campuses.',
    effectiveDate: '2026-04-01',
    expiryDate: '2027-03-31',
    department: 'Estate & Infrastructure',
    applicableTo: ['Faculty', 'Staff', 'Departments'],
    versionNumber: '1.2',
    approvalRequired: true,
    status: 'Draft',
    createdBy: 'Er. S.P. Gupta (Safety Officer)',
    createdDate: '2026-03-20',
  },
  {
    id: 'POL-005',
    name: 'Financial Grants Disbursement Policy',
    code: 'FGD-2026',
    category: 'Financial Policy',
    description:
      'Policy governing the allocation, disbursement, utilization and auditing of financial grants received from UGC, AICTE, DST and state government.',
    effectiveDate: '2026-01-15',
    department: 'Finance Department',
    applicableTo: ['Departments', 'Faculty'],
    versionNumber: '2.1',
    attachment: 'grants_disbursement_v2.pdf',
    approvalRequired: true,
    status: 'Published',
    createdBy: 'CA Priya Mehta (Finance Officer)',
    createdDate: '2025-12-28',
  },
];

export const INITIAL_ACKNOWLEDGEMENTS: Acknowledgement[] = [
  {
    id: 'ACK-001',
    policyId: 'POL-001',
    policyName: 'Anti-Ragging Policy',
    userId: 'STU2024CS0120',
    userName: 'Aditya Pratap Singh',
    userType: 'Student',
    date: '2026-01-15',
    time: '10:32:45',
    ipAddress: '192.168.1.105',
    versionAccepted: '2.0',
  },
  {
    id: 'ACK-002',
    policyId: 'POL-001',
    policyName: 'Anti-Ragging Policy',
    userId: 'STU2024ME0045',
    userName: 'Priya Sharma',
    userType: 'Student',
    date: '2026-01-15',
    time: '11:15:22',
    ipAddress: '192.168.1.142',
    versionAccepted: '2.0',
  },
  {
    id: 'ACK-003',
    policyId: 'POL-001',
    policyName: 'Anti-Ragging Policy',
    userId: 'EMP-0321',
    userName: 'Dr. Suresh Nair',
    userType: 'Faculty',
    date: '2026-01-16',
    time: '09:45:10',
    ipAddress: '10.0.5.34',
    versionAccepted: '2.0',
  },
  {
    id: 'ACK-004',
    policyId: 'POL-005',
    policyName: 'Financial Grants Disbursement Policy',
    userId: 'EMP-0102',
    userName: 'Prof. Alok Mehta',
    userType: 'Faculty',
    date: '2026-02-01',
    time: '14:20:33',
    ipAddress: '10.0.5.78',
    versionAccepted: '2.1',
  },
  {
    id: 'ACK-005',
    policyId: 'POL-005',
    policyName: 'Financial Grants Disbursement Policy',
    userId: 'EMP-0245',
    userName: 'Dr. M.K. Rawat',
    userType: 'Staff',
    date: '2026-02-02',
    time: '16:05:18',
    ipAddress: '10.0.5.91',
    versionAccepted: '2.1',
  },
];

export const INITIAL_COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'COMP-001',
    name: 'Anti Ragging Declaration',
    description:
      'All students must submit anti-ragging declaration at the start of each semester.',
    frequency: 'Every Semester',
    department: 'Student Welfare',
    applicableTo: 'Students',
    status: 'Active',
    createdDate: '2026-01-01',
  },
  {
    id: 'COMP-002',
    name: 'Fire Safety Audit',
    description:
      'Annual fire safety audit of all buildings including hostels and labs.',
    frequency: 'Yearly',
    department: 'Estate & Infrastructure',
    applicableTo: 'Departments',
    status: 'Active',
    createdDate: '2026-01-01',
  },
  {
    id: 'COMP-003',
    name: 'Data Privacy Compliance',
    description:
      'Annual review and certification of data handling practices across departments.',
    frequency: 'Yearly',
    department: 'IT Department',
    applicableTo: 'Departments',
    status: 'Active',
    createdDate: '2026-01-01',
  },
  {
    id: 'COMP-004',
    name: 'Internal Quality Audit',
    description:
      'Quarterly internal quality audit of academic and administrative processes.',
    frequency: 'Quarterly',
    department: 'IQAC',
    applicableTo: 'Departments',
    status: 'Active',
    createdDate: '2026-01-01',
  },
  {
    id: 'COMP-005',
    name: 'Laboratory Safety Inspection',
    description:
      'Monthly safety inspection of all science, engineering and medical laboratories.',
    frequency: 'Monthly',
    department: 'Estate & Infrastructure',
    applicableTo: 'Departments',
    status: 'Active',
    createdDate: '2026-01-01',
  },
];

export const INITIAL_COMPLIANCE_ASSIGNMENTS: ComplianceAssignment[] = [
  {
    id: 'ASGN-001',
    complianceId: 'COMP-001',
    complianceName: 'Anti Ragging Declaration',
    assignedTo: 'Computer Science Department',
    assignedType: 'Department',
    deadline: '2026-07-31',
    status: 'Pending',
    assignedDate: '2026-06-15',
  },
  {
    id: 'ASGN-002',
    complianceId: 'COMP-002',
    complianceName: 'Fire Safety Audit',
    assignedTo: 'Mechanical Engineering',
    assignedType: 'Department',
    deadline: '2026-08-15',
    status: 'Submitted',
    assignedDate: '2026-06-01',
  },
  {
    id: 'ASGN-003',
    complianceId: 'COMP-003',
    complianceName: 'Data Privacy Compliance',
    assignedTo: 'IT Department',
    assignedType: 'Department',
    deadline: '2026-09-30',
    status: 'Under Verification',
    assignedDate: '2026-06-10',
  },
  {
    id: 'ASGN-004',
    complianceId: 'COMP-004',
    complianceName: 'Internal Quality Audit',
    assignedTo: 'Civil Engineering',
    assignedType: 'Department',
    deadline: '2026-07-15',
    status: 'Verified',
    assignedDate: '2026-04-01',
  },
  {
    id: 'ASGN-005',
    complianceId: 'COMP-005',
    complianceName: 'Laboratory Safety Inspection',
    assignedTo: 'Physics Department',
    assignedType: 'Department',
    deadline: '2026-07-05',
    status: 'Rejected',
    assignedDate: '2026-06-01',
  },
];

export const INITIAL_COMPLIANCE_SUBMISSIONS: ComplianceSubmission[] = [
  {
    id: 'SUB-STU-001',
    assignmentId: 'ASGN-STU-001',
    complianceName: 'Anti Ragging Declaration',
    submittedBy: 'Aditya Pratap Singh',
    department: 'Computer Science',
    documents: ['anti_ragging_form.pdf'],
    remarks: 'Signed and uploaded as requested.',
    status: 'Verified',
    submittedDate: '2026-06-16',
    verifiedBy: 'Dr. Anita Sharma',
    verifiedDate: '2026-06-18',
    verificationRemarks: 'Document is in order.',
  },
  {
    id: 'SUB-001',
    assignmentId: 'ASGN-002',
    complianceName: 'Fire Safety Audit',
    submittedBy: 'Er. Rahul Verma',
    department: 'Mechanical Engineering',
    documents: ['fire_safety_report_mech.pdf', 'inspection_photos.zip'],
    remarks:
      'All fire extinguishers checked and refilled. Emergency exit signage updated.',
    status: 'Submitted',
    submittedDate: '2026-07-20',
  },
  {
    id: 'SUB-002',
    assignmentId: 'ASGN-003',
    complianceName: 'Data Privacy Compliance',
    submittedBy: 'Shri Amit Tiwari',
    department: 'IT Department',
    documents: ['data_handling_certificate.pdf', 'audit_trail_log.xlsx'],
    remarks:
      'All systems comply with data retention policy. Encryption upgraded to AES-256.',
    status: 'Under Verification',
    submittedDate: '2026-08-10',
    verifiedBy: 'Dr. Anita Sharma',
  },
  {
    id: 'SUB-003',
    assignmentId: 'ASGN-004',
    complianceName: 'Internal Quality Audit',
    submittedBy: 'Prof. D.K. Sinha',
    department: 'Civil Engineering',
    documents: ['iqac_audit_q1_civil.pdf', 'improvement_plan.docx'],
    remarks:
      'Q1 audit completed. Two minor observations addressed with corrective actions.',
    status: 'Verified',
    submittedDate: '2026-06-25',
    verifiedBy: 'Dr. Anita Sharma',
    verifiedDate: '2026-06-28',
    verificationRemarks: 'All documentation satisfactory. Observations closed.',
  },
  {
    id: 'SUB-004',
    assignmentId: 'ASGN-005',
    complianceName: 'Laboratory Safety Inspection',
    submittedBy: 'Dr. P.K. Joshi',
    department: 'Physics Department',
    documents: ['lab_inspection_june.pdf'],
    remarks:
      'Monthly inspection completed. Ventilation system needs upgrade in Lab-3.',
    status: 'Rejected',
    submittedDate: '2026-06-30',
    verifiedBy: 'Er. S.P. Gupta',
    verifiedDate: '2026-07-02',
    verificationRemarks:
      'Lab-3 ventilation issue is critical and not addressed. Please submit corrective action plan.',
  },
];

export const INITIAL_AUDITS: Audit[] = [
  {
    id: 'AUD-001',
    name: 'Annual Fire Safety Audit 2026',
    department: 'Mechanical Engineering',
    auditDate: '2026-08-15',
    auditor: 'Er. S.P. Gupta (Safety Officer)',
    checklist: [
      'Fire extinguisher availability & expiry',
      'Emergency exit accessibility',
      'Fire alarm system functionality',
      'Evacuation plan displayed',
      'Staff fire drill conducted',
    ],
    findings:
      'Emergency exit in Block-C partially blocked by stored equipment.',
    evidence: 'fire_audit_photos_mech.zip',
    status: 'Completed',
  },
  {
    id: 'AUD-002',
    name: 'IQAC Internal Quality Audit Q2',
    department: 'Computer Science',
    auditDate: '2026-09-10',
    auditor: 'Dr. Rajeshwari Sen (IQAC Director)',
    checklist: [
      'Curriculum delivery compliance',
      'Faculty feedback analysis',
      'Research output tracking',
      'Infrastructure utilization',
      'Student mentoring records',
    ],
    findings: '',
    status: 'Scheduled',
  },
  {
    id: 'AUD-003',
    name: 'Data Privacy Compliance Audit',
    department: 'IT Department',
    auditDate: '2026-07-20',
    auditor: 'Shri Lalit Kumar (Data Protection Officer)',
    checklist: [
      'Data encryption standards',
      'Access control reviews',
      'Backup & recovery procedures',
      'Third-party data sharing agreements',
      'Incident response plan',
    ],
    findings: 'Two systems found without encrypted database connections.',
    evidence: 'it_audit_findings.pdf',
    status: 'Completed',
  },
  {
    id: 'AUD-004',
    name: 'Laboratory Safety Inspection – Physics',
    department: 'Physics Department',
    auditDate: '2026-07-25',
    auditor: 'Er. S.P. Gupta (Safety Officer)',
    checklist: [
      'Chemical storage compliance',
      'Ventilation system check',
      'PPE availability',
      'Waste disposal procedures',
      'Emergency shower & eyewash',
    ],
    findings:
      'Lab-3 ventilation below safety standards. PPE stock insufficient.',
    evidence: 'physics_lab_audit.pdf',
    status: 'In Progress',
  },
];

export const INITIAL_NON_COMPLIANCES: NonCompliance[] = [
  {
    id: 'NC-001',
    auditId: 'AUD-001',
    auditName: 'Annual Fire Safety Audit 2026',
    issue:
      'Emergency exit in Block-C partially blocked by stored equipment. Fire drill not conducted this quarter.',
    responsiblePerson: 'Er. Rahul Verma (Dept. Safety Coordinator)',
    department: 'Mechanical Engineering',
    deadline: '2026-09-15',
    status: 'In Progress',
    createdDate: '2026-08-16',
  },
  {
    id: 'NC-002',
    auditId: 'AUD-003',
    auditName: 'Data Privacy Compliance Audit',
    issue:
      'Two database servers (DB-SIS-02, DB-FIN-01) running without TLS encryption on internal connections.',
    responsiblePerson: 'Shri Amit Tiwari (System Administrator)',
    department: 'IT Department',
    deadline: '2026-08-20',
    status: 'Resolved',
    createdDate: '2026-07-21',
  },
  {
    id: 'NC-003',
    auditId: 'AUD-004',
    auditName: 'Laboratory Safety Inspection – Physics',
    issue:
      'Lab-3 ventilation system operating at 40% capacity. Insufficient PPE stock for 2nd year practical batches.',
    responsiblePerson: 'Dr. P.K. Joshi (Lab In-Charge)',
    department: 'Physics Department',
    deadline: '2026-08-30',
    status: 'Open',
    createdDate: '2026-07-26',
  },
];

export const INITIAL_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: 'CAPA-001',
    nonComplianceId: 'NC-001',
    issue: 'Emergency exit in Block-C partially blocked by stored equipment.',
    rootCause:
      'Shortage of storage space led to temporary placement of lab equipment near the exit.',
    correctiveAction:
      'Relocated all equipment to newly allocated storeroom in Block-D. Emergency exit cleared and inspected.',
    preventiveAction:
      'Quarterly storage audits scheduled. Penalty clause added for unauthorized storage near exits.',
    completionDate: '2026-09-01',
    documents: ['exit_clearance_report.pdf', 'storage_reallocation.pdf'],
    status: 'Submitted',
    submittedBy: 'Er. Rahul Verma',
  },
  {
    id: 'CAPA-002',
    nonComplianceId: 'NC-002',
    issue: 'Two database servers running without TLS encryption.',
    rootCause:
      'Legacy migration scripts bypassed TLS configuration during database upgrade cycle.',
    correctiveAction:
      'TLS 1.3 certificates installed on both DB-SIS-02 and DB-FIN-01. Connection strings updated across all services.',
    preventiveAction:
      'Automated TLS compliance scanner added to CI/CD pipeline. Monthly security audit checklist updated.',
    completionDate: '2026-08-05',
    documents: ['tls_installation_report.pdf', 'security_scan_results.pdf'],
    status: 'Verified',
    submittedBy: 'Shri Amit Tiwari',
  },
];

// Dropdown options
export const DEPARTMENT_OPTIONS = [
  'Student Welfare',
  'IT Department',
  'Examination Cell',
  'Estate & Infrastructure',
  'Finance Department',
  'IQAC',
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Physics Department',
  'Chemistry Department',
  'Mathematics Department',
];

export const APPLICABLE_TO_OPTIONS = [
  'Students',
  'Faculty',
  'Staff',
  'Departments',
];

export const FREQUENCY_OPTIONS = [
  'Monthly',
  'Quarterly',
  'Every Semester',
  'Yearly',
  'One-Time',
];

export const ASSIGNED_TYPE_OPTIONS: AssignedType[] = [
  'Department',
  'College',
  'Faculty',
  'Staff',
  'Student',
];
