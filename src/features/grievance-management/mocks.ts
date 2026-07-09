// ============================================================
//  University ERP — Grievance Management System
//  Comprehensive Mock Data (DAVV Indore context)
// ============================================================

// ─── Types ────────────────────────────────────────────────────

export type ComplaintStatus =
  | 'Draft'
  | 'Submitted'
  | 'Assigned'
  | 'Under Review'
  | 'Forwarded'
  | 'Escalated'
  | 'Resolved'
  | 'Closed'
  | 'Rejected'
  | 'Appealed'
  | 'Withdrawn';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type SLAStatus = 'Within SLA' | 'Near Breach' | 'Breached';

export interface GrievanceCategory {
  id: string;
  name: string;
  code: string;
  committee: string;
  color: string;
  subCategories: string[];
  defaultSLAHours: number;
}

export interface Complaint {
  id: string;
  ticketNo: string;
  studentName: string;
  enrollmentNo: string;
  course: string;
  department: string;
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  priority: Priority;
  status: ComplaintStatus;
  isAnonymous: boolean;
  incidentDate: string;
  submittedDate: string;
  location: string;
  assignedTo: string;
  assignedDept: string;
  slaDeadline: string;
  slaRemainingHrs: number;
  slaStatus: SLAStatus;
  escalationLevel: number;
  escalatedTo?: string;
  resolvedDate?: string;
  closedDate?: string;
  resolutionRemarks?: string;
  attachments: Attachment[];
  timeline: TimelineEntry[];
  comments: Comment[];
  notesheetNo?: string;
  appealReason?: string;
  externalRefNo?: string;
  complaintType?: 'Student' | 'Staff' | 'Faculty' | 'Public';
  applicationNo?: string;
  isForwardedToGovt?: boolean;
  govtPortalName?: string;
  govtRefNo?: string;
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

export interface Notesheet {
  id: string;
  notesheetNo: string;
  complaintNo: string;
  fileNo: string;
  subject: string;
  currentOfficer: string;
  officerDesignation: string;
  department: string;
  remarks: string;
  recommendation: string;
  status: 'Draft' | 'Forwarded' | 'Approved' | 'Returned' | 'Rejected';
  createdDate: string;
  forwardedTo?: string;
  digitalSigned: boolean;
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
  pendingCases: number;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: 'Chair' | 'Member Secretary' | 'Member';
  contact: string;
}

export interface SLARule {
  id: string;
  category: string;
  priority: Priority;
  responseTimeHrs: number;
  resolutionTimeHrs: number;
  reminderHrs: number;
  escalationHrs: number;
  escalateTo: string;
}

export interface IntegrationPortal {
  id: string;
  name: string;
  acronym: string;
  type: string;
  endpoint: string;
  status: 'Connected' | 'Disconnected' | 'Error' | 'Syncing';
  lastSync: string;
  pendingRequests: number;
  failedRequests: number;
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
  oldValue?: string;
  newValue?: string;
  ticketNo?: string;
}

export interface NotificationTemplate {
  id: string;
  event: string;
  channel: 'SMS' | 'Email' | 'WhatsApp' | 'Push';
  subject?: string;
  body: string;
  isActive: boolean;
}

// ─── Categories ─────────────────────────────────────────────

export const grievanceCategories: GrievanceCategory[] = [
  {
    id: 'CAT001',
    name: 'Academic Grievance',
    code: 'ACAD',
    committee: 'SGRC',
    color: '#3b82f6',
    subCategories: [
      'Result / Marks',
      'Exam Schedule',
      'Degree Certificate',
      'Migration Certificate',
      'Answer Sheet Revaluation',
    ],
    defaultSLAHours: 72,
  },
  {
    id: 'CAT002',
    name: 'Financial Grievance',
    code: 'FIN',
    committee: 'Finance Committee',
    color: '#10b981',
    subCategories: [
      'Fee Refund',
      'Scholarship Issue',
      'Excess Fee Charged',
      'Receipt Not Received',
      'DBT Payment Issue',
    ],
    defaultSLAHours: 48,
  },
  {
    id: 'CAT003',
    name: 'Hostel & Infrastructure',
    code: 'HOSTEL',
    committee: 'SGRC',
    color: '#f59e0b',
    subCategories: [
      'Mess Quality',
      'Room Allocation',
      'Maintenance',
      'Security Issue',
      'Water / Electricity',
    ],
    defaultSLAHours: 24,
  },
  {
    id: 'CAT004',
    name: 'Anti-Ragging',
    code: 'ANTIRAGG',
    committee: 'Anti-Ragging Cell',
    color: '#ef4444',
    subCategories: [
      'Physical Ragging',
      'Mental Harassment',
      'Online Ragging',
      'Senior Misconduct',
    ],
    defaultSLAHours: 12,
  },
  {
    id: 'CAT005',
    name: 'Sexual Harassment / ICC',
    code: 'ICC',
    committee: 'ICC / Women Cell',
    color: '#ec4899',
    subCategories: [
      'Physical Misconduct',
      'Verbal Harassment',
      'Online Harassment',
      'Workplace Misconduct',
    ],
    defaultSLAHours: 24,
  },
  {
    id: 'CAT006',
    name: 'SC/ST Grievance',
    code: 'SCST',
    committee: 'SC/ST Cell',
    color: '#8b5cf6',
    subCategories: [
      'Caste Discrimination',
      'Scholarship Withheld',
      'Certificate Issue',
      'Hostel Denial',
    ],
    defaultSLAHours: 48,
  },
  {
    id: 'CAT007',
    name: 'Examination Grievance',
    code: 'EXAM',
    committee: 'Examination Committee',
    color: '#0891b2',
    subCategories: [
      'Hall Ticket Issue',
      'Examination Form',
      'Paper Leak Complaint',
      'Centre Allocation',
    ],
    defaultSLAHours: 36,
  },
  {
    id: 'CAT008',
    name: 'Administrative Grievance',
    code: 'ADMIN',
    committee: 'SGRC',
    color: '#6b7280',
    subCategories: [
      'Staff Misconduct',
      'Admission Issue',
      'Document Verification',
      'RTI Related',
    ],
    defaultSLAHours: 96,
  },
];

// ─── Complaints (Mock Data) ──────────────────────────────────

const makeTimeline = (steps: Partial<TimelineEntry>[]): TimelineEntry[] =>
  steps.map((s, i) => ({
    id: `TL${i + 1}`,
    action: s.action ?? '',
    performedBy: s.performedBy ?? '',
    role: s.role ?? '',
    date: s.date ?? '—',
    remarks: s.remarks ?? '',
    status: s.status ?? 'Submitted',
    done: s.done ?? false,
    active: s.active ?? false,
  }));

export const complaints: Complaint[] = [
  {
    id: 'GRV001',
    ticketNo: 'GRV/DAVV/2025/00312',
    studentName: 'Arjun Sharma',
    enrollmentNo: 'CS2021001',
    course: 'B.Tech CSE',
    department: 'SCSIT',
    category: 'Academic Grievance',
    subCategory: 'Result / Marks',
    subject:
      'Incorrect marks awarded in Data Structures (CS302) End Semester Exam',
    description:
      'I scored well in the practical and theory exam but the marks reflected on the portal are significantly lower. I believe there was an error in the evaluation process. I request a re-evaluation of my answer sheet for CS302.',
    priority: 'High',
    status: 'Under Review',
    isAnonymous: false,
    incidentDate: '10 Dec 2025',
    submittedDate: '15 Dec 2025',
    location: 'SCSIT Block, Examination Section',
    assignedTo: 'Dr. Rakesh Verma (Exam Controller)',
    assignedDept: 'Examination Department',
    slaDeadline: '18 Dec 2025',
    slaRemainingHrs: 14,
    slaStatus: 'Near Breach',
    escalationLevel: 2,
    escalatedTo: 'HoD SCSIT',
    attachments: [
      {
        id: 'A1',
        name: 'Marksheet_CS302.pdf',
        size: '245 KB',
        type: 'PDF',
        uploadedOn: '15 Dec 2025',
        uploadedBy: 'Arjun Sharma',
      },
      {
        id: 'A2',
        name: 'Answer_Sheet_Copy.jpg',
        size: '1.2 MB',
        type: 'Image',
        uploadedOn: '15 Dec 2025',
        uploadedBy: 'Arjun Sharma',
      },
    ],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Arjun Sharma',
        role: 'Student',
        date: '15 Dec 2025 09:14',
        remarks: 'Ticket auto-generated. Ref No: GRV/DAVV/2025/00312',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Auto-Assigned to Department',
        performedBy: 'System',
        role: 'Auto Routing',
        date: '15 Dec 2025 09:15',
        remarks: 'Assigned to Examination Department based on category mapping',
        status: 'Assigned',
        done: true,
        active: false,
      },
      {
        action: 'Notesheet Created',
        performedBy: 'Dr. Rakesh Verma',
        role: 'Exam Controller',
        date: '15 Dec 2025 11:30',
        remarks: 'Notesheet NS/2025/00892 created. Investigation initiated.',
        status: 'Assigned',
        done: true,
        active: false,
      },
      {
        action: 'Under Review',
        performedBy: 'Dr. Rakesh Verma',
        role: 'Exam Controller',
        date: '16 Dec 2025 14:00',
        remarks:
          'Answer sheet retrieved for re-evaluation by departmental committee',
        status: 'Under Review',
        done: false,
        active: true,
      },
      {
        action: 'Resolution',
        performedBy: '—',
        role: '—',
        date: '—',
        remarks: 'Pending review outcome',
        status: 'Resolved',
        done: false,
        active: false,
      },
      {
        action: 'Closed',
        performedBy: '—',
        role: '—',
        date: '—',
        remarks: '—',
        status: 'Closed',
        done: false,
        active: false,
      },
    ]),
    comments: [
      {
        id: 'C1',
        author: 'Dr. Rakesh Verma',
        role: 'Exam Controller',
        message:
          'Answer sheet has been sent to departmental re-checking committee. Expected to resolve by 18 Dec 2025.',
        date: '16 Dec 2025 14:05',
        isInternal: false,
      },
      {
        id: 'C2',
        author: 'Arjun Sharma',
        role: 'Student',
        message:
          'Thank you for the update. Please ensure the re-evaluation is done by the deadline.',
        date: '16 Dec 2025 15:20',
        isInternal: false,
      },
    ],
    notesheetNo: 'NS/2025/00892',
    externalRefNo: 'UGC/eSAMADHAN/2025/1234',
  },
  {
    id: 'GRV002',
    ticketNo: 'GRV/DAVV/2025/00289',
    studentName: 'Priya Patel',
    enrollmentNo: 'MBA2022045',
    course: 'MBA',
    department: 'School of Management',
    category: 'Financial Grievance',
    subCategory: 'Fee Refund',
    subject:
      'Excess fee deducted for semester 4 – refund pending since 60 days',
    description:
      'An excess fee of ₹8,500 was charged during semester 4 registration. I have already submitted the refund request form with all receipts to the accounts section on 15 Oct 2025. However, no refund has been processed till date.',
    priority: 'Critical',
    status: 'Escalated',
    isAnonymous: false,
    incidentDate: '15 Oct 2025',
    submittedDate: '20 Nov 2025',
    location: 'Accounts Section, Administrative Block',
    assignedTo: 'Mr. Suresh Joshi (Finance Officer)',
    assignedDept: 'Finance Department',
    slaDeadline: '27 Nov 2025',
    slaRemainingHrs: -120,
    slaStatus: 'Breached',
    escalationLevel: 3,
    escalatedTo: 'Registrar',
    attachments: [
      {
        id: 'A3',
        name: 'Fee_Receipt_Oct2025.pdf',
        size: '180 KB',
        type: 'PDF',
        uploadedOn: '20 Nov 2025',
        uploadedBy: 'Priya Patel',
      },
      {
        id: 'A4',
        name: 'Refund_Request_Form.pdf',
        size: '120 KB',
        type: 'PDF',
        uploadedOn: '20 Nov 2025',
        uploadedBy: 'Priya Patel',
      },
    ],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Priya Patel',
        role: 'Student',
        date: '20 Nov 2025',
        remarks: 'Complaint filed for refund delay',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Assigned to Finance',
        performedBy: 'System',
        role: 'Auto Routing',
        date: '20 Nov 2025',
        remarks: 'Routed to Finance Department',
        status: 'Assigned',
        done: true,
        active: false,
      },
      {
        action: 'SLA Breached – Escalated to HoD',
        performedBy: 'System',
        role: 'Escalation Engine',
        date: '27 Nov 2025',
        remarks: 'SLA deadline passed. Auto-escalated to HoD.',
        status: 'Escalated',
        done: true,
        active: false,
      },
      {
        action: 'Escalated to Registrar',
        performedBy: 'Prof. Anita Sharma',
        role: 'HoD',
        date: '01 Dec 2025',
        remarks:
          'Finance not responding. Escalating to Registrar for urgent resolution.',
        status: 'Escalated',
        done: false,
        active: true,
      },
      {
        action: 'Resolution',
        performedBy: '—',
        role: '—',
        date: '—',
        remarks: '—',
        status: 'Resolved',
        done: false,
        active: false,
      },
    ]),
    comments: [
      {
        id: 'C3',
        author: 'Prof. Anita Sharma',
        role: 'HoD',
        message:
          'Finance department has been notified. Immediate resolution is expected within 48 hours.',
        date: '01 Dec 2025',
        isInternal: false,
      },
    ],
    notesheetNo: 'NS/2025/00745',
    externalRefNo: 'CPGRAMS/2025/MP/45678',
  },
  {
    id: 'GRV003',
    ticketNo: 'GRV/DAVV/2025/00201',
    studentName: 'Anonymous',
    enrollmentNo: '—',
    course: 'B.A. LL.B',
    department: 'School of Law',
    category: 'Anti-Ragging',
    subCategory: 'Senior Misconduct',
    subject: 'Ragging incident in Law School hostel – Block C, Room 214',
    description:
      '[Anonymous Complaint] A group of senior students in Block C are harassing first-year students after 10 PM. Physical intimidation and verbal abuse have been reported by multiple victims who are afraid to come forward. Immediate action requested.',
    priority: 'Critical',
    status: 'Assigned',
    isAnonymous: true,
    incidentDate: '05 Dec 2025',
    submittedDate: '06 Dec 2025',
    location: 'Law School Hostel, Block C, Room 214',
    assignedTo: 'Anti-Ragging Cell – Chief Warden',
    assignedDept: 'Anti-Ragging Cell',
    slaDeadline: '06 Dec 2025',
    slaRemainingHrs: -48,
    slaStatus: 'Breached',
    escalationLevel: 1,
    attachments: [],
    timeline: makeTimeline([
      {
        action: 'Anonymous Complaint Submitted',
        performedBy: 'Anonymous',
        role: 'Student',
        date: '06 Dec 2025 02:13',
        remarks: 'Identity protected. Forwarded directly to Anti-Ragging Cell.',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Assigned to Anti-Ragging Cell',
        performedBy: 'System',
        role: 'Auto Routing',
        date: '06 Dec 2025 02:15',
        remarks: 'High priority. SLA: 12 hours.',
        status: 'Assigned',
        done: false,
        active: true,
      },
    ]),
    comments: [],
    externalRefNo: 'UGC-ANTIRAGGING/2025/47821',
  },
  {
    id: 'GRV004',
    ticketNo: 'GRV/DAVV/2025/00178',
    studentName: 'Sunita Kumari',
    enrollmentNo: 'MSC2023012',
    course: 'M.Sc Chemistry',
    department: 'School of Science',
    category: 'SC/ST Grievance',
    subCategory: 'Scholarship Withheld',
    subject: 'SC scholarship amount not credited for AY 2025-26',
    description:
      'My SC scholarship approved under NSP portal has not been credited to my bank account for AY 2025-26. My bank details are correctly seeded with NPCI. I have been following up since September but no action has been taken.',
    priority: 'High',
    status: 'Resolved',
    isAnonymous: false,
    incidentDate: '01 Sep 2025',
    submittedDate: '10 Sep 2025',
    location: 'Scholarship Section, Administration Block',
    assignedTo: 'Dr. Kavita Singh (SC/ST Cell Head)',
    assignedDept: 'SC/ST Cell',
    slaDeadline: '15 Sep 2025',
    slaRemainingHrs: 0,
    slaStatus: 'Within SLA',
    escalationLevel: 0,
    resolvedDate: '14 Sep 2025',
    resolutionRemarks:
      'Scholarship amount of ₹25,000 processed via APBS and credited to student bank account. UTR No: SBINR2025091423.',
    attachments: [
      {
        id: 'A5',
        name: 'Bank_Passbook.pdf',
        size: '320 KB',
        type: 'PDF',
        uploadedOn: '10 Sep 2025',
        uploadedBy: 'Sunita Kumari',
      },
    ],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Sunita Kumari',
        role: 'Student',
        date: '10 Sep 2025',
        remarks: 'SC scholarship not credited',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Assigned to SC/ST Cell',
        performedBy: 'System',
        role: 'Auto Routing',
        date: '10 Sep 2025',
        remarks: 'Forwarded to SC/ST Cell',
        status: 'Assigned',
        done: true,
        active: false,
      },
      {
        action: 'Under Review',
        performedBy: 'Dr. Kavita Singh',
        role: 'SC/ST Cell Head',
        date: '11 Sep 2025',
        remarks: 'NSP portal sync initiated',
        status: 'Under Review',
        done: true,
        active: false,
      },
      {
        action: 'Resolved',
        performedBy: 'Finance Office',
        role: 'Finance Officer',
        date: '14 Sep 2025',
        remarks: 'Scholarship amount ₹25,000 credited. UTR: SBINR2025091423',
        status: 'Resolved',
        done: true,
        active: false,
      },
      {
        action: 'Closed by Student',
        performedBy: 'Sunita Kumari',
        role: 'Student',
        date: '16 Sep 2025',
        remarks: 'Complaint closed after receiving amount',
        status: 'Closed',
        done: true,
        active: false,
      },
    ]),
    comments: [
      {
        id: 'C4',
        author: 'Dr. Kavita Singh',
        role: 'SC/ST Cell Head',
        message:
          'We have verified your records with NSP and initiated the payment process.',
        date: '11 Sep 2025',
        isInternal: false,
      },
      {
        id: 'C5',
        author: 'Sunita Kumari',
        role: 'Student',
        message:
          'I have received the amount. Thank you for the quick resolution.',
        date: '16 Sep 2025',
        isInternal: false,
      },
    ],
    notesheetNo: 'NS/2025/00421',
  },
  {
    id: 'GRV005',
    ticketNo: 'GRV/DAVV/2025/00098',
    studentName: 'Mohammed Farouk',
    enrollmentNo: 'BCA2024003',
    course: 'BCA',
    department: 'SCSIT',
    category: 'Examination Grievance',
    subCategory: 'Hall Ticket Issue',
    subject:
      'Hall ticket not generated for End Semester examination – December 2025',
    description:
      'My hall ticket has not been generated for the upcoming End Semester exam scheduled from 20 Dec 2025. The examination portal shows an error. All dues have been cleared and attendance is above 75%.',
    priority: 'Critical',
    status: 'Submitted',
    isAnonymous: false,
    incidentDate: '12 Dec 2025',
    submittedDate: '12 Dec 2025',
    location: 'SCSIT — Examination Portal (Online)',
    assignedTo: 'Pending Assignment',
    assignedDept: 'Examination Department',
    slaDeadline: '14 Dec 2025',
    slaRemainingHrs: 8,
    slaStatus: 'Near Breach',
    escalationLevel: 0,
    attachments: [
      {
        id: 'A6',
        name: 'Fee_Clearance_Receipt.pdf',
        size: '95 KB',
        type: 'PDF',
        uploadedOn: '12 Dec 2025',
        uploadedBy: 'Mohammed Farouk',
      },
      {
        id: 'A7',
        name: 'Exam_Portal_Screenshot.png',
        size: '450 KB',
        type: 'Image',
        uploadedOn: '12 Dec 2025',
        uploadedBy: 'Mohammed Farouk',
      },
    ],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Mohammed Farouk',
        role: 'Student',
        date: '12 Dec 2025 11:42',
        remarks: 'Urgent – exam in 8 days',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Pending Assignment',
        performedBy: 'Grievance Cell',
        role: 'Admin',
        date: '—',
        remarks: 'Awaiting department assignment',
        status: 'Submitted',
        done: false,
        active: true,
      },
    ]),
    comments: [],
  },
  {
    id: 'GRV006',
    ticketNo: 'GRV/DAVV/2025/00067',
    studentName: 'Kavitha Reddy',
    enrollmentNo: 'PHD2022007',
    course: 'Ph.D. (Commerce)',
    department: 'School of Commerce',
    category: 'Academic Grievance',
    subCategory: 'Degree Certificate',
    subject:
      'Ph.D. degree certificate not issued after 8 months of convocation',
    description:
      'I completed my Ph.D. and attended the convocation on 15 Apr 2025. It has been 8 months and my degree certificate has still not been issued. Multiple follow-ups to the Examination Section have been ignored.',
    priority: 'High',
    status: 'Closed',
    isAnonymous: false,
    incidentDate: '15 Apr 2025',
    submittedDate: '01 Aug 2025',
    location: 'Examination Section, DAVV Main Campus',
    assignedTo: 'Dr. P.K. Shrivastava (Registrar)',
    assignedDept: 'Examination Department',
    slaDeadline: '15 Aug 2025',
    slaRemainingHrs: 0,
    slaStatus: 'Within SLA',
    escalationLevel: 1,
    resolvedDate: '10 Aug 2025',
    closedDate: '12 Aug 2025',
    resolutionRemarks:
      'Ph.D. degree certificate dispatched via registered post. Tracking No: RP2025081012.',
    attachments: [
      {
        id: 'A8',
        name: 'Convocation_Admit_Card.pdf',
        size: '210 KB',
        type: 'PDF',
        uploadedOn: '01 Aug 2025',
        uploadedBy: 'Kavitha Reddy',
      },
    ],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Kavitha Reddy',
        role: 'Student',
        date: '01 Aug 2025',
        remarks: '',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Escalated to Registrar',
        performedBy: 'Grievance Cell',
        role: 'Admin',
        date: '05 Aug 2025',
        remarks: 'Directly routed to Registrar given seniority',
        status: 'Escalated',
        done: true,
        active: false,
      },
      {
        action: 'Resolved',
        performedBy: 'Dr. P.K. Shrivastava',
        role: 'Registrar',
        date: '10 Aug 2025',
        remarks: 'Certificate dispatched. Track No: RP2025081012',
        status: 'Resolved',
        done: true,
        active: false,
      },
      {
        action: 'Closed',
        performedBy: 'Kavitha Reddy',
        role: 'Student',
        date: '12 Aug 2025',
        remarks: 'Certificate received.',
        status: 'Closed',
        done: true,
        active: false,
      },
    ]),
    comments: [
      {
        id: 'C6',
        author: 'Dr. P.K. Shrivastava',
        role: 'Registrar',
        message:
          'Certificate has been dispatched via registered post. Please share confirmation on receipt.',
        date: '10 Aug 2025',
        isInternal: false,
      },
    ],
    notesheetNo: 'NS/2025/00198',
    complaintType: 'Student',
  },
  {
    id: 'GRV007',
    ticketNo: 'GRV/DAVV/2026/00099',
    studentName: 'Rajesh Kumar',
    enrollmentNo: 'APP12345',
    course: 'M.Sc. Chemistry',
    department: 'Chemistry Department',
    category: 'Admission Fees & Refunds',
    subCategory: 'Refund of Admission Cancellation',
    subject:
      'Refund of admission fees pending since 30 days after cancellation',
    description:
      'I cancelled my admission for M.Sc Chemistry on 10 Dec 2025 and applied for refund. No status has been updated since then.',
    priority: 'High',
    status: 'Assigned',
    isAnonymous: false,
    incidentDate: '10 Dec 2025',
    submittedDate: '12 Dec 2025',
    location: 'Online Admission Portal',
    assignedTo: 'Mr. Suresh Joshi (Finance Officer)',
    assignedDept: 'Finance Department',
    slaDeadline: '15 Dec 2025',
    slaRemainingHrs: -48,
    slaStatus: 'Breached',
    escalationLevel: 1,
    attachments: [],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Rajesh Kumar',
        role: 'Public Applicant',
        date: '12 Dec 2025 10:00',
        remarks: 'Filed via Public Portal with Application Code APP12345',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'Assigned to Department',
        performedBy: 'Grievance Cell',
        role: 'Admin',
        date: '12 Dec 2025 11:30',
        remarks: 'Assigned to Finance Department for fee verify',
        status: 'Assigned',
        done: true,
        active: true,
      },
    ]),
    comments: [],
    complaintType: 'Public',
    applicationNo: 'APP12345',
  },
  {
    id: 'GRV008',
    ticketNo: 'GRV/DAVV/2026/00100',
    studentName: 'Aarav Sharma',
    enrollmentNo: 'CS2021008',
    course: 'B.Tech CSE',
    department: 'SCSIT',
    category: 'Technical Portal Issue',
    subCategory: 'Payment Gateway Timeout',
    subject: 'Admission Fee Payment Deducted but admission status not updated',
    description:
      'Payment of ₹45,000 deducted on 05 Dec 2025. Still not updated, SLA breached at department level. Critical unresolved issue auto-forwarded to state tracking systems.',
    priority: 'Critical',
    status: 'Escalated',
    isAnonymous: false,
    incidentDate: '05 Dec 2025',
    submittedDate: '07 Dec 2025',
    location: 'Payment Gateway',
    assignedTo: 'Mr. Suresh Joshi (Finance Officer)',
    assignedDept: 'Finance Department',
    slaDeadline: '10 Dec 2025',
    slaRemainingHrs: -150,
    slaStatus: 'Breached',
    escalationLevel: 3,
    attachments: [],
    timeline: makeTimeline([
      {
        action: 'Complaint Submitted',
        performedBy: 'Aarav Sharma',
        role: 'Student',
        date: '07 Dec 2025',
        remarks: 'Payment gateway deduction failure reported',
        status: 'Submitted',
        done: true,
        active: false,
      },
      {
        action: 'SLA Breach Auto-Forward',
        performedBy: 'System Engine',
        role: 'Escalation Engine',
        date: '10 Dec 2025',
        remarks:
          'Ticket unresolved at university level. Auto-forwarded to CM Helpline 181 and UGC e-Samadhan.',
        status: 'Escalated',
        done: true,
        active: true,
      },
    ]),
    comments: [],
    complaintType: 'Student',
    isForwardedToGovt: true,
    govtPortalName: 'CM Helpline 181',
    govtRefNo: 'CMH/2026/MP/987654',
  },
];

