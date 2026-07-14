// ============================================================
//  University ERP — Grievance Management System
//  Comprehensive Mock Data conforming to eOffice Workflow
//  (NO Priority, NO SLA, NO Escalation, NO digitalSignature)
// ============================================================

// ─── Types ────────────────────────────────────────────────────

export type ComplaintStatus =
  | 'Submitted'
  | 'Department Review'
  | 'HoD Review'
  | 'Committee Review'
  | 'Registrar Decision'
  | 'Closed';

export interface GrievanceCategory {
  id: string;
  name: string;
  code: string;
  committee: string;
  color: string;
  subCategories: string[];
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedOn: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  message: string;
  date: string;
  isInternal: boolean;
}

export interface TimelineEntry {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  date: string;
  remarks: string;
  status: ComplaintStatus;
  done: boolean;
  active: boolean;
}

export interface NotesheetEntry {
  id: string;
  notesheetNo: string;
  department: string;
  officerName: string;
  officerDesignation: string;
  remarks: string;
  actionTaken: string; // e.g. "Verify & Forward", "Return to Officer", "Approve Resolution", "Forward to Committee"
  supportingDocuments: string[];
  timestamp: string;
}

export interface Notesheet {
  notesheetNo: string;
  grievanceNo: string;
  department: string;
  createdDate: string;
  status: 'Draft' | 'Forwarded' | 'Approved' | 'Returned' | 'Closed';
  entries: NotesheetEntry[];
}

export interface Complaint {
  id: string;
  ticketNo: string;
  studentName: string;
  enrollmentNo: string; // Employee ID if it's a teacher
  course: string; // Designation if it's a teacher
  department: string;
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  isAnonymous: boolean;
  incidentDate: string;
  submittedDate: string;
  location: string;
  assignedDept: string;
  resolvedDate?: string;
  closedDate?: string;
  resolutionRemarks?: string;
  resolutionLetterUrl?: string;
  attachments: Attachment[];
  timeline: TimelineEntry[];
  comments: Comment[];
  notesheet?: Notesheet;
  complaintType: 'Student' | 'Teacher' | 'Employee' | 'Staff';
}

export interface Committee {
  id: string;
  name: string;
  acronym: string;
  type: string;
  chair: string;
  members: CommitteeMember[];
  status: 'Active' | 'Inactive';
  color: string;
  mandate: string;
  totalCases: number;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: 'Chair' | 'Member Secretary' | 'Member';
  contact: string;
}

export interface IntegrationPortal {
  id: string;
  name: string;
  acronym: string;
  type: string;
  endpoint: string;
  status: 'Connected' | 'Disconnected' | 'Error' | 'Syncing';
  lastSync: string;
  totalSynced: number;
  color: string;
  description: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  date: string;
  time: string;
  ticketNo?: string;
}

export interface NotificationTemplate {
  id: string;
  event: string;
  channel: 'SMS' | 'Email' | 'Portal';
  subject?: string;
  body: string;
  isActive: boolean;
}

export interface DepartmentMapping {
  id: string;
  categoryName: string;
  primaryDepartment: string;
  contactOfficer: string;
  status: 'Active' | 'Inactive';
}

// ─── Categories Master ─────────────────────────────────────────────

export const grievanceCategories: GrievanceCategory[] = [
  {
    id: 'CAT001',
    name: 'Academic Grievance',
    code: 'ACAD',
    committee: 'Student Grievance Redressal Committee (SGRC)',
    color: '#3b82f6',
    subCategories: [
      'Result Delay / Marks Entry',
      'Examination Schedule Issue',
      'Degree Certificate Delay',
      'Migration Certificate Issue',
      'Answer Sheet Re-evaluation Request',
    ],
  },
  {
    id: 'CAT002',
    name: 'Financial Grievance',
    code: 'FIN',
    committee: 'Finance Committee',
    color: '#10b981',
    subCategories: [
      'Fee Refund Discrepancy',
      'Scholarship Disbursement Delay',
      'Excess Tuition Fee Charged',
      'Receipt Generation Failure',
      'Direct Benefit Transfer (DBT) Issue',
    ],
  },
  {
    id: 'CAT003',
    name: 'Hostel & Infrastructure',
    code: 'HOSTEL',
    committee: 'Hostel Management Advisory',
    color: '#f59e0b',
    subCategories: [
      'Mess Food Quality Complaint',
      'Room Allocation Dispute',
      'Facility Maintenance (AC/Lift/Geyser)',
      'Security Patrol & CCTV Failure',
      'Water and Electricity Outages',
    ],
  },
  {
    id: 'CAT004',
    name: 'Anti-Ragging Cell',
    code: 'ANTIRAGG',
    committee: 'Anti-Ragging Committee',
    color: '#ef4444',
    subCategories: [
      'Physical Ragging / Bullying',
      'Mental Harassment in Campus',
      'Online Cyber-Bullying by Seniors',
      'Hostel Corridor Misbehavior',
    ],
  },
  {
    id: 'CAT005',
    name: 'Sexual Harassment (ICC)',
    code: 'ICC',
    committee: 'Internal Complaints Committee (ICC)',
    color: '#ec4899',
    subCategories: [
      'Physical Misconduct on Campus',
      'Verbal Inappropriate Remarks',
      'Inappropriate Messages / Cyber stalking',
      'Discriminatory Behavior',
    ],
  },
  {
    id: 'CAT006',
    name: 'SC/ST Cell Grievance',
    code: 'SCST',
    committee: 'SC/ST Committee',
    color: '#8b5cf6',
    subCategories: [
      'Social Discrimination by Peers/Faculty',
      'Scholarship Denials or Withholding',
      'Caste Certificate Verification Issues',
      'Hostel Booking Bias Complaints',
    ],
  },
  {
    id: 'CAT007',
    name: 'Examination Cell Grievance',
    code: 'EXAM',
    committee: 'Examination Advisory Committee',
    color: '#0891b2',
    subCategories: [
      'Admit Card Generation Issue',
      'Form Submission Errors',
      'Unfair Means (UFM) Booking Appeal',
      'Exam Center Allocation Dispute',
    ],
  },
  {
    id: 'CAT008',
    name: 'Administrative & HRMS',
    code: 'ADMIN',
    committee: 'University Executive Council',
    color: '#6b7280',
    subCategories: [
      'Salary Discrepancy (Faculty/Staff)',
      'Service Book Entry Discrepancy',
      'Promotion / CAS Delay',
      'Official Document Issuance Delay',
      'RTI Request Handling Concerns',
    ],
  },
];

