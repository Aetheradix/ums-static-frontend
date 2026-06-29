// ============================================================
//  Scholarship & DBT Module — Comprehensive Mock Data
// ============================================================

// ─── Types ───────────────────────────────────────────────────
export interface ScholarshipScheme {
  id: string;
  name: string;
  type: 'Central' | 'State' | 'University' | 'Private' | 'Minority';
  category: string[];
  lastDate: string;
  amount: number;
  eligibility: string;
  portal: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  color: string;
}

export interface StudentApplication {
  id: string;
  appNo: string;
  studentName: string;
  enrollmentNo: string;
  course: string;
  branch: string;
  semester: string;
  department: string;
  category: string;
  schemeId: string;
  schemeName: string;
  academicYear: string;
  annualIncome: number;
  aadhaarNo: string;
  bankAccount: string;
  ifsc: string;
  bankName: string;
  npciSeeded: boolean;
  attendancePct: number;
  cgpa: number;
  submittedDate: string;
  status:
    | 'Draft'
    | 'Submitted'
    | 'Teacher Verified'
    | 'Cell Verified'
    | 'Finance Verified'
    | 'Admin Approved'
    | 'Govt Synced'
    | 'Govt Verified'
    | 'Sanctioned'
    | 'DBT Processed'
    | 'Credited'
    | 'Rejected'
    | 'On Hold';
  amount: number;
  teacherRemarks?: string;
  cellRemarks?: string;
  financeRemarks?: string;
  rejectionReason?: string;
  dbtTxnId?: string;
  utrNo?: string;
  creditedDate?: string;
}

export interface Document {
  id: string;
  label: string;
  fileName?: string;
  uploaded: boolean;
  verified?: 'Verified' | 'Rejected' | 'Pending';
  mandatory: boolean;
  size?: string;
  uploadedOn?: string;
}

export interface GovtPortal {
  id: string;
  name: string;
  acronym: string;
  type: string;
  endpoint: string;
  apiKey: string;
  status: 'Active' | 'Inactive' | 'Error' | 'Syncing';
  lastSync: string;
  totalSynced: number;
  failedCount: number;
  color: string;
}

export interface SyncLog {
  id: string;
  portal: string;
  action: string;
  status: 'Success' | 'Failed' | 'Partial';
  records: number;
  timestamp: string;
  initiatedBy: string;
  errorMsg?: string;
}