// ─── Notesheets ──────────────────────────────────────────────

export const notesheets: Notesheet[] = [
  {
    id: 'NS001',
    notesheetNo: 'NS/2025/00892',
    complaintNo: 'GRV/DAVV/2025/00312',
    fileNo: 'EXAM/GRV/2025/892',
    subject: 'Re-evaluation of Answer Sheet – CS302 Data Structures',
    currentOfficer: 'Dr. Rakesh Verma',
    officerDesignation: 'Controller of Examinations',
    department: 'Examination Department',
    remarks:
      'The complaint has been received and verified. Answer sheet CS302 has been retrieved from the examination vault. The paper has been sent to a departmental re-evaluation panel comprising Dr. A. Gupta and Dr. S. Mehta. Their findings will be submitted by 18 Dec 2025.',
    recommendation:
      'Recommend re-evaluation of answer sheet by a 2-member committee. If marks discrepancy is found, correction order to be issued. Student to be notified within 72 hours of committee report.',
    status: 'Forwarded',
    createdDate: '15 Dec 2025',
    forwardedTo: 'HoD SCSIT',
    digitalSigned: true,
  },
  {
    id: 'NS002',
    notesheetNo: 'NS/2025/00745',
    complaintNo: 'GRV/DAVV/2025/00289',
    fileNo: 'FIN/GRV/2025/745',
    subject: 'Excess Fee Refund – MBA Semester 4',
    currentOfficer: 'Mr. Suresh Joshi',
    officerDesignation: 'Finance Officer',
    department: 'Finance Department',
    remarks:
      'Student Priya Patel submitted valid fee receipts and refund request form. Excess amount of ₹8,500 was indeed charged due to a data entry error. Refund has been approved by Finance Head.',
    recommendation:
      'Process refund of ₹8,500 to student bank account via NEFT within 5 working days. Update student ledger accordingly.',
    status: 'Approved',
    createdDate: '22 Nov 2025',
    forwardedTo: 'Registrar',
    digitalSigned: true,
  },
];

