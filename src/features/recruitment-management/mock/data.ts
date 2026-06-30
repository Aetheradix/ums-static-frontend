// ─── Shared Types ─────────────────────────────────────────────────────────────

export type CandidateStatus =
  | 'PENDING_UPLOAD'
  | 'UPLOADED'
  | 'LOCKED'
  | 'TIER1_VERIFIED'
  | 'TIER1_REJECTED'
  | 'APPROVED'
  | 'REJECTED';

export interface Candidate {
  id: string;
  applicationNo: string;
  name: string;
  fatherName: string;
  dob: string;
  category: string;
  post: string;
  merit: number;
  mobile: string;
  verificationCenter: string;
  verificationCenterCode: string;
  reportingDate: string;
  status: CandidateStatus;
  tier1Remarks?: string;
  tier2Remarks?: string;
  documents: Document[];
}

export interface Document {
  type: string;
  fileName: string;
  fileSize: string;
  uploaded: boolean;
  required: boolean;
}

export interface Vacancy {
  id: string;
  post: string;
  department: string;
  totalPosts: number;
  filled: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  advertisementNo: string;
}

export interface Timeline {
  id: string;
  type:
    | 'Document Upload'
    | 'Document Verification'
    | 'Choice Filling'
    | 'Joining Order';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  vacancy: string;
}

// ─── Mock Vacancies ───────────────────────────────────────────────────────────

export const VACANCIES: Vacancy[] = [
  {
    id: 'V001',
    post: 'Assistant Professor',
    department: 'Computer Science',
    totalPosts: 8,
    filled: 3,
    category: 'General',
    advertisementNo: 'ADV/2025/001',
  },
  {
    id: 'V002',
    post: 'Assistant Professor',
    department: 'Physics',
    totalPosts: 5,
    filled: 2,
    category: 'OBC',
    advertisementNo: 'ADV/2025/001',
  },
  {
    id: 'V003',
    post: 'Associate Professor',
    department: 'Mathematics',
    totalPosts: 3,
    filled: 1,
    category: 'General',
    advertisementNo: 'ADV/2025/002',
  },
  {
    id: 'V004',
    post: 'Lecturer',
    department: 'Chemistry',
    totalPosts: 6,
    filled: 0,
    category: 'SC',
    advertisementNo: 'ADV/2025/002',
  },
  {
    id: 'V005',
    post: 'Lab Assistant',
    department: 'Biology',
    totalPosts: 4,
    filled: 2,
    category: 'ST',
    advertisementNo: 'ADV/2025/003',
  },
];

// ─── Mock Timelines ───────────────────────────────────────────────────────────

export const TIMELINES: Timeline[] = [
  {
    id: 'TL001',
    type: 'Document Upload',
    startDate: '2025-07-01',
    endDate: '2025-07-20',
    status: 'Active',
    vacancy: 'ADV/2025/001',
  },
  {
    id: 'TL002',
    type: 'Document Verification',
    startDate: '2025-07-21',
    endDate: '2025-08-05',
    status: 'Upcoming',
    vacancy: 'ADV/2025/001',
  },
  {
    id: 'TL003',
    type: 'Choice Filling',
    startDate: '2025-08-10',
    endDate: '2025-08-20',
    status: 'Upcoming',
    vacancy: 'ADV/2025/001',
  },
  {
    id: 'TL004',
    type: 'Joining Order',
    startDate: '2025-09-01',
    endDate: '2025-09-15',
    status: 'Upcoming',
    vacancy: 'ADV/2025/001',
  },
];

// ─── Mock Candidates ──────────────────────────────────────────────────────────