export interface DbtTransaction {
  id: string;
  appNo: string;
  studentName: string;
  bankAccount: string;
  ifsc: string;
  amount: number;
  txnId: string;
  utrNo: string;
  date: string;
  mode: string;
  status: 'Success' | 'Failed' | 'Pending' | 'Bounced';
  remarks?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

export interface Grievance {
  id: string;
  ticketNo: string;
  studentName: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  raisedOn: string;
  resolvedOn?: string;
  remarks: string;
}

// ─── Scholarship Schemes ──────────────────────────────────────
export const scholarshipSchemes: ScholarshipScheme[] = [
  {
    id: 'sch-01',
    name: 'Post Matric Scholarship for SC Students',
    type: 'Central',
    category: ['SC'],
    lastDate: '31 Oct 2025',
    amount: 28000,
    eligibility: 'SC category, family income < ₹2.5 lakh/yr',
    portal: 'NSP',
    status: 'Open',
    color: '#2563eb',
  },
  {
    id: 'sch-02',
    name: 'Post Matric Scholarship for ST Students',
    type: 'Central',
    category: ['ST'],
    lastDate: '31 Oct 2025',
    amount: 25000,
    eligibility: 'ST category, family income < ₹2.5 lakh/yr',
    portal: 'NSP',
    status: 'Open',
    color: '#7c3aed',
  },
  {
    id: 'sch-03',
    name: 'PM-Yasasvi Scholarship Scheme',
    type: 'Central',
    category: ['OBC', 'EBC', 'DNT'],
    lastDate: '15 Nov 2025',
    amount: 48000,
    eligibility: 'OBC/EBC/DNT, family income < ₹2.5 lakh/yr',
    portal: 'NSP',
    status: 'Open',
    color: '#059669',
  },
  {
    id: 'sch-04',
    name: 'Mukhya Mantri Medhavi Vidyarthi Yojana (MMVY)',
    type: 'State',
    category: ['General', 'OBC', 'SC', 'ST'],
    lastDate: '30 Sep 2025',
    amount: 75000,
    eligibility: 'MP domicile, 12th ≥ 70% (MP Board) / 85% (Others)',
    portal: 'MP Scholarship Portal',
    status: 'Open',
    color: '#d97706',
  },
  {
    id: 'sch-05',
    name: 'Mukhya Mantri Jankalyan Scheme (Sambal)',
    type: 'State',
    category: ['General (Sambal)'],
    lastDate: '31 Oct 2025',
    amount: 55000,
    eligibility: 'Registered under Jan Kalyan Yojana',
    portal: 'MP Scholarship Portal',
    status: 'Open',
    color: '#dc2626',
  },
  {
    id: 'sch-06',
    name: 'Minority Scholarship Scheme',
    type: 'Minority',
    category: ['Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi'],
    lastDate: '15 Dec 2025',
    amount: 30000,
    eligibility: 'Minority community, family income < ₹2 lakh/yr',
    portal: 'NSP',
    status: 'Open',
    color: '#0891b2',
  },
  {
    id: 'sch-07',
    name: 'DAVV Merit Scholarship',
    type: 'University',
    category: ['General', 'OBC', 'SC', 'ST'],
    lastDate: '31 Aug 2025',
    amount: 20000,
    eligibility: 'CGPA ≥ 8.0 in previous semester',
    portal: 'University Portal',
    status: 'Open',
    color: '#be185d',
  },
  {
    id: 'sch-08',
    name: 'National Means-cum-Merit Scholarship',
    type: 'Central',
    category: ['EWS'],
    lastDate: '30 Nov 2025',
    amount: 12000,
    eligibility: 'Family income < ₹1.5 lakh/yr, merit',
    portal: 'NSP',
    status: 'Upcoming',
    color: '#4f46e5',
  },
  {
    id: 'sch-09',
    name: 'Sports Excellence Scholarship',
    type: 'University',
    category: ['General', 'OBC', 'SC', 'ST'],
    lastDate: '30 Sep 2025',
    amount: 15000,
    eligibility: 'State/National level sports achievement',
    portal: 'University Portal',
    status: 'Open',
    color: '#16a34a',
  },
  {
    id: 'sch-10',
    name: 'EWS Scholarship — Higher Education',
    type: 'State',
    category: ['EWS'],
    lastDate: '31 Oct 2025',
    amount: 35000,
    eligibility: 'EWS certificate, family income < ₹8 lakh/yr',
    portal: 'State Portal',
    status: 'Open',
    color: '#9333ea',
  },
];

// ─── Student Applications ─────────────────────────────────────
export const studentApplications: StudentApplication[] = [
  {
    id: 'app-001',
    appNo: 'DAVV/SCH/2025/001',
    studentName: 'Priya Sharma',
    enrollmentNo: 'CS2023001',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: 'Sem V',
    department: 'School of Computer Science',
    category: 'SC',
    schemeId: 'sch-01',
    schemeName: 'Post Matric Scholarship for SC Students',
    academicYear: '2025-26',
    annualIncome: 180000,
    aadhaarNo: '2345 XXXX XXXX 7890',
    bankAccount: '3456789012',
    ifsc: 'SBIN0001234',
    bankName: 'State Bank of India',
    npciSeeded: true,
    attendancePct: 82,
    cgpa: 8.2,
    submittedDate: '15 Sep 2025',
    status: 'Cell Verified',
    amount: 28000,
    teacherRemarks: 'Attendance and academic records verified.',
    cellRemarks: 'Documents verified. Forwarded to finance.',
  },
  {
    id: 'app-002',
    appNo: 'DAVV/SCH/2025/002',
    studentName: 'Rahul Verma',
    enrollmentNo: 'ME2023045',
    course: 'B.Tech',
    branch: 'Mechanical Engineering',
    semester: 'Sem V',
    department: 'School of Engineering',
    category: 'OBC',
    schemeId: 'sch-03',
    schemeName: 'PM-Yasasvi Scholarship Scheme',
    academicYear: '2025-26',
    annualIncome: 220000,
    aadhaarNo: '5678 XXXX XXXX 1234',
    bankAccount: '7890123456',
    ifsc: 'HDFC0005678',
    bankName: 'HDFC Bank',
    npciSeeded: true,
    attendancePct: 78,
    cgpa: 7.8,
    submittedDate: '12 Sep 2025',
    status: 'Submitted',
    amount: 48000,
  },
  {
    id: 'app-003',
    appNo: 'DAVV/SCH/2025/003',
    studentName: 'Anita Patel',
    enrollmentNo: 'MBA2024010',
    course: 'MBA',
    branch: 'Finance',
    semester: 'Sem III',
    department: 'School of Management',
    category: 'General',
    schemeId: 'sch-04',
    schemeName: 'Mukhya Mantri Medhavi Vidyarthi Yojana',
    academicYear: '2025-26',
    annualIncome: 450000,
    aadhaarNo: '9012 XXXX XXXX 3456',
    bankAccount: '1234567890',
    ifsc: 'PUNB0123456',
    bankName: 'Punjab National Bank',
    npciSeeded: false,
    attendancePct: 91,
    cgpa: 9.1,
    submittedDate: '10 Sep 2025',
    status: 'Teacher Verified',
    amount: 75000,
    teacherRemarks: 'Excellent academic performance. Recommended.',
  },
  {
    id: 'app-004',
    appNo: 'DAVV/SCH/2025/004',
    studentName: 'Suresh Kumar',
    enrollmentNo: 'LAW2023022',
    course: 'LLB',
    branch: 'Criminal Law',
    semester: 'Sem III',
    department: 'School of Law',
    category: 'ST',
    schemeId: 'sch-02',
    schemeName: 'Post Matric Scholarship for ST Students',
    academicYear: '2025-26',
    annualIncome: 150000,
    aadhaarNo: '6789 XXXX XXXX 0123',
    bankAccount: '2345678901',
    ifsc: 'BKID0002345',
    bankName: 'Bank of India',
    npciSeeded: true,
    attendancePct: 75,
    cgpa: 7.2,
    submittedDate: '08 Sep 2025',
    status: 'Credited',
    amount: 25000,
    dbtTxnId: 'DBT2025091512345',
    utrNo: 'UTR987654321098',
    creditedDate: '25 Sep 2025',
  },
  {
    id: 'app-005',
    appNo: 'DAVV/SCH/2025/005',
    studentName: 'Meena Rajput',
    enrollmentNo: 'PHD2022005',
    course: 'Ph.D',
    branch: 'Biotechnology',
    semester: 'Sem VII',
    department: 'School of Life Sciences',
    category: 'EWS',
    schemeId: 'sch-10',
    schemeName: 'EWS Scholarship — Higher Education',
    academicYear: '2025-26',
    annualIncome: 320000,
    aadhaarNo: '3456 XXXX XXXX 7891',
    bankAccount: '3456789013',
    ifsc: 'ICIC0003456',
    bankName: 'ICICI Bank',
    npciSeeded: true,
    attendancePct: 88,
    cgpa: 8.8,
    submittedDate: '20 Sep 2025',
    status: 'Admin Approved',
    amount: 35000,
  },
  {
    id: 'app-006',
    appNo: 'DAVV/SCH/2025/006',
    studentName: 'Vikram Singh',
    enrollmentNo: 'BCA2024031',
    course: 'BCA',
    branch: 'Computer Applications',
    semester: 'Sem III',
    department: 'School of Computer Science',
    category: 'OBC',
    schemeId: 'sch-03',
    schemeName: 'PM-Yasasvi Scholarship Scheme',
    academicYear: '2025-26',
    annualIncome: 195000,
    aadhaarNo: '7890 XXXX XXXX 4567',
    bankAccount: '4567890124',
    ifsc: 'UTBI0004567',
    bankName: 'Union Bank of India',
    npciSeeded: true,
    attendancePct: 68,
    cgpa: 6.5,
    submittedDate: '18 Sep 2025',
    status: 'Rejected',
    amount: 48000,
    rejectionReason: 'Attendance below 75% threshold required.',
  },
  {
    id: 'app-007',
    appNo: 'DAVV/SCH/2025/007',
    studentName: 'Pooja Yadav',
    enrollmentNo: 'MSC2024008',
    course: 'M.Sc',
    branch: 'Chemistry',
    semester: 'Sem I',
    department: 'School of Sciences',
    category: 'SC',
    schemeId: 'sch-01',
    schemeName: 'Post Matric Scholarship for SC Students',
    academicYear: '2025-26',
    annualIncome: 165000,
    aadhaarNo: '1234 XXXX XXXX 5678',
    bankAccount: '5678901235',
    ifsc: 'CNRB0005678',
    bankName: 'Canara Bank',
    npciSeeded: true,
    attendancePct: 92,
    cgpa: 9.3,
    submittedDate: '22 Sep 2025',
    status: 'DBT Processed',
    amount: 28000,
    dbtTxnId: 'DBT2025092267890',
  },
  {
    id: 'app-008',
    appNo: 'DAVV/SCH/2025/008',
    studentName: 'Ravi Mishra',
    enrollmentNo: 'BA2023055',
    course: 'B.A.',
    branch: 'History',
    semester: 'Sem V',
    department: 'School of Social Sciences',
    category: 'General',
    schemeId: 'sch-07',
    schemeName: 'DAVV Merit Scholarship',
    academicYear: '2025-26',
    annualIncome: 550000,
    aadhaarNo: '8901 XXXX XXXX 2345',
    bankAccount: '6789012346',
    ifsc: 'BARB0006789',
    bankName: 'Bank of Baroda',
    npciSeeded: false,
    attendancePct: 87,
    cgpa: 8.9,
    submittedDate: '05 Sep 2025',
    status: 'On Hold',
    amount: 20000,
    cellRemarks: 'Pending NPCI bank seeding. Student notified.',
  },
];

// ─── Documents Master ─────────────────────────────────────────
export const documentsMaster: Document[] = [
  {
    id: 'doc-01',
    label: 'Aadhaar Card',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'aadhaar_priya.pdf',
    size: '1.2 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-02',
    label: 'Income Certificate',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'income_cert.pdf',
    size: '0.8 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-03',
    label: 'Caste Certificate',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'caste_cert.pdf',
    size: '0.6 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-04',
    label: 'Domicile Certificate',
    mandatory: true,
    uploaded: true,
    verified: 'Pending',
    fileName: 'domicile.pdf',
    size: '0.7 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-05',
    label: 'Bonafide Certificate',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'bonafide.pdf',
    size: '0.5 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-06',
    label: 'Latest Marksheet',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'marksheet_sem4.pdf',
    size: '1.5 MB',
    uploadedOn: '15 Sep 2025',
  },
  {
    id: 'doc-07',
    label: 'Transfer Certificate',
    mandatory: false,
    uploaded: false,
    verified: undefined,
  },
  {
    id: 'doc-08',
    label: 'Migration Certificate',
    mandatory: false,
    uploaded: false,
    verified: undefined,
  },
  {
    id: 'doc-09',
    label: 'Fee Receipt',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'fee_receipt_2025.pdf',
    size: '0.4 MB',
    uploadedOn: '14 Sep 2025',
  },
  {
    id: 'doc-10',
    label: 'Bank Passbook',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'passbook.pdf',
    size: '2.1 MB',
    uploadedOn: '14 Sep 2025',
  },
  {
    id: 'doc-11',
    label: 'Cancelled Cheque',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'cheque.jpg',
    size: '0.3 MB',
    uploadedOn: '14 Sep 2025',
  },
  {
    id: 'doc-12',
    label: 'Passport Photo',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'photo.jpg',
    size: '0.1 MB',
    uploadedOn: '13 Sep 2025',
  },
  {
    id: 'doc-13',
    label: 'Signature',
    mandatory: true,
    uploaded: true,
    verified: 'Verified',
    fileName: 'signature.jpg',
    size: '0.1 MB',
    uploadedOn: '13 Sep 2025',
  },
  {
    id: 'doc-14',
    label: 'Disability Certificate',
    mandatory: false,
    uploaded: false,
    verified: undefined,
  },
  {
    id: 'doc-15',
    label: 'NCC Certificate',
    mandatory: false,
    uploaded: false,
    verified: undefined,
  },
  {
    id: 'doc-16',
    label: 'Sports Certificate',
    mandatory: false,
    uploaded: false,
    verified: undefined,
  },
];

// ─── Government Portals ────────────────────────────────────────
export const govtPortals: GovtPortal[] = [
  {
    id: 'gp-01',
    name: 'National Scholarship Portal',
    acronym: 'NSP',
    type: 'Central',
    endpoint: 'https://api.scholarships.gov.in/v2',
    apiKey: 'NSP_KEY_****',
    status: 'Active',
    lastSync: '29 Jun 2025, 08:00 AM',
    totalSynced: 1284,
    failedCount: 12,
    color: '#2563eb',
  },
  {
    id: 'gp-02',
    name: 'State Scholarship Portal (MP)',
    acronym: 'State',
    type: 'State',
    endpoint: 'https://api.scholarshipportal.mp.gov.in/v1',
    apiKey: 'MP_KEY_****',
    status: 'Active',
    lastSync: '29 Jun 2025, 09:15 AM',
    totalSynced: 865,
    failedCount: 5,
    color: '#16a34a',
  },
  {
    id: 'gp-03',
    name: 'Public Financial Management System',
    acronym: 'PFMS',
    type: 'Central',
    endpoint: 'https://pfms.nic.in/api/v3',
    apiKey: 'PFMS_KEY_****',
    status: 'Active',
    lastSync: '28 Jun 2025, 06:00 PM',
    totalSynced: 2150,
    failedCount: 8,
    color: '#d97706',
  },
  {
    id: 'gp-04',
    name: 'NPCI Aadhaar Mapper',
    acronym: 'NPCI',
    type: 'Central',
    endpoint: 'https://api.npci.org.in/mapper/v2',
    apiKey: 'NPCI_KEY_****',
    status: 'Active',
    lastSync: '29 Jun 2025, 07:30 AM',
    totalSynced: 1450,
    failedCount: 22,
    color: '#7c3aed',
  },
  {
    id: 'gp-05',
    name: 'UIDAI Aadhaar Authentication',
    acronym: 'UIDAI',
    type: 'Central',
    endpoint: 'https://auth.uidai.gov.in/v2.5',
    apiKey: 'UIDAI_KEY_****',
    status: 'Active',
    lastSync: '29 Jun 2025, 10:00 AM',
    totalSynced: 1380,
    failedCount: 3,
    color: '#0891b2',
  },
  {
    id: 'gp-06',
    name: 'Academic Bank of Credits',
    acronym: 'ABC',
    type: 'Central',
    endpoint: 'https://abc.gov.in/api/v1',
    apiKey: 'ABC_KEY_****',
    status: 'Active',
    lastSync: '28 Jun 2025, 03:00 PM',
    totalSynced: 980,
    failedCount: 0,
    color: '#be185d',
  },
  {
    id: 'gp-07',
    name: 'DigiLocker Document Vault',
    acronym: 'DigiLocker',
    type: 'Central',
    endpoint: 'https://api.digilocker.gov.in/v2',
    apiKey: 'DL_KEY_****',
    status: 'Active',
    lastSync: '29 Jun 2025, 08:45 AM',
    totalSynced: 1120,
    failedCount: 7,
    color: '#059669',
  },
  {
    id: 'gp-08',
    name: 'MAHA DBT Portal',
    acronym: 'MAHA',
    type: 'State',
    endpoint: 'https://mahadbt.maharashtra.gov.in/api',
    apiKey: 'MAHA_KEY_****',
    status: 'Inactive',
    lastSync: '25 Jun 2025, 12:00 PM',
    totalSynced: 0,
    failedCount: 0,
    color: '#dc2626',
  },
];

// ─── DBT Transactions ─────────────────────────────────────────
export const dbtTransactions: DbtTransaction[] = [
  {
    id: 'txn-01',
    appNo: 'DAVV/SCH/2025/004',
    studentName: 'Suresh Kumar',
    bankAccount: '2345678901',
    ifsc: 'BKID0002345',
    amount: 25000,
    txnId: 'DBT2025091512345',
    utrNo: 'UTR987654321098',
    date: '25 Sep 2025',
    mode: 'APBS',
    status: 'Success',
  },
  {
    id: 'txn-02',
    appNo: 'DAVV/SCH/2025/007',
    studentName: 'Pooja Yadav',
    bankAccount: '5678901235',
    ifsc: 'CNRB0005678',
    amount: 28000,
    txnId: 'DBT2025092267890',
    utrNo: 'UTR876543210987',
    date: '27 Sep 2025',
    mode: 'APBS',
    status: 'Pending',
  },
  {
    id: 'txn-03',
    appNo: 'DAVV/SCH/2025/009',
    studentName: 'Amit Tiwari',
    bankAccount: '7890123457',
    ifsc: 'SBIN0007890',
    amount: 48000,
    txnId: 'DBT2025092344556',
    utrNo: '',
    date: '28 Sep 2025',
    mode: 'APBS',
    status: 'Failed',
    remarks: 'Invalid IFSC code',
  },
  {
    id: 'txn-04',
    appNo: 'DAVV/SCH/2025/010',
    studentName: 'Sunita Devi',
    bankAccount: '8901234568',
    ifsc: 'HDFC0008901',
    amount: 75000,
    txnId: 'DBT2025092556789',
    utrNo: 'UTR765432109876',
    date: '25 Sep 2025',
    mode: 'APBS',
    status: 'Success',
  },
  {
    id: 'txn-05',
    appNo: 'DAVV/SCH/2025/011',
    studentName: 'Krishna Pillai',
    bankAccount: '9012345679',
    ifsc: 'ICIC0009012',
    amount: 35000,
    txnId: 'DBT2025092669900',
    utrNo: '',
    date: '29 Sep 2025',
    mode: 'APBS',
    status: 'Bounced',
    remarks: 'Account closed / inactive',
  },
];

// ─── Sync Logs ─────────────────────────────────────────────────
export const syncLogs: SyncLog[] = [
  {
    id: 'sl-01',
    portal: 'NSP',
    action: 'Push Applications',
    status: 'Success',
    records: 145,
    timestamp: '29 Jun 2025, 08:00 AM',
    initiatedBy: 'System Auto',
  },
  {
    id: 'sl-02',
    portal: 'PFMS',
    action: 'Pull DBT Status',
    status: 'Success',
    records: 234,
    timestamp: '29 Jun 2025, 06:00 AM',
    initiatedBy: 'Finance Cell',
  },
  {
    id: 'sl-03',
    portal: 'NPCI',
    action: 'Aadhaar Mapper Validate',
    status: 'Partial',
    records: 88,
    timestamp: '28 Jun 2025, 11:30 PM',
    initiatedBy: 'System Auto',
    errorMsg: '12 records failed NPCI validation',
  },
  {
    id: 'sl-04',
    portal: 'State',
    action: 'Push Sanctioned',
    status: 'Success',
    records: 67,
    timestamp: '28 Jun 2025, 07:00 PM',
    initiatedBy: 'Admin User',
  },
  {
    id: 'sl-05',
    portal: 'UIDAI',
    action: 'Aadhaar OTP Verification',
    status: 'Failed',
    records: 0,
    timestamp: '28 Jun 2025, 03:00 PM',
    initiatedBy: 'System Auto',
    errorMsg: 'UIDAI API timeout after 30s',
  },
  {
    id: 'sl-06',
    portal: 'DigiLocker',
    action: 'Pull Documents',
    status: 'Success',
    records: 312,
    timestamp: '28 Jun 2025, 10:00 AM',
    initiatedBy: 'Scholarship Cell',
  },
];

// ─── Audit Logs ────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  {
    id: 'al-01',
    action: 'Application Approved',
    module: 'Final Approval',
    performedBy: 'Dr. Sharma',
    role: 'Scholarship Cell',
    ipAddress: '192.168.1.12',
    timestamp: '29 Jun 2025, 10:15 AM',
    details: 'Application DAVV/SCH/2025/001 approved and forwarded to Finance.',
  },
  {
    id: 'al-02',
    action: 'DBT Processed',
    module: 'DBT Monitoring',
    performedBy: 'System',
    role: 'System',
    ipAddress: '10.0.0.1',
    timestamp: '29 Jun 2025, 09:00 AM',
    details:
      'Batch DBT transfer of ₹2,45,000 to 12 students initiated via APBS.',
  },
  {
    id: 'al-03',
    action: 'Document Rejected',
    module: 'Document Verify',
    performedBy: 'Clerk Rajesh',
    role: 'Scholarship Cell',
    ipAddress: '192.168.1.14',
    timestamp: '28 Jun 2025, 04:30 PM',
    details:
      'Income certificate for app-008 marked as forged. Application put on hold.',
  },
  {
    id: 'al-04',
    action: 'Scheme Master Created',
    module: 'Scheme Master',
    performedBy: 'Admin Kumar',
    role: 'Admin',
    ipAddress: '192.168.1.5',
    timestamp: '28 Jun 2025, 11:00 AM',
    details: 'New scheme "DAVV Sports Excellence 2025-26" created.',
  },
  {
    id: 'al-05',
    action: 'Portal Sync Initiated',
    module: 'Portal Sync',
    performedBy: 'Admin Kumar',
    role: 'Admin',
    ipAddress: '192.168.1.5',
    timestamp: '28 Jun 2025, 08:00 AM',
    details: 'Full sync with NSP portal initiated for AY 2025-26.',
  },
  {
    id: 'al-06',
    action: 'Application Rejected',
    module: 'Final Approval',
    performedBy: 'Dr. Meena',
    role: 'Scholarship Cell',
    ipAddress: '192.168.1.13',
    timestamp: '27 Jun 2025, 02:15 PM',
    details: 'Application DAVV/SCH/2025/006 rejected: Attendance below 75%.',
  },
];