// ─── Department Mappings Master ──────────────────────────────────────

export const departmentMappings: DepartmentMapping[] = [
  {
    id: 'DM001',
    categoryName: 'Academic Grievance',
    primaryDepartment: 'School of Computer Science & IT (SCSIT)',
    contactOfficer: 'Dr. Rakesh Verma',
    status: 'Active',
  },
  {
    id: 'DM002',
    categoryName: 'Financial Grievance',
    primaryDepartment: 'Finance & Accounts Division',
    contactOfficer: 'CA Sunil Gupta (Finance Officer)',
    status: 'Active',
  },
  {
    id: 'DM003',
    categoryName: 'Hostel & Infrastructure',
    primaryDepartment: 'Estate & Warden Section',
    contactOfficer: 'Prof. J. C. Upadhyaya (Chief Warden)',
    status: 'Active',
  },
  {
    id: 'DM004',
    categoryName: 'Anti-Ragging Cell',
    primaryDepartment: 'Proctor Office & Security Desk',
    contactOfficer: 'Dr. Sanjay Singh (Chief Proctor)',
    status: 'Active',
  },
  {
    id: 'DM005',
    categoryName: 'Sexual Harassment (ICC)',
    primaryDepartment: 'Internal Complaints Committee',
    contactOfficer: 'Prof. Maya Bose (Chairperson)',
    status: 'Active',
  },
  {
    id: 'DM006',
    categoryName: 'SC/ST Cell Grievance',
    primaryDepartment: 'SC/ST Redressal Liaison Desk',
    contactOfficer: 'Dr. Hari Mohan (Liaison Officer)',
    status: 'Active',
  },
  {
    id: 'DM007',
    categoryName: 'Examination Cell Grievance',
    primaryDepartment: 'Examination Department',
    contactOfficer: 'Dr. Ashutosh Mishra (Exam Controller)',
    status: 'Active',
  },
  {
    id: 'DM008',
    categoryName: 'Administrative & HRMS',
    primaryDepartment: 'Administration Office',
    contactOfficer: 'Shri Ram K. Sharma (Deputy Registrar)',
    status: 'Active',
  },
];

// ─── Committees Master ────────────────────────────────────────────────