// ─── Committees ──────────────────────────────────────────────

export const committees: Committee[] = [
  {
    id: 'COM001',
    name: 'Student Grievance Redressal Committee',
    acronym: 'SGRC',
    type: 'UGC Mandated',
    chair: 'Prof. Anita Sharma',
    color: '#3b82f6',
    mandate:
      'Address academic and administrative grievances of students as per UGC regulations 2019.',
    totalCases: 124,
    pendingCases: 18,
    members: [
      {
        id: 'M1',
        name: 'Prof. Anita Sharma',
        designation: 'Dean, Student Welfare',
        department: 'Administration',
        role: 'Chair',
        contact: '9876500001',
      },
      {
        id: 'M2',
        name: 'Dr. Rakesh Verma',
        designation: 'Controller of Examinations',
        department: 'Exam Dept',
        role: 'Member Secretary',
        contact: '9876500002',
      },
      {
        id: 'M3',
        name: 'Prof. Sunil Gupta',
        designation: 'Professor',
        department: 'SCSIT',
        role: 'Member',
        contact: '9876500003',
      },
      {
        id: 'M4',
        name: 'Dr. Meena Patel',
        designation: 'Professor',
        department: 'Science',
        role: 'Member',
        contact: '9876500004',
      },
      {
        id: 'M5',
        name: 'Mr. Amit Jain',
        designation: 'Student Representative',
        department: 'MBA',
        role: 'Member',
        contact: '9876500005',
      },
    ],
    status: 'Active',
  },
  {
    id: 'COM002',
    name: 'Anti-Ragging Cell',
    acronym: 'ARC',
    type: 'UGC / AICTE Mandated',
    chair: 'Dr. P.K. Shrivastava',
    color: '#ef4444',
    mandate:
      'Prevention and prohibition of ragging in the university campus as per UGC Anti-Ragging regulations.',
    totalCases: 12,
    pendingCases: 3,
    members: [
      {
        id: 'M6',
        name: 'Dr. P.K. Shrivastava',
        designation: 'Registrar',
        department: 'Administration',
        role: 'Chair',
        contact: '9876500010',
      },
      {
        id: 'M7',
        name: 'Maj. (Retd.) R.K. Singh',
        designation: 'Chief Warden',
        department: 'Hostel',
        role: 'Member Secretary',
        contact: '9876500011',
      },
      {
        id: 'M8',
        name: 'Inspector Vikram Tiwari',
        designation: 'Police Liaison Officer',
        department: 'External',
        role: 'Member',
        contact: '9876500012',
      },
    ],
    status: 'Active',
  },
  {
    id: 'COM003',
    name: 'Internal Complaints Committee',
    acronym: 'ICC',
    type: 'POSH Act Mandated',
    chair: 'Dr. Sunita Rao',
    color: '#ec4899',
    mandate:
      'Prevention, prohibition and redressal of sexual harassment of women at workplace as per POSH Act 2013.',
    totalCases: 8,
    pendingCases: 1,
    members: [
      {
        id: 'M9',
        name: 'Dr. Sunita Rao',
        designation: 'Professor (Women Cell Head)',
        department: 'Women Cell',
        role: 'Chair',
        contact: '9876500020',
      },
      {
        id: 'M10',
        name: 'Ms. Priya Mishra',
        designation: 'Legal Advisor',
        department: 'External NGO',
        role: 'Member',
        contact: '9876500021',
      },
    ],
    status: 'Active',
  },
  {
    id: 'COM004',
    name: 'SC/ST Students Grievance Cell',
    acronym: 'SCST',
    type: 'Government Mandated',
    chair: 'Dr. Kavita Singh',
    color: '#8b5cf6',
    mandate:
      'Redressal of grievances of SC/ST students related to scholarship, hostel, discrimination and rights.',
    totalCases: 34,
    pendingCases: 5,
    members: [
      {
        id: 'M11',
        name: 'Dr. Kavita Singh',
        designation: 'Nodal Officer – SC/ST',
        department: 'SC/ST Cell',
        role: 'Chair',
        contact: '9876500030',
      },
      {
        id: 'M12',
        name: 'Prof. Ram Dayal',
        designation: 'Professor',
        department: 'Arts',
        role: 'Member',
        contact: '9876500031',
      },
    ],
    status: 'Active',
  },
  {
    id: 'COM005',
    name: 'Examination Grievance Committee',
    acronym: 'EGC',
    type: 'University Mandated',
    chair: 'Dr. Rakesh Verma',
    color: '#0891b2',
    mandate:
      'Address all examination-related grievances including result disputes, hall ticket issues and paper issues.',
    totalCases: 56,
    pendingCases: 12,
    members: [
      {
        id: 'M13',
        name: 'Dr. Rakesh Verma',
        designation: 'Controller of Examinations',
        department: 'Exam Dept',
        role: 'Chair',
        contact: '9876500040',
      },
      {
        id: 'M14',
        name: 'Mr. Rajesh Kumar',
        designation: 'Deputy Controller',
        department: 'Exam Dept',
        role: 'Member Secretary',
        contact: '9876500041',
      },
    ],
    status: 'Active',
  },
  {
    id: 'COM006',
    name: 'Finance Grievance Committee',
    acronym: 'FGC',
    type: 'University Mandated',
    chair: 'Mr. Suresh Joshi',
    color: '#10b981',
    mandate:
      'Resolve all financial grievances including fee refunds, scholarship disbursement delays and billing disputes.',
    totalCases: 29,
    pendingCases: 7,
    members: [
      {
        id: 'M15',
        name: 'Mr. Suresh Joshi',
        designation: 'Finance Officer',
        department: 'Finance',
        role: 'Chair',
        contact: '9876500050',
      },
    ],
    status: 'Active',
  },
];