// ─── Grievances ────────────────────────────────────────────────
export const grievances: Grievance[] = [
  {
    id: 'grv-01',
    ticketNo: 'GRV/2025/0045',
    studentName: 'Priya Sharma',
    subject: 'Application status not updated after 30 days',
    priority: 'High',
    status: 'In Progress',
    raisedOn: '20 Sep 2025',
    remarks: 'Under review by scholarship cell.',
  },
  {
    id: 'grv-02',
    ticketNo: 'GRV/2025/0046',
    studentName: 'Ravi Mishra',
    subject: 'NPCI seeding error — bank account rejected',
    priority: 'High',
    status: 'Open',
    raisedOn: '22 Sep 2025',
    remarks: 'Pending bank verification.',
  },
  {
    id: 'grv-03',
    ticketNo: 'GRV/2025/0047',
    studentName: 'Meena Rajput',
    subject: 'Document upload failure — income certificate',
    priority: 'Medium',
    status: 'Resolved',
    raisedOn: '18 Sep 2025',
    resolvedOn: '21 Sep 2025',
    remarks: 'File format issue resolved. Student re-uploaded successfully.',
  },
  {
    id: 'grv-04',
    ticketNo: 'GRV/2025/0048',
    studentName: 'Vikram Singh',
    subject: 'Scholarship amount not credited after sanctioning',
    priority: 'High',
    status: 'Open',
    raisedOn: '25 Sep 2025',
    remarks: 'DBT processing in queue.',
  },
];