export const committees: Committee[] = [
  {
    id: 'COM001',
    name: 'Student Grievance Redressal Committee',
    acronym: 'SGRC',
    type: 'Statutory Body (UGC Mandated)',
    chair: 'Prof. Maya Bose (Senior Professor)',
    status: 'Active',
    color: 'blue',
    mandate:
      'Statutory committee under UGC Grievance Regulations for hearing student appeals and issuing academic orders.',
    totalCases: 24,
    members: [
      {
        id: 'CM1',
        name: 'Prof. Maya Bose',
        designation: 'Professor',
        department: 'School of Economics',
        role: 'Chair',
        contact: 'mbose@davv.edu',
      },
      {
        id: 'CM2',
        name: 'Dr. Sanjay Singh',
        designation: 'Associate Professor',
        department: 'School of Law',
        role: 'Member Secretary',
        contact: 'ssingh@davv.edu',
      },
      {
        id: 'CM3',
        name: 'Shri Ram K. Sharma',
        designation: 'Deputy Registrar',
        department: 'Administration',
        role: 'Member',
        contact: 'rsharma@davv.edu',
      },
      {
        id: 'CM4',
        name: 'Ananya Rao',
        designation: 'Student Representative',
        department: 'School of Commerce',
        role: 'Member',
        contact: 'ananya.std@davv.edu',
      },
    ],
  },
  {
    id: 'COM002',
    name: 'Anti-Ragging Committee',
    acronym: 'ARC',
    type: 'Statutory Body (AICTE/UGC Compliance)',
    chair: 'Vice Chancellor / nominee (Prof. Alok Gupta)',
    status: 'Active',
    color: 'red',
    mandate:
      'Campus safety, review and hearing of critical complaints related to student harassment, hazing, or bullying.',
    totalCases: 5,
    members: [
      {
        id: 'CM5',
        name: 'Prof. Alok Gupta',
        designation: 'Dean Student Welfare',
        department: 'School of Physics',
        role: 'Chair',
        contact: 'agupta@davv.edu',
      },
      {
        id: 'CM6',
        name: 'Shri Vipin Adhiya',
        designation: 'DSP - Indore Civil Admin',
        department: 'External Police Nominee',
        role: 'Member',
        contact: 'vipin.pol@mp.gov.in',
      },
      {
        id: 'CM7',
        name: 'Dr. Ritu Sen',
        designation: 'Assistant Warden',
        department: 'Hostel Section',
        role: 'Member Secretary',
        contact: 'ritusen@davv.edu',
      },
    ],
  },
  {
    id: 'COM003',
    name: 'Internal Complaints Committee',
    acronym: 'ICC',
    type: 'Statutory Body (POSH Act Compliance)',
    chair: 'Prof. Arundhati Mitra (HOD)',
    status: 'Active',
    color: 'pink',
    mandate:
      'Redressal of sexual harassment complaints, ensuring POSH guidelines compliance, campus gender sensitization audits.',
    totalCases: 3,
    members: [
      {
        id: 'CM8',
        name: 'Prof. Arundhati Mitra',
        designation: 'Professor & HOD',
        department: 'School of Life Sciences',
        role: 'Chair',
        contact: 'amitra@davv.edu',
      },
      {
        id: 'CM9',
        name: 'Smt. Seema Nair',
        designation: 'NGO Coordinator',
        department: 'Aanchal Social Trust',
        role: 'Member',
        contact: 'seema.aanchal@gmail.com',
      },
      {
        id: 'CM10',
        name: 'Dr. Preeti Verma',
        designation: 'Associate Professor',
        department: 'School of Chemistry',
        role: 'Member Secretary',
        contact: 'pverma@davv.edu',
      },
    ],
  },
];

// ─── External Integrations Master ────────────────────────────────────

export const integrationPortals: IntegrationPortal[] = [
  {
    id: 'INT001',
    name: 'UGC e-Samadhan Portal',
    acronym: 'e-Samadhan',
    type: 'National Higher Education Portal',
    endpoint: 'https://api.samadhan.ugc.ac.in/v2/grievance/sync',
    status: 'Connected',
    lastSync: '14 Jul 2026 10:30 AM',
    totalSynced: 142,
    color: 'blue',
    description:
      'Auto-syncs unresolved student complaints with the UGC national repository.',
  },
  {
    id: 'INT002',
    name: 'AICTE Grievance Portal',
    acronym: 'AICTE-GRV',
    type: 'Technical Education Council Board',
    endpoint: 'https://grv.aicte-india.org/api/v1/college/feed',
    status: 'Connected',
    lastSync: '14 Jul 2026 08:15 AM',
    totalSynced: 38,
    color: 'orange',
    description:
      'Updates AICTE dashboard regarding faculty workload or student fees verification grievances.',
  },
  {
    id: 'INT003',
    name: 'National Anti-Ragging Portal',
    acronym: 'ARP-GOV',
    type: 'Union Ministry Helpline Integration',
    endpoint: 'https://antiragging.in/api/v3/college-actions',
    status: 'Connected',
    lastSync: '13 Jul 2026 05:00 PM',
    totalSynced: 12,
    color: 'red',
    description:
      'Direct interface for receiving alerts raised on national helpline number 1800-180-5522.',
  },
  {
    id: 'INT004',
    name: 'CM Helpline / State Public Grievance',
    acronym: 'CM-Helpline',
    type: 'State Government Portal',
    endpoint: 'https://cmhelpline.mp.gov.in/api/v2/integration',
    status: 'Connected',
    lastSync: '14 Jul 2026 12:00 PM',
    totalSynced: 407,
    color: 'teal',
    description:
      'Pushes notesheet progress updates directly to state monitoring dashboard of CM Helpline 181.',
  },
];