// ─── SLA Rules ───────────────────────────────────────────────

export const slaRules: SLARule[] = [
  {
    id: 'SLA001',
    category: 'Anti-Ragging',
    priority: 'Critical',
    responseTimeHrs: 1,
    resolutionTimeHrs: 12,
    reminderHrs: 6,
    escalationHrs: 12,
    escalateTo: 'Registrar',
  },
  {
    id: 'SLA002',
    category: 'Sexual Harassment / ICC',
    priority: 'Critical',
    responseTimeHrs: 2,
    resolutionTimeHrs: 24,
    reminderHrs: 12,
    escalationHrs: 24,
    escalateTo: 'Vice Chancellor',
  },
  {
    id: 'SLA003',
    category: 'Financial Grievance',
    priority: 'Critical',
    responseTimeHrs: 4,
    resolutionTimeHrs: 48,
    reminderHrs: 24,
    escalationHrs: 48,
    escalateTo: 'Registrar',
  },
  {
    id: 'SLA004',
    category: 'Academic Grievance',
    priority: 'High',
    responseTimeHrs: 8,
    resolutionTimeHrs: 72,
    reminderHrs: 36,
    escalationHrs: 72,
    escalateTo: 'HoD',
  },
  {
    id: 'SLA005',
    category: 'Examination Grievance',
    priority: 'High',
    responseTimeHrs: 4,
    resolutionTimeHrs: 36,
    reminderHrs: 20,
    escalationHrs: 36,
    escalateTo: 'Exam Controller',
  },
  {
    id: 'SLA006',
    category: 'SC/ST Grievance',
    priority: 'High',
    responseTimeHrs: 8,
    resolutionTimeHrs: 48,
    reminderHrs: 24,
    escalationHrs: 48,
    escalateTo: 'Dean Welfare',
  },
  {
    id: 'SLA007',
    category: 'Hostel & Infrastructure',
    priority: 'Medium',
    responseTimeHrs: 12,
    resolutionTimeHrs: 24,
    reminderHrs: 12,
    escalationHrs: 24,
    escalateTo: 'Chief Warden',
  },
  {
    id: 'SLA008',
    category: 'Administrative Grievance',
    priority: 'Low',
    responseTimeHrs: 24,
    resolutionTimeHrs: 96,
    reminderHrs: 48,
    escalationHrs: 96,
    escalateTo: 'Registrar',
  },
];