// ─── Monthly stats ────────────────────────────────────────────
export const monthlyApplicationTrend = [
  { month: 'Apr', applied: 120, sanctioned: 98, credited: 88 },
  { month: 'May', applied: 145, sanctioned: 112, credited: 102 },
  { month: 'Jun', applied: 180, sanctioned: 148, credited: 135 },
  { month: 'Jul', applied: 210, sanctioned: 175, credited: 158 },
  { month: 'Aug', applied: 195, sanctioned: 162, credited: 148 },
  { month: 'Sep', applied: 235, sanctioned: 190, credited: 172 },
];

export const categoryDistribution = [
  { cat: 'SC', count: 312, pct: 28, color: '#2563eb' },
  { cat: 'ST', count: 178, pct: 16, color: '#7c3aed' },
  { cat: 'OBC', count: 445, pct: 40, color: '#059669' },
  { cat: 'EWS', count: 98, pct: 9, color: '#d97706' },
  { cat: 'General', count: 78, pct: 7, color: '#6b7280' },
];

export const dbtAmountByScheme = [
  { scheme: 'Post Matric SC', amount: 2800000, color: '#2563eb' },
  { scheme: 'PM-Yasasvi', amount: 4800000, color: '#059669' },
  { scheme: 'MMVY', amount: 7500000, color: '#d97706' },
  { scheme: 'Minority', amount: 1800000, color: '#0891b2' },
  { scheme: 'DAVV Merit', amount: 1200000, color: '#be185d' },
];