// ─── Notification Templates ──────────────────────────────────────────

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'NT001',
    event: 'Complaint Submitted',
    channel: 'SMS',
    body: 'Dear Student, your grievance has been registered with Number {#ticketNo#}. You can track notesheet updates in your portal. - DAVV Indore',
    isActive: true,
  },
  {
    id: 'NT002',
    event: 'Complaint Submitted',
    channel: 'Email',
    subject: 'Grievance Acknowledgment: Ticket {#ticketNo#}',
    body: 'Dear Complainant,\nYour grievance has been successfully submitted to the University ERP.\nTicket No: {#ticketNo#}\nSubject: {#subject#}\n\nOur Department Officer will review the file and initiate notesheet drafting shortly.\n\nWarm regards,\nGrievance Redressal Cell, DAVV Indore',
    isActive: true,
  },
  {
    id: 'NT003',
    event: 'Forwarded',
    channel: 'SMS',
    body: 'Grievance {#ticketNo#} has been forwarded to HOD / Committee via notesheet. Track live movements on ERP. - DAVV',
    isActive: true,
  },
  {
    id: 'NT004',
    event: 'Clarification Requested',
    channel: 'Email',
    subject: 'Clarification Needed: Grievance {#ticketNo#}',
    body: 'Dear Complainant,\nThe Department Officer reviewing your grievance {#ticketNo#} has requested clarification on the following:\n{#clarificationMessage#}\n\nPlease log in to the ERP Portal, view your complaint history, and respond under the comments panel.\n\nWarm regards,\nGrievance Cell',
    isActive: true,
  },
  {
    id: 'NT005',
    event: 'Closed',
    channel: 'SMS',
    body: 'Your grievance {#ticketNo#} has been resolved. The final resolution letter from Registrar is available for download on portal. - DAVV',
    isActive: true,
  },
];

// ─── Audit Trail Logs ────────────────────────────────────────────────

export const auditLogs: AuditLog[] = [
  {
    id: 'LOG001',
    action: 'User Login Success',
    module: 'Security & Auth',
    performedBy: 'Arjun Sharma',
    role: 'Student',
    ipAddress: '192.168.4.112',
    date: '14 Jul 2026',
    time: '12:05 PM',
  },
  {
    id: 'LOG002',
    action: 'Grievance Submitted',
    module: 'Intake Desk',
    performedBy: 'Arjun Sharma',
    role: 'Student',
    ipAddress: '192.168.4.112',
    date: '14 Jul 2026',
    time: '12:15 PM',
    ticketNo: 'GRV/2026/00101',
  },
  {
    id: 'LOG003',
    action: 'Create Notesheet',
    module: 'Department Review',
    performedBy: 'Dr. Rakesh Verma',
    role: 'Department Officer',
    ipAddress: '172.16.20.45',
    date: '14 Jul 2026',
    time: '12:30 PM',
    ticketNo: 'GRV/2026/00102',
  },
  {
    id: 'LOG004',
    action: 'Forward Notesheet to HoD',
    module: 'eOffice File Movement',
    performedBy: 'Dr. Rakesh Verma',
    role: 'Department Officer',
    ipAddress: '172.16.20.45',
    date: '14 Jul 2026',
    time: '12:40 PM',
    ticketNo: 'GRV/2026/00103',
  },
];

// ─── Complaints mock data with Notesheet integration ──────────────────