// ─── Integration Portals ─────────────────────────────────────

export const integrationPortals: IntegrationPortal[] = [
  {
    id: 'INT001',
    name: 'UGC e-Samadhan Portal',
    acronym: 'UGC',
    type: 'Central Govt',
    endpoint: 'https://esamadhan.ugc.ac.in/api/v2',
    status: 'Connected',
    lastSync: '08 Dec 2025 14:30',
    pendingRequests: 3,
    failedRequests: 0,
    totalSynced: 248,
    color: '#3b82f6',
    description:
      'Student grievance portal mandated by UGC for all universities.',
  },
  {
    id: 'INT002',
    name: 'AICTE Grievance Portal',
    acronym: 'AICTE',
    type: 'Central Govt',
    endpoint: 'https://grievance.aicte-india.org/api',
    status: 'Connected',
    lastSync: '07 Dec 2025 10:00',
    pendingRequests: 1,
    failedRequests: 2,
    totalSynced: 89,
    color: '#0891b2',
    description: 'AICTE grievance redressal system for technical institutes.',
  },
  {
    id: 'INT003',
    name: 'CM Helpline 181 (MP)',
    acronym: 'CM181',
    type: 'State Govt',
    endpoint: 'https://api.mpcmhelpline.mp.gov.in',
    status: 'Connected',
    lastSync: '08 Dec 2025 09:15',
    pendingRequests: 7,
    failedRequests: 1,
    totalSynced: 312,
    color: '#7c3aed',
    description: 'Madhya Pradesh CM Helpline 181 complaint integration.',
  },
  {
    id: 'INT004',
    name: 'CPGRAMS (Central)',
    acronym: 'CPGRAMS',
    type: 'Central Govt',
    endpoint: 'https://pgportal.gov.in/api/v3',
    status: 'Connected',
    lastSync: '06 Dec 2025 16:45',
    pendingRequests: 12,
    failedRequests: 3,
    totalSynced: 178,
    color: '#059669',
    description: 'Centralized Public Grievance Redress and Monitoring System.',
  },
  {
    id: 'INT005',
    name: 'Jan Sunwai Portal (MP)',
    acronym: 'JANSUN',
    type: 'State Govt',
    endpoint: 'https://jansunwai.mp.gov.in/api',
    status: 'Error',
    lastSync: '01 Dec 2025 08:00',
    pendingRequests: 0,
    failedRequests: 9,
    totalSynced: 54,
    color: '#dc2626',
    description:
      'MP State Jan Sunwai Portal — currently experiencing API errors.',
  },
  {
    id: 'INT006',
    name: 'National Anti-Ragging Helpline',
    acronym: 'NARH',
    type: 'Central Govt',
    endpoint: 'https://antiragging.in/api/v1',
    status: 'Connected',
    lastSync: '08 Dec 2025 12:00',
    pendingRequests: 2,
    failedRequests: 0,
    totalSynced: 15,
    color: '#ef4444',
    description: 'UGC-mandated National Anti-Ragging Portal integration.',
  },
  {
    id: 'INT007',
    name: 'DigiLocker Document Verify',
    acronym: 'DIGILOCKER',
    type: 'Central Govt',
    endpoint: 'https://api.digilocker.gov.in/v2',
    status: 'Connected',
    lastSync: '08 Dec 2025 11:30',
    pendingRequests: 0,
    failedRequests: 0,
    totalSynced: 890,
    color: '#f59e0b',
    description: 'DigiLocker document verification for grievance attachments.',
  },
  {
    id: 'INT008',
    name: 'eSign Gateway (Aadhaar)',
    acronym: 'ESIGN',
    type: 'Central Govt',
    endpoint: 'https://esign.cdac.in/esignlevel2',
    status: 'Connected',
    lastSync: '08 Dec 2025 08:00',
    pendingRequests: 0,
    failedRequests: 0,
    totalSynced: 234,
    color: '#6366f1',
    description: 'Aadhaar-based eSign for digital notesheet signatures.',
  },
  {
    id: 'INT009',
    name: 'SMS Gateway (BSNL)',
    acronym: 'SMS',
    type: 'Utility',
    endpoint: 'https://sms.bsnl.in/api/send',
    status: 'Connected',
    lastSync: '08 Dec 2025 17:00',
    pendingRequests: 0,
    failedRequests: 0,
    totalSynced: 4521,
    color: '#64748b',
    description: 'Bulk SMS notification gateway for grievance updates.',
  },
  {
    id: 'INT010',
    name: 'Email Server (DAVV)',
    acronym: 'EMAIL',
    type: 'Utility',
    endpoint: 'smtp.davv.ac.in:587',
    status: 'Connected',
    lastSync: '08 Dec 2025 17:00',
    pendingRequests: 0,
    failedRequests: 0,
    totalSynced: 3201,
    color: '#64748b',
    description: 'University email server for grievance notifications.',
  },
  {
    id: 'INT011',
    name: 'WhatsApp Business API',
    acronym: 'WA',
    type: 'Utility',
    endpoint: 'https://graph.facebook.com/v18.0',
    status: 'Syncing',
    lastSync: '08 Dec 2025 16:30',
    pendingRequests: 5,
    failedRequests: 0,
    totalSynced: 1234,
    color: '#16a34a',
    description: 'WhatsApp Business API for instant grievance status updates.',
  },
  {
    id: 'INT012',
    name: 'Government eOffice',
    acronym: 'eOFFICE',
    type: 'Central Govt',
    endpoint: 'https://eoffice.gov.in/api/v1',
    status: 'Disconnected',
    lastSync: '28 Nov 2025 09:00',
    pendingRequests: 0,
    failedRequests: 14,
    totalSynced: 67,
    color: '#9ca3af',
    description:
      'Central eOffice integration for inter-departmental forwarding.',
  },
];