const docSet = (uploaded: boolean): Document[] => [
  {
    type: 'Photograph',
    fileName: uploaded ? 'photo.jpg' : '',
    fileSize: uploaded ? '185 KB' : '',
    uploaded,
    required: true,
  },
  {
    type: 'Signature',
    fileName: uploaded ? 'signature.jpg' : '',
    fileSize: uploaded ? '92 KB' : '',
    uploaded,
    required: true,
  },
  {
    type: 'Identity Proof',
    fileName: uploaded ? 'aadhaar.pdf' : '',
    fileSize: uploaded ? '1.2 MB' : '',
    uploaded,
    required: true,
  },
  {
    type: 'Date of Birth Proof',
    fileName: uploaded ? 'dob.pdf' : '',
    fileSize: uploaded ? '0.9 MB' : '',
    uploaded,
    required: true,
  },
  {
    type: 'Educational Qualification',
    fileName: uploaded ? 'degree.pdf' : '',
    fileSize: uploaded ? '3.4 MB' : '',
    uploaded,
    required: true,
  },
  {
    type: 'Category Certificate',
    fileName: uploaded ? 'category.pdf' : '',
    fileSize: uploaded ? '0.7 MB' : '',
    uploaded,
    required: false,
  },
];

export const CANDIDATES: Candidate[] = [
  {
    id: 'C001',
    applicationNo: 'APP2025001',
    name: 'Priya Sharma',
    fatherName: 'Rajesh Sharma',
    dob: '1994-03-15',
    category: 'General',
    post: 'Assistant Professor',
    merit: 1,
    mobile: '9876543210',
    verificationCenter: 'District Collectorate, Lucknow',
    verificationCenterCode: 'LKO-01',
    reportingDate: '2025-07-25 10:00 AM',
    status: 'LOCKED',
    documents: docSet(true),
  },
  {
    id: 'C002',
    applicationNo: 'APP2025002',
    name: 'Amit Kumar',
    fatherName: 'Suresh Kumar',
    dob: '1992-11-22',
    category: 'OBC',
    post: 'Assistant Professor',
    merit: 2,
    mobile: '9876543211',
    verificationCenter: 'District Collectorate, Lucknow',
    verificationCenterCode: 'LKO-01',
    reportingDate: '2025-07-25 10:30 AM',
    status: 'TIER1_VERIFIED',
    tier1Remarks:
      'All documents verified. Degree certificate matches merit list.',
    documents: docSet(true),
  },
  {
    id: 'C003',
    applicationNo: 'APP2025003',
    name: 'Sunita Yadav',
    fatherName: 'Ram Yadav',
    dob: '1996-07-08',
    category: 'OBC',
    post: 'Assistant Professor',
    merit: 3,
    mobile: '9876543212',
    verificationCenter: 'District Collectorate, Lucknow',
    verificationCenterCode: 'LKO-01',
    reportingDate: '2025-07-25 11:00 AM',
    status: 'TIER1_REJECTED',
    tier1Remarks:
      'Category certificate not matching. OBC certificate appears forged.',
    documents: docSet(true),
  },
  {
    id: 'C004',
    applicationNo: 'APP2025004',
    name: 'Rohit Gupta',
    fatherName: 'Vijay Gupta',
    dob: '1993-05-30',
    category: 'General',
    post: 'Assistant Professor',
    merit: 4,
    mobile: '9876543213',
    verificationCenter: 'District Collectorate, Agra',
    verificationCenterCode: 'AGR-01',
    reportingDate: '2025-07-26 10:00 AM',
    status: 'APPROVED',
    tier1Remarks: 'All documents verified successfully.',
    documents: docSet(true),
  },
  {
    id: 'C005',
    applicationNo: 'APP2025005',
    name: 'Kavita Singh',
    fatherName: 'Mohan Singh',
    dob: '1995-01-14',
    category: 'SC',
    post: 'Lecturer',
    merit: 1,
    mobile: '9876543214',
    verificationCenter: 'District Collectorate, Kanpur',
    verificationCenterCode: 'KNP-01',
    reportingDate: '2025-07-27 09:30 AM',
    status: 'UPLOADED',
    documents: docSet(true),
  },
  {
    id: 'C006',
    applicationNo: 'APP2025006',
    name: 'Deepak Verma',
    fatherName: 'Shyam Verma',
    dob: '1997-09-03',
    category: 'General',
    post: 'Lab Assistant',
    merit: 5,
    mobile: '9876543215',
    verificationCenter: 'District Collectorate, Varanasi',
    verificationCenterCode: 'VNS-01',
    reportingDate: '2025-07-28 11:30 AM',
    status: 'PENDING_UPLOAD',
    documents: docSet(false),
  },
];

// ─── Helper: candidate for the logged-in candidate session (APP2025006) ──────
export const MY_CANDIDATE = CANDIDATES[5];