export const complaints: Complaint[] = [
  {
    id: 'C001',
    ticketNo: 'GRV/2026/00101',
    studentName: 'Arjun Sharma',
    enrollmentNo: 'CS2021001',
    course: 'B.Tech CSE',
    department: 'School of Computer Science & IT (SCSIT)',
    category: 'Academic Grievance',
    subCategory: 'Result Delay / Marks Entry',
    subject:
      'Incorrect marks awarded in Data Structures (CS302) End Semester Exam',
    description:
      'I scored well in the practical and theory exam but the marks reflected on the portal are significantly lower. I believe there was an error in the evaluation process. I request a re-evaluation of my answer sheet for CS302.',
    status: 'Department Review',
    isAnonymous: false,
    incidentDate: '10 Jul 2026',
    submittedDate: '12 Jul 2026',
    location: 'SCSIT Block, Examination Section',
    assignedDept: 'School of Computer Science & IT (SCSIT)',
    attachments: [
      {
        id: 'ATT001',
        name: 'Marksheet_CS302_Screenshot.pdf',
        size: '185 KB',
        type: 'PDF',
        uploadedOn: '12 Jul 2026',
        uploadedBy: 'Arjun Sharma',
      },
    ],
    timeline: [
      {
        id: 'T1',
        action: 'Grievance Raised',
        performedBy: 'Arjun Sharma',
        role: 'Student',
        date: '12 Jul 2026 09:14 AM',
        remarks:
          'Grievance ticket created successfully. Notification triggered.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T2',
        action: 'Assigned to Department',
        performedBy: 'System Router',
        role: 'System',
        date: '12 Jul 2026 09:15 AM',
        remarks: 'Auto-routed to SCSIT department officer for review.',
        status: 'Department Review',
        done: true,
        active: true,
      },
    ],
    comments: [
      {
        id: 'CMT001',
        author: 'Arjun Sharma',
        role: 'Student',
        message:
          'Sir, please inspect the copy. I got 76 out of 100 in midsem, so 22 in endsem seems impossible.',
        date: '12 Jul 2026 09:20 AM',
        isInternal: false,
      },
    ],
    complaintType: 'Student',
  },
  {
    id: 'C002',
    ticketNo: 'GRV/2026/00102',
    studentName: 'Ritu Sen',
    enrollmentNo: 'EMP2019803',
    course: 'Assistant Warden / Staff',
    department: 'Estate & Warden Section',
    category: 'Hostel & Infrastructure',
    subCategory: 'Water and Electricity Outages',
    subject:
      'Continuous leakage in overhead tank and power fluctuations in Girls Hostel 3',
    description:
      'Despite multiple verbal warnings to the maintenance team, the overhead tank continues to leak, flooding the rooftop. Additionally, voltage fluctuations have damaged refrigerator compressors. Requesting immediate repair works.',
    status: 'Department Review',
    isAnonymous: false,
    incidentDate: '08 Jul 2026',
    submittedDate: '10 Jul 2026',
    location: 'Girls Hostel No. 3, DAVV Campus',
    assignedDept: 'Estate & Warden Section',
    attachments: [
      {
        id: 'ATT002',
        name: 'Hostel_Tank_Photo.jpg',
        size: '1.4 MB',
        type: 'Image',
        uploadedOn: '10 Jul 2026',
        uploadedBy: 'Ritu Sen',
      },
    ],
    timeline: [
      {
        id: 'T3',
        action: 'Grievance Raised',
        performedBy: 'Ritu Sen',
        role: 'Teacher',
        date: '10 Jul 2026 10:00 AM',
        remarks: 'Grievance ticket created. Sent SMS notification.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T4',
        action: 'Assigned to Department',
        performedBy: 'System Router',
        role: 'System',
        date: '10 Jul 2026 10:02 AM',
        remarks: 'Assigned to Estate Department officer.',
        status: 'Department Review',
        done: true,
        active: true,
      },
    ],
    comments: [],
    notesheet: {
      notesheetNo: 'NS/GRV/2026/0892',
      grievanceNo: 'GRV/2026/00102',
      department: 'Estate & Warden Section',
      createdDate: '11 Jul 2026 11:30 AM',
      status: 'Draft',
      entries: [
        {
          id: 'NSE001',
          notesheetNo: 'NS/GRV/2026/0892',
          department: 'Estate & Warden Section',
          officerName: 'Shri Ram K. Sharma',
          officerDesignation: 'Deputy Registrar (Estate)',
          remarks:
            'Inspected the overhead tank. The welding has corroded at the joint. Draft estimate of Rs. 45,000 for repair and plastering needs to be compiled. Initiating draft note for review.',
          actionTaken: 'Notesheet Created',
          supportingDocuments: ['Corrosion_Report.pdf'],
          timestamp: '11 Jul 2026 11:30 AM',
        },
      ],
    },
    complaintType: 'Teacher',
  },
  {
    id: 'C003',
    ticketNo: 'GRV/2026/00103',
    studentName: 'Kabir Das',
    enrollmentNo: 'COM2023024',
    course: 'M.Com Finance',
    department: 'Finance & Accounts Division',
    category: 'Financial Grievance',
    subCategory: 'Fee Refund Discrepancy',
    subject: 'Admission cancelled in June, fee refund of Rs. 24,000 pending',
    description:
      'I cancelled my admission due to distance issues. I submitted my cancelled cheque and refund form within the window. It has been two months but no bank transfer has occurred.',
    status: 'HoD Review',
    isAnonymous: false,
    incidentDate: '15 Jun 2026',
    submittedDate: '01 Jul 2026',
    location: 'Accounts Desk 4, Administrative Block',
    assignedDept: 'Finance & Accounts Division',
    attachments: [
      {
        id: 'ATT003',
        name: 'Cancellation_Acknowledge.pdf',
        size: '320 KB',
        type: 'PDF',
        uploadedOn: '01 Jul 2026',
        uploadedBy: 'Kabir Das',
      },
    ],
    timeline: [
      {
        id: 'T5',
        action: 'Grievance Raised',
        performedBy: 'Kabir Das',
        role: 'Student',
        date: '01 Jul 2026 11:00 AM',
        remarks: 'Raised on portal.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T6',
        action: 'Department Review',
        performedBy: 'CA Sunil Gupta',
        role: 'Department Officer',
        date: '03 Jul 2026 03:30 PM',
        remarks: 'Notesheet created and verified against refund logs.',
        status: 'Department Review',
        done: true,
        active: false,
      },
      {
        id: 'T7',
        action: 'Forwarded to HoD',
        performedBy: 'CA Sunil Gupta',
        role: 'Department Officer',
        date: '05 Jul 2026 04:00 PM',
        remarks:
          'Notesheet NS/FIN/2026/002 forwarded for budget authorization.',
        status: 'HoD Review',
        done: true,
        active: true,
      },
    ],
    comments: [],
    notesheet: {
      notesheetNo: 'NS/GRV/2026/0993',
      grievanceNo: 'GRV/2026/00103',
      department: 'Finance & Accounts Division',
      createdDate: '03 Jul 2026 03:30 PM',
      status: 'Forwarded',
      entries: [
        {
          id: 'NSE002',
          notesheetNo: 'NS/GRV/2026/0993',
          department: 'Finance & Accounts Division',
          officerName: 'CA Sunil Gupta',
          officerDesignation: 'Finance Officer',
          remarks:
            'Verified Student details. Cancelled cheque copy is correct and IFSC code matches. The cancellation request was approved by Dean on 18th June. Refund amount calculated: Rs. 23,200 (deducting Rs. 800 process fee). Forwarding file to HoD Finance for approval under head code A-045.',
          actionTaken: 'Verify & Forward',
          supportingDocuments: ['Refund_Calculation_Sheet.pdf'],
          timestamp: '03 Jul 2026 03:30 PM',
        },
      ],
    },
    complaintType: 'Student',
  },
  {
    id: 'C004',
    ticketNo: 'GRV/2026/00104',
    studentName: 'Meera Bai',
    enrollmentNo: 'SCI2024098',
    course: 'B.Sc Physics',
    department: 'Proctor Office & Security Desk',
    category: 'Anti-Ragging Cell',
    subCategory: 'Mental Harassment in Campus',
    subject:
      'Verbal harassment and mockery by seniors in the Science Block corridor',
    description:
      'Some senior students pass inappropriate and mocking remarks every afternoon when my classes finish. This has caused extreme stress. Requesting Proctorial action and patrol inspection.',
    status: 'Committee Review',
    isAnonymous: false,
    incidentDate: '02 Jul 2026',
    submittedDate: '03 Jul 2026',
    location: 'Physics Department corridor, Science Block',
    assignedDept: 'Proctor Office & Security Desk',
    attachments: [],
    timeline: [
      {
        id: 'T8',
        action: 'Grievance Raised',
        performedBy: 'Meera Bai',
        role: 'Student',
        date: '03 Jul 2026 08:30 AM',
        remarks: 'Raised on portal.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T9',
        action: 'Department Review',
        performedBy: 'Dr. Sanjay Singh',
        role: 'Department Officer',
        date: '04 Jul 2026 11:30 AM',
        remarks: 'File inspected. Notesheet drafted.',
        status: 'Department Review',
        done: true,
        active: false,
      },
      {
        id: 'T10',
        action: 'Forwarded to HoD',
        performedBy: 'Dr. Sanjay Singh',
        role: 'Department Officer',
        date: '05 Jul 2026 02:30 PM',
        remarks: 'Forwarded to Dean / Chief Proctor.',
        status: 'HoD Review',
        done: true,
        active: false,
      },
      {
        id: 'T11',
        action: 'Refer to Committee',
        performedBy: 'Prof. Alok Gupta',
        role: 'HoD / Chief Proctor',
        date: '07 Jul 2026 04:00 PM',
        remarks:
          'File referred to Anti-Ragging Committee (ARC) for formal hearing.',
        status: 'Committee Review',
        done: true,
        active: true,
      },
    ],
    comments: [],
    notesheet: {
      notesheetNo: 'NS/GRV/2026/1044',
      grievanceNo: 'GRV/2026/00104',
      department: 'Proctor Office & Security Desk',
      createdDate: '04 Jul 2026 11:30 AM',
      status: 'Forwarded',
      entries: [
        {
          id: 'NSE003',
          notesheetNo: 'NS/GRV/2026/1044',
          department: 'Proctor Office & Security Desk',
          officerName: 'Dr. Sanjay Singh',
          officerDesignation: 'Chief Proctor',
          remarks:
            'Complainant was interviewed. Security footages of Science corridor at 14:00 hrs on 2nd July reviewed. Two senior students identified (Mr. Rohan & Mr. Sumit). Forwarding notesheet to Warden and Dean Student Welfare for proctorial committee setup.',
          actionTaken: 'Verify & Forward',
          supportingDocuments: ['Security_Camera_Log.xlsx'],
          timestamp: '04 Jul 2026 11:30 AM',
        },
        {
          id: 'NSE004',
          notesheetNo: 'NS/GRV/2026/1044',
          department: 'Proctor Office & Security Desk',
          officerName: 'Prof. Alok Gupta',
          officerDesignation: 'Dean Student Welfare',
          remarks:
            'This is a serious matter under AICTE/UGC Anti-Ragging directives. Recommending a formal hearing by the Anti-Ragging Committee (ARC) on 16th July. Convening notices must be sent to the accused seniors immediately. Forwarded to ARC Committee Chairperson.',
          actionTaken: 'Forward to Committee',
          supportingDocuments: [],
          timestamp: '07 Jul 2026 04:00 PM',
        },
      ],
    },
    complaintType: 'Student',
  },
  {
    id: 'C005',
    ticketNo: 'GRV/2026/00105',
    studentName: 'Dr. Vivek Kumar',
    enrollmentNo: 'EMP2014022',
    course: 'Associate Professor (Chemistry)',
    department: 'Administration Office',
    category: 'Administrative & HRMS',
    subCategory: 'Salary Discrepancy (Faculty/Staff)',
    subject: 'Incorrect deduction in HRA for the quarter March - May 2026',
    description:
      'I was allocated university quarters in June 2026, but HRA has been deducted for March, April, and May 2026 as well, despite residing in rented accommodation off-campus during that period. Please reimburse the deducted HRA.',
    status: 'Registrar Decision',
    isAnonymous: false,
    incidentDate: '30 May 2026',
    submittedDate: '10 Jun 2026',
    location: 'HRMS Section, Administration Building',
    assignedDept: 'Administration Office',
    attachments: [
      {
        id: 'ATT004',
        name: 'Rental_Agreement_2026.pdf',
        size: '512 KB',
        type: 'PDF',
        uploadedOn: '10 Jun 2026',
        uploadedBy: 'Dr. Vivek Kumar',
      },
    ],
    timeline: [
      {
        id: 'T12',
        action: 'Grievance Raised',
        performedBy: 'Dr. Vivek Kumar',
        role: 'Teacher',
        date: '10 Jun 2026 09:00 AM',
        remarks: 'Raised on portal.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T13',
        action: 'Department Review',
        performedBy: 'Shri Ram K. Sharma',
        role: 'Department Officer',
        date: '15 Jun 2026 02:00 PM',
        remarks: 'Notesheet created, HRMS records checked.',
        status: 'Department Review',
        done: true,
        active: false,
      },
      {
        id: 'T14',
        action: 'Forwarded to HoD',
        performedBy: 'Shri Ram K. Sharma',
        role: 'Department Officer',
        date: '20 Jun 2026 11:30 AM',
        remarks: 'Forwarded to HoD (Deputy Registrar).',
        status: 'HoD Review',
        done: true,
        active: false,
      },
      {
        id: 'T15',
        action: 'Forwarded to Registrar',
        performedBy: 'Shri Ram K. Sharma',
        role: 'HoD / Deputy Registrar',
        date: '25 Jun 2026 04:30 PM',
        remarks:
          'Forwarded to Registrar for final sanction and refund generation.',
        status: 'Registrar Decision',
        done: true,
        active: true,
      },
    ],
    comments: [],
    notesheet: {
      notesheetNo: 'NS/GRV/2026/0452',
      grievanceNo: 'GRV/2026/00105',
      department: 'Administration Office',
      createdDate: '15 Jun 2026 02:00 PM',
      status: 'Forwarded',
      entries: [
        {
          id: 'NSE005',
          notesheetNo: 'NS/GRV/2026/0452',
          department: 'Administration Office',
          officerName: 'Shri Ram K. Sharma',
          officerDesignation: 'Section Officer (HRMS)',
          remarks:
            'Verified with Estate allotment log. Dr. Vivek Kumar took possession of Quarter 14-B on 1st June 2026. The HRA deduction for March, April, and May was done due to clerical oversight in salary file mapping. Total HRA to be reimbursed: Rs. 38,400. Draft resolution note is placed for sanction.',
          actionTaken: 'Verify & Forward',
          supportingDocuments: ['Allotment_Registry_June1.pdf'],
          timestamp: '15 Jun 2026 02:00 PM',
        },
        {
          id: 'NSE006',
          notesheetNo: 'NS/GRV/2026/0452',
          department: 'Administration Office',
          officerName: 'Shri Ram K. Sharma',
          officerDesignation: 'Deputy Registrar (Admin)',
          remarks:
            'Reviewed and concurred with the Section Officer notes. Under the Rules of Allocation, quarters occupancy determines HRA stoppage, which is June 1st. Sanction for reimbursement of Rs. 38,400 under General Head Salary may be accorded. Forwarded to Registrar for final sanction.',
          actionTaken: 'Forward to Registrar',
          supportingDocuments: [],
          timestamp: '25 Jun 2026 04:30 PM',
        },
      ],
    },
    complaintType: 'Teacher',
  },
  {
    id: 'C006',
    ticketNo: 'GRV/2026/00106',
    studentName: 'Amit Patel',
    enrollmentNo: 'HOST2022415',
    course: 'B.Sc Chemistry',
    department: 'Estate & Warden Section',
    category: 'Hostel & Infrastructure',
    subCategory: 'Mess Food Quality Complaint',
    subject:
      'Mess vendor served stale food leading to health alerts in Hostel 2',
    description:
      'Mess food quality is unhygienic and multiple students reported stomach pain. Annapurna Caterers did not clean storage areas properly. Surprise inspection and heavy penalty recommendation needed.',
    status: 'Closed',
    isAnonymous: false,
    incidentDate: '10 May 2026',
    submittedDate: '11 May 2026',
    location: 'Hostel 2 Mess Kitchen, DAVV Campus',
    assignedDept: 'Estate & Warden Section',
    attachments: [
      {
        id: 'ATT005',
        name: 'Surprise_Inspection_Evidence.pdf',
        size: '1.2 MB',
        type: 'PDF',
        uploadedOn: '11 May 2026',
        uploadedBy: 'Amit Patel',
      },
    ],
    timeline: [
      {
        id: 'T16',
        action: 'Grievance Raised',
        performedBy: 'Amit Patel',
        role: 'Student',
        date: '11 May 2026 09:00 AM',
        remarks: 'Raised on portal.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        id: 'T17',
        action: 'Department Officer Review',
        performedBy: 'Prof. J. C. Upadhyaya',
        role: 'Department Officer',
        date: '12 May 2026 03:00 PM',
        remarks: 'Notesheet created. Surprise kitchen audit conducted.',
        status: 'Department Review',
        done: true,
        active: false,
      },
      {
        id: 'T18',
        action: 'Forwarded to HoD',
        performedBy: 'Prof. J. C. Upadhyaya',
        role: 'Department Officer',
        date: '14 May 2026 11:30 AM',
        remarks: 'Forwarded to Chief Warden for penalty proposal.',
        status: 'HoD Review',
        done: true,
        active: false,
      },
      {
        id: 'T19',
        action: 'Forwarded to Registrar',
        performedBy: 'Prof. J. C. Upadhyaya',
        role: 'HoD / Chief Warden',
        date: '16 May 2026 02:30 PM',
        remarks: 'Penalty proposal sent to Registrar.',
        status: 'Registrar Decision',
        done: true,
        active: false,
      },
      {
        id: 'T20',
        action: 'Resolution & Closure',
        performedBy: 'Dr. Anil Kumar (Registrar)',
        role: 'Registrar',
        date: '20 May 2026 04:00 PM',
        remarks: 'Grievance resolved. Vendor fined Rs. 15,000. Notice issued.',
        status: 'Closed',
        done: true,
        active: true,
      },
    ],
    comments: [],
    notesheet: {
      notesheetNo: 'NS/GRV/2026/0204',
      grievanceNo: 'GRV/2026/00106',
      department: 'Estate & Warden Section',
      createdDate: '12 May 2026 03:00 PM',
      status: 'Closed',
      entries: [
        {
          id: 'NSE007',
          notesheetNo: 'NS/GRV/2026/0204',
          department: 'Estate & Warden Section',
          officerName: 'Prof. J. C. Upadhyaya',
          officerDesignation: 'Warden H2',
          remarks:
            'Conducted a surprise kitchen inspection on 12th May. Hygiene was indeed compromised. Vegetable storage boxes were open. Recommend issuing an official warning letter and imposing a penalty of Rs. 15,000 as per Clause 14 of the catering contract.',
          actionTaken: 'Verify & Forward',
          supportingDocuments: ['Surprise_Audit_Report.pdf'],
          timestamp: '12 May 2026 03:00 PM',
        },
        {
          id: 'NSE008',
          notesheetNo: 'NS/GRV/2026/0204',
          department: 'Estate & Warden Section',
          officerName: 'Prof. J. C. Upadhyaya',
          officerDesignation: 'Chief Warden',
          remarks:
            'Reviewed Warden report. Concur with penalty recommendation. Notice period of 7 days to be given to vendor to clean, failing which mess contract will be cancelled. Forwarded to Registrar.',
          actionTaken: 'Forward to Registrar',
          supportingDocuments: [],
          timestamp: '16 May 2026 02:30 PM',
        },
        {
          id: 'NSE009',
          notesheetNo: 'NS/GRV/2026/0204',
          department: 'Registrar Office',
          officerName: 'Dr. Anil Kumar',
          officerDesignation: 'Registrar',
          remarks:
            'Approved. Penalty of Rs. 15,000 is imposed. Resolution letter generated. Copy marked to accounts for deduction from security deposit. Complaint closed.',
          actionTaken: 'Approve & Close',
          supportingDocuments: [],
          timestamp: '20 May 2026 04:00 PM',
        },
      ],
    },
    resolvedDate: '20 May 2026',
    closedDate: '20 May 2026',
    resolutionRemarks:
      'Surprise audit conducted. Mess contractor (Annapurna Caterers) fined Rs. 15,000. Show cause notice issued for contract termination. Kitchen cleaning completed and monitored.',
    resolutionLetterUrl: '/documents/resolutions/GRV-2026-00106-ORDER.pdf',
    complaintType: 'Student',
  },
];