// ─── Audit Logs ──────────────────────────────────────────────

export const auditLogs: AuditLog[] = [
  {
    id: 'AUD001',
    action: 'Complaint Submitted',
    module: 'Student Portal',
    performedBy: 'Arjun Sharma',
    role: 'Student',
    ipAddress: '10.20.1.45',
    date: '15 Dec 2025',
    time: '09:14:32',
    ticketNo: 'GRV/DAVV/2025/00312',
  },
  {
    id: 'AUD002',
    action: 'Auto Assignment',
    module: 'Escalation Engine',
    performedBy: 'System',
    role: 'Automation',
    ipAddress: '127.0.0.1',
    date: '15 Dec 2025',
    time: '09:14:35',
    ticketNo: 'GRV/DAVV/2025/00312',
  },
  {
    id: 'AUD003',
    action: 'Notesheet Created',
    module: 'Dept Portal',
    performedBy: 'Dr. Rakesh Verma',
    role: 'Exam Controller',
    ipAddress: '10.20.5.12',
    date: '15 Dec 2025',
    time: '11:30:45',
    ticketNo: 'GRV/DAVV/2025/00312',
    newValue: 'NS/2025/00892',
  },
  {
    id: 'AUD004',
    action: 'Status Changed',
    module: 'Dept Portal',
    performedBy: 'Dr. Rakesh Verma',
    role: 'Exam Controller',
    ipAddress: '10.20.5.12',
    date: '16 Dec 2025',
    time: '14:00:00',
    oldValue: 'Assigned',
    newValue: 'Under Review',
    ticketNo: 'GRV/DAVV/2025/00312',
  },
  {
    id: 'AUD005',
    action: 'SLA Breach Auto-Escalate',
    module: 'Escalation Engine',
    performedBy: 'System',
    role: 'Automation',
    ipAddress: '127.0.0.1',
    date: '27 Nov 2025',
    time: '00:00:01',
    ticketNo: 'GRV/DAVV/2025/00289',
  },
  {
    id: 'AUD006',
    action: 'Complaint Resolved',
    module: 'Admin Portal',
    performedBy: 'Dr. Kavita Singh',
    role: 'SC/ST Cell Head',
    ipAddress: '10.20.3.8',
    date: '14 Sep 2025',
    time: '16:20:10',
    ticketNo: 'GRV/DAVV/2025/00178',
  },
  {
    id: 'AUD007',
    action: 'User Login',
    module: 'Auth',
    performedBy: 'Admin User',
    role: 'System Admin',
    ipAddress: '10.20.0.1',
    date: '08 Dec 2025',
    time: '09:00:00',
  },
  {
    id: 'AUD008',
    action: 'SLA Rule Modified',
    module: 'Admin Portal',
    performedBy: 'System Admin',
    role: 'Admin',
    ipAddress: '10.20.0.1',
    date: '01 Dec 2025',
    time: '10:15:00',
    oldValue: '24 hrs',
    newValue: '12 hrs',
  },
  {
    id: 'AUD009',
    action: 'Appeal Filed',
    module: 'Student Portal',
    performedBy: 'Priya Patel',
    role: 'Student',
    ipAddress: '10.20.2.77',
    date: '05 Dec 2025',
    time: '11:30:00',
    ticketNo: 'GRV/DAVV/2025/00289',
  },
  {
    id: 'AUD010',
    action: 'UGC Sync Initiated',
    module: 'Integration Hub',
    performedBy: 'System Admin',
    role: 'Admin',
    ipAddress: '10.20.0.1',
    date: '08 Dec 2025',
    time: '14:30:00',
  },
];

// ─── Notification Templates ──────────────────────────────────

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'NT001',
    event: 'Complaint Submitted',
    channel: 'SMS',
    body: 'Dear {NAME}, Your grievance {TICKET_NO} has been registered. Track at: {LINK}. DAVV Grievance Cell.',
    isActive: true,
  },
  {
    id: 'NT002',
    event: 'Complaint Assigned',
    channel: 'Email',
    subject: 'Grievance Assigned — {TICKET_NO}',
    body: 'Dear {NAME},\n\nYour complaint {TICKET_NO} has been assigned to {DEPT}.\n\nExpected resolution: {SLA_DATE}.\n\nRegards,\nDAVV Grievance Cell',
    isActive: true,
  },
  {
    id: 'NT003',
    event: 'Complaint Escalated',
    channel: 'SMS',
    body: 'ALERT: Grievance {TICKET_NO} has been escalated to {AUTHORITY}. DAVV ERP.',
    isActive: true,
  },
  {
    id: 'NT004',
    event: 'Complaint Resolved',
    channel: 'WhatsApp',
    body: '✅ Grievance {TICKET_NO} has been Resolved.\n\nResolution: {REMARKS}\n\nIf unsatisfied, appeal within 30 days.\n— DAVV Grievance Cell',
    isActive: true,
  },
  {
    id: 'NT005',
    event: 'SLA Near Breach',
    channel: 'Push',
    body: 'SLA Warning: Grievance {TICKET_NO} is nearing its deadline. Immediate action required.',
    isActive: true,
  },
  {
    id: 'NT006',
    event: 'SLA Breached',
    channel: 'Email',
    subject: 'URGENT: SLA Breached — {TICKET_NO}',
    body: 'SLA for grievance {TICKET_NO} has been breached. Immediate escalation has been triggered.',
    isActive: true,
  },
  {
    id: 'NT007',
    event: 'Appeal Submitted',
    channel: 'SMS',
    body: 'Appeal received for {TICKET_NO}. HoD/Registrar will review within 7 working days. DAVV.',
    isActive: true,
  },
];

// ─── Department Mapping ──────────────────────────────────────

export const departmentMappings = [
  {
    id: 'DM001',
    category: 'Academic Grievance',
    department: 'Examination Department',
    nodal: 'Dr. Rakesh Verma',
    email: 'examcontroller@davv.ac.in',
  },
  {
    id: 'DM002',
    category: 'Financial Grievance',
    department: 'Finance Department',
    nodal: 'Mr. Suresh Joshi',
    email: 'finance@davv.ac.in',
  },
  {
    id: 'DM003',
    category: 'Hostel & Infrastructure',
    department: 'Hostel Administration',
    nodal: 'Maj. R.K. Singh',
    email: 'hostelwarden@davv.ac.in',
  },
  {
    id: 'DM004',
    category: 'Anti-Ragging',
    department: 'Anti-Ragging Cell',
    nodal: 'Dr. P.K. Shrivastava',
    email: 'antiragging@davv.ac.in',
  },
  {
    id: 'DM005',
    category: 'Sexual Harassment / ICC',
    department: 'ICC / Women Cell',
    nodal: 'Dr. Sunita Rao',
    email: 'icc@davv.ac.in',
  },
  {
    id: 'DM006',
    category: 'SC/ST Grievance',
    department: 'SC/ST Cell',
    nodal: 'Dr. Kavita Singh',
    email: 'scst@davv.ac.in',
  },
  {
    id: 'DM007',
    category: 'Examination Grievance',
    department: 'Examination Department',
    nodal: 'Dr. Rakesh Verma',
    email: 'examcontroller@davv.ac.in',
  },
  {
    id: 'DM008',
    category: 'Administrative Grievance',
    department: 'Registrar Office',
    nodal: 'Dr. P.K. Shrivastava',
    email: 'registrar@davv.ac.in',
  },
];
