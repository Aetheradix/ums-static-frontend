export interface RTI {
  id: string;
  rtiNumber: string;
  applicantName: string;
  applicantAddress: string;
  applicantMobile: string;
  applicantEmail: string;
  citizenType: 'General' | 'BPL' | 'Senior Citizen' | 'Disabled';
  identityType: 'Aadhaar' | 'Voter ID' | 'Passport' | 'Other';
  identityNumber: string;
  dateReceived: string;
  mode: 'Offline' | 'Online' | 'Email' | 'Speed Post' | 'Portal';
  subject: string;
  keywords: string[];
  category: string;
  informationRequested: string;
  deadlineType:
    | 'Standard'
    | 'Life & Liberty'
    | 'Transfer Case'
    | 'Disabled Person';
  dueDate: string;
  remainingDays: number;
  status:
    | 'New'
    | 'Forwarded'
    | 'In Progress'
    | 'Responded'
    | 'Closed'
    | 'Appealed'
    | 'Overdue';
  priority: 'Normal' | 'High' | 'Urgent';
  assignedDepartments: string[];
  finalReply: string;
  closedOn: string;
  isAppealed: boolean;
  appealLevel: 'None' | 'FAA' | 'SAA';
  createdBy: string;
  createdAt: string;
}

export interface RTIAssignment {
  id: string;
  rtiId: string;
  department: string;
  officer: string;
  assignedOn: string;
  priority: 'Normal' | 'High' | 'Urgent';
  instructions: string;
  requiredBy: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Replied' | 'Overdue';
  reply: string;
  replyAttachments: string[];
  repliedOn: string;
}

export interface RTIAppeal {
  id: string;
  rtiId: string;
  rtiNumber: string;
  level: 'FAA' | 'SAA';
  filedOn: string;
  filedBy: string;
  applicantName: string;
  grounds: string;
  order: string;
  orderDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  returnedTo: string;
}

export interface RTIActivity {
  id: string;
  rtiId: string;
  action: string;
  performedBy: string;
  role: string;
  timestamp: string;
  details: string;
}

export interface RTIDocument {
  id: string;
  rtiId: string;
  type:
    | 'RTI Application'
    | 'Supporting Document'
    | 'Department Reply'
    | 'FAA Order'
    | 'SAA Order'
    | 'Final Reply'
    | 'Other';
  fileName: string;
  uploadedOn: string;
  uploadedBy: string;
}

export interface RTISettings {
  autoDeadlineCalculation: boolean;
  defaultPriority: 'Normal' | 'High' | 'Urgent';
  autoReminderEnabled: boolean;
  reminderDays: number[];
  digitalSignatureRequired: boolean;
  standardDays: number;
  lifeLibertyHours: number;
  transferDays: number;
  disabledDays: number;
  maxAppeals: number;
}

export const rtis: RTI[] = [
  {
    id: 'R1',
    rtiNumber: 'RTI/2025/001',
    applicantName: 'Amit Sharma',
    applicantAddress: '123, Sector 15, Noida, UP',
    applicantMobile: '9876543210',
    applicantEmail: 'amit.sharma@email.com',
    citizenType: 'General',
    identityType: 'Aadhaar',
    identityNumber: '1234-5678-9012',
    dateReceived: '2025-06-01',
    mode: 'Online',
    subject: 'Details of examination fee structure for B.Tech program',
    keywords: ['examination', 'fee', 'B.Tech'],
    category: 'Examination',
    informationRequested:
      'I request the complete fee structure for B.Tech program including examination fees, lab fees, and other charges for the academic year 2024-25.',
    deadlineType: 'Standard',
    dueDate: '2025-07-01',
    remainingDays: -2,
    status: 'Closed',
    priority: 'Normal',
    assignedDepartments: ['Examination', 'Finance'],
    finalReply:
      'Please find attached the detailed fee structure for B.Tech program 2024-25.',
    closedOn: '2025-06-25',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-01',
  },
  {
    id: 'R2',
    rtiNumber: 'RTI/2025/002',
    applicantName: 'Priya Patel',
    applicantAddress: '456, MG Road, Pune, MH',
    applicantMobile: '9876543211',
    applicantEmail: 'priya.patel@email.com',
    citizenType: 'BPL',
    identityType: 'Aadhaar',
    identityNumber: '2345-6789-0123',
    dateReceived: '2025-06-05',
    mode: 'Offline',
    subject: 'Information about admission criteria for reserved category',
    keywords: ['admission', 'reserved category', 'criteria'],
    category: 'Admission',
    informationRequested:
      'Kindly provide the admission criteria and cutoff marks for reserved category students in the current academic year.',
    deadlineType: 'Standard',
    dueDate: '2025-07-05',
    remainingDays: 5,
    status: 'In Progress',
    priority: 'High',
    assignedDepartments: ['Admission'],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-05',
  },
  {
    id: 'R3',
    rtiNumber: 'RTI/2025/003',
    applicantName: 'Vikram Singh',
    applicantAddress: '789, Civil Lines, Jaipur, RJ',
    applicantMobile: '9876543212',
    applicantEmail: 'vikram.singh@email.com',
    citizenType: 'General',
    identityType: 'Voter ID',
    identityNumber: 'VOT1234567',
    dateReceived: '2025-06-10',
    mode: 'Email',
    subject: 'Details of library facilities and digital resources',
    keywords: ['library', 'digital resources', 'facilities'],
    category: 'Library',
    informationRequested:
      'Please provide details of library facilities, digital resources available, and the process for remote access to e-journals.',
    deadlineType: 'Standard',
    dueDate: '2025-07-10',
    remainingDays: 10,
    status: 'Forwarded',
    priority: 'Normal',
    assignedDepartments: ['Library'],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-10',
  },
  {
    id: 'R4',
    rtiNumber: 'RTI/2025/004',
    applicantName: 'Neha Gupta',
    applicantAddress: '321, Model Town, Delhi',
    applicantMobile: '9876543213',
    applicantEmail: 'neha.gupta@email.com',
    citizenType: 'Disabled',
    identityType: 'Aadhaar',
    identityNumber: '3456-7890-1234',
    dateReceived: '2025-06-12',
    mode: 'Speed Post',
    subject: 'Information on hostel facilities for disabled students',
    keywords: ['hostel', 'disabled', 'facilities'],
    category: 'Hostel',
    informationRequested:
      'I request complete information about hostel facilities available for disabled students, including ramp access, special rooms, and support services.',
    deadlineType: 'Disabled Person',
    dueDate: '2025-06-27',
    remainingDays: 0,
    status: 'In Progress',
    priority: 'High',
    assignedDepartments: ['Hostel', 'Admission'],
    finalReply:
      'The university provides wheelchair-accessible rooms in Hostel Block C, with ramps and support staff available 24/7.',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-12',
  },
  {
    id: 'R5',
    rtiNumber: 'RTI/2025/005',
    applicantName: 'Rahul Verma',
    applicantAddress: '654, Gandhi Nagar, Lucknow, UP',
    applicantMobile: '9876543214',
    applicantEmail: 'rahul.verma@email.com',
    citizenType: 'General',
    identityType: 'Passport',
    identityNumber: 'P1234567',
    dateReceived: '2025-06-15',
    mode: 'Online',
    subject: 'Details of faculty recruitment process and vacancies',
    keywords: ['recruitment', 'faculty', 'vacancies'],
    category: 'HR',
    informationRequested:
      'Please provide the complete details of faculty recruitment process, current vacancies, and the selection criteria for the current academic year.',
    deadlineType: 'Standard',
    dueDate: '2025-07-15',
    remainingDays: 15,
    status: 'New',
    priority: 'Normal',
    assignedDepartments: [],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-15',
  },
  {
    id: 'R6',
    rtiNumber: 'RTI/2025/006',
    applicantName: 'Sneha Reddy',
    applicantAddress: '987, Banjara Hills, Hyderabad, TS',
    applicantMobile: '9876543215',
    applicantEmail: 'sneha.reddy@email.com',
    citizenType: 'General',
    identityType: 'Aadhaar',
    identityNumber: '4567-8901-2345',
    dateReceived: '2025-06-18',
    mode: 'Portal',
    subject: 'Exam results and re-evaluation process for B.Sc semester 4',
    keywords: ['exam results', 're-evaluation', 'B.Sc'],
    category: 'Examination',
    informationRequested:
      'I request the details of semester 4 examination results for B.Sc program and the complete re-evaluation process including fees and timeline.',
    deadlineType: 'Life & Liberty',
    dueDate: '2025-06-20',
    remainingDays: -10,
    status: 'Overdue',
    priority: 'Urgent',
    assignedDepartments: ['Examination'],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-18',
  },
  {
    id: 'R7',
    rtiNumber: 'RTI/2025/007',
    applicantName: 'Arun Kumar',
    applicantAddress: '147, Lake Road, Kolkata, WB',
    applicantMobile: '9876543216',
    applicantEmail: 'arun.kumar@email.com',
    citizenType: 'Senior Citizen',
    identityType: 'Voter ID',
    identityNumber: 'VOT2345678',
    dateReceived: '2025-06-20',
    mode: 'Offline',
    subject: 'Information about pension scheme for retired faculty',
    keywords: ['pension', 'retired faculty', 'benefits'],
    category: 'Finance',
    informationRequested:
      'Please provide complete information about the pension scheme applicable to retired faculty members and the current beneficiaries list.',
    deadlineType: 'Standard',
    dueDate: '2025-07-20',
    remainingDays: 20,
    status: 'New',
    priority: 'Normal',
    assignedDepartments: [],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-20',
  },
  {
    id: 'R8',
    rtiNumber: 'RTI/2025/008',
    applicantName: 'Meera Joshi',
    applicantAddress: '258, Shaniwar Peth, Pune, MH',
    applicantMobile: '9876543217',
    applicantEmail: 'meera.joshi@email.com',
    citizenType: 'BPL',
    identityType: 'Aadhaar',
    identityNumber: '5678-9012-3456',
    dateReceived: '2025-06-22',
    mode: 'Email',
    subject: 'Hostel fee structure and scholarship details',
    keywords: ['hostel fee', 'scholarship', 'concession'],
    category: 'Hostel',
    informationRequested:
      'Kindly provide the hostel fee structure for all room types and the scholarship/concession available for BPL category students.',
    deadlineType: 'Standard',
    dueDate: '2025-07-22',
    remainingDays: 22,
    status: 'Forwarded',
    priority: 'High',
    assignedDepartments: ['Hostel', 'Finance'],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-22',
  },
  {
    id: 'R9',
    rtiNumber: 'RTI/2025/009',
    applicantName: 'Deepak Malhotra',
    applicantAddress: '369, Sector 62, Noida, UP',
    applicantMobile: '9876543218',
    applicantEmail: 'deepak.m@email.com',
    citizenType: 'General',
    identityType: 'Passport',
    identityNumber: 'P2345678',
    dateReceived: '2025-06-25',
    mode: 'Online',
    subject: 'Details of university land holdings and infrastructure projects',
    keywords: ['land', 'infrastructure', 'projects'],
    category: 'General Administration',
    informationRequested:
      'I request complete details of university land holdings across all campuses and details of ongoing infrastructure projects with budget allocations.',
    deadlineType: 'Standard',
    dueDate: '2025-07-25',
    remainingDays: 25,
    status: 'Closed',
    priority: 'Normal',
    assignedDepartments: ['Registrar', 'Finance'],
    finalReply:
      'The university holds 250 acres across 3 campuses. Details of infrastructure projects are enclosed.',
    closedOn: '2025-07-20',
    isAppealed: true,
    appealLevel: 'FAA',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-25',
  },
  {
    id: 'R10',
    rtiNumber: 'RTI/2025/010',
    applicantName: 'Kavita Tiwari',
    applicantAddress: '741, South Extension, Delhi',
    applicantMobile: '9876543219',
    applicantEmail: 'kavita.t@email.com',
    citizenType: 'General',
    identityType: 'Aadhaar',
    identityNumber: '6789-0123-4567',
    dateReceived: '2025-06-28',
    mode: 'Speed Post',
    subject: 'Information about course curriculum changes in M.Tech',
    keywords: ['curriculum', 'M.Tech', 'course changes'],
    category: 'Academic',
    informationRequested:
      'Please provide details of the curriculum changes made to M.Tech programs in the last two years and the approval process followed.',
    deadlineType: 'Standard',
    dueDate: '2025-07-28',
    remainingDays: 28,
    status: 'New',
    priority: 'Normal',
    assignedDepartments: [],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-28',
  },
  {
    id: 'R11',
    rtiNumber: 'RTI/2025/011',
    applicantName: 'Suresh Nair',
    applicantAddress: '852, Marine Drive, Mumbai, MH',
    applicantMobile: '9876543220',
    applicantEmail: 'suresh.nair@email.com',
    citizenType: 'General',
    identityType: 'Voter ID',
    identityNumber: 'VOT3456789',
    dateReceived: '2025-06-30',
    mode: 'Portal',
    subject: 'Audit reports of university finances for last 3 years',
    keywords: ['audit', 'finance', 'reports'],
    category: 'Finance',
    informationRequested:
      'I request copies of the annual audit reports of the university for the financial years 2022-23, 2023-24, and 2024-25.',
    deadlineType: 'Standard',
    dueDate: '2025-07-30',
    remainingDays: 30,
    status: 'Forwarded',
    priority: 'Normal',
    assignedDepartments: ['Finance', 'Registrar'],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-06-30',
  },
  {
    id: 'R12',
    rtiNumber: 'RTI/2025/012',
    applicantName: 'Ravi Deshmukh',
    applicantAddress: '963, Sadar Bazaar, Nagpur, MH',
    applicantMobile: '9876543221',
    applicantEmail: 'ravi.d@email.com',
    citizenType: 'BPL',
    identityType: 'Aadhaar',
    identityNumber: '7890-1234-5678',
    dateReceived: '2025-07-02',
    mode: 'Offline',
    subject: 'Details of student scholarship disbursement delays',
    keywords: ['scholarship', 'disbursement', 'delay'],
    category: 'Finance',
    informationRequested:
      'I request information about the delay in scholarship disbursement for BPL students for the current semester and the expected date of release.',
    deadlineType: 'Standard',
    dueDate: '2025-08-01',
    remainingDays: 32,
    status: 'New',
    priority: 'High',
    assignedDepartments: [],
    finalReply: '',
    closedOn: '',
    isAppealed: false,
    appealLevel: 'None',
    createdBy: 'CPIO Office',
    createdAt: '2025-07-02',
  },
];

export const rtiAssignments: RTIAssignment[] = [
  {
    id: 'A1',
    rtiId: 'R1',
    department: 'Examination',
    officer: 'Dr. Rajesh Kumar',
    assignedOn: '2025-06-02',
    priority: 'Normal',
    instructions:
      'Please provide the complete fee structure for B.Tech program.',
    requiredBy: '2025-06-15',
    status: 'Replied',
    reply: 'Attached is the fee structure for B.Tech program 2024-25.',
    replyAttachments: ['fee_structure_2024_25.pdf'],
    repliedOn: '2025-06-12',
  },
  {
    id: 'A2',
    rtiId: 'R1',
    department: 'Finance',
    officer: 'Mr. Sanjay Gupta',
    assignedOn: '2025-06-02',
    priority: 'Normal',
    instructions: 'Verify and confirm the fee structure details.',
    requiredBy: '2025-06-18',
    status: 'Replied',
    reply: 'Fee structure verified and confirmed.',
    replyAttachments: [],
    repliedOn: '2025-06-14',
  },
  {
    id: 'A3',
    rtiId: 'R2',
    department: 'Admission',
    officer: 'Dr. Sunita Sharma',
    assignedOn: '2025-06-06',
    priority: 'High',
    instructions:
      'Please provide the admission criteria and cutoff marks for reserved category.',
    requiredBy: '2025-06-20',
    status: 'In Progress',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A4',
    rtiId: 'R3',
    department: 'Library',
    officer: 'Mrs. Anita Desai',
    assignedOn: '2025-06-11',
    priority: 'Normal',
    instructions:
      'Provide details of library facilities and digital resources.',
    requiredBy: '2025-06-25',
    status: 'Replied',
    reply:
      'Library has 50,000+ books, 200+ journals, and remote access to 10 e-journal databases.',
    replyAttachments: ['library_resources.pdf'],
    repliedOn: '2025-06-20',
  },
  {
    id: 'A14',
    rtiId: 'R3',
    department: 'Registrar',
    officer: 'Dr. Amit Verma',
    assignedOn: '2025-06-21',
    priority: 'Normal',
    instructions:
      'Verify library resource details and provide official approval.',
    requiredBy: '2025-07-05',
    status: 'Pending',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A5',
    rtiId: 'R4',
    department: 'Hostel',
    officer: 'Mr. Prakash Joshi',
    assignedOn: '2025-06-13',
    priority: 'High',
    instructions:
      'Provide hostel facilities information for disabled students.',
    requiredBy: '2025-06-20',
    status: 'Replied',
    reply:
      'Hostel Block C has wheelchair-accessible rooms. Ramps and support staff available.',
    replyAttachments: ['hostel_disabled_facilities.pdf'],
    repliedOn: '2025-06-18',
  },
  {
    id: 'A6',
    rtiId: 'R4',
    department: 'Admission',
    officer: 'Dr. Sunita Sharma',
    assignedOn: '2025-06-13',
    priority: 'High',
    instructions:
      'Confirm the admission status and support services for disabled students.',
    requiredBy: '2025-06-20',
    status: 'Replied',
    reply:
      'Disabled students admitted under reserved quota with full support services.',
    replyAttachments: [],
    repliedOn: '2025-06-17',
  },
  {
    id: 'A7',
    rtiId: 'R6',
    department: 'Examination',
    officer: 'Dr. Rajesh Kumar',
    assignedOn: '2025-06-19',
    priority: 'Urgent',
    instructions:
      'URGENT: Provide exam results and re-evaluation process immediately.',
    requiredBy: '2025-06-20',
    status: 'Overdue',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A8',
    rtiId: 'R8',
    department: 'Hostel',
    officer: 'Mr. Prakash Joshi',
    assignedOn: '2025-06-23',
    priority: 'High',
    instructions: 'Provide hostel fee structure for all room types.',
    requiredBy: '2025-07-05',
    status: 'Pending',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A9',
    rtiId: 'R8',
    department: 'Finance',
    officer: 'Mr. Sanjay Gupta',
    assignedOn: '2025-06-23',
    priority: 'High',
    instructions: 'Provide scholarship details for BPL category students.',
    requiredBy: '2025-07-05',
    status: 'Pending',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A10',
    rtiId: 'R9',
    department: 'Registrar',
    officer: 'Dr. Amit Verma',
    assignedOn: '2025-06-26',
    priority: 'Normal',
    instructions:
      'Provide details of university land holdings and infrastructure projects.',
    requiredBy: '2025-07-10',
    status: 'Replied',
    reply:
      'University holds 250 acres across 3 campuses. Infrastructure project details enclosed.',
    replyAttachments: ['land_holdings.pdf', 'infrastructure_projects.pdf'],
    repliedOn: '2025-07-05',
  },
  {
    id: 'A11',
    rtiId: 'R9',
    department: 'Finance',
    officer: 'Mr. Sanjay Gupta',
    assignedOn: '2025-06-26',
    priority: 'Normal',
    instructions:
      'Provide budget allocation details for infrastructure projects.',
    requiredBy: '2025-07-10',
    status: 'Replied',
    reply: 'Budget allocation details enclosed.',
    replyAttachments: ['budget_infrastructure.pdf'],
    repliedOn: '2025-07-08',
  },
  {
    id: 'A12',
    rtiId: 'R11',
    department: 'Finance',
    officer: 'Mr. Sanjay Gupta',
    assignedOn: '2025-07-01',
    priority: 'Normal',
    instructions: 'Provide audit reports for last 3 years.',
    requiredBy: '2025-07-15',
    status: 'Pending',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
  {
    id: 'A13',
    rtiId: 'R11',
    department: 'Registrar',
    officer: 'Dr. Amit Verma',
    assignedOn: '2025-07-01',
    priority: 'Normal',
    instructions: 'Provide approved audit report copies.',
    requiredBy: '2025-07-15',
    status: 'Pending',
    reply: '',
    replyAttachments: [],
    repliedOn: '',
  },
];

export const rtiAppeals: RTIAppeal[] = [
  {
    id: 'AP1',
    rtiId: 'R9',
    rtiNumber: 'RTI/2025/009',
    level: 'FAA',
    filedOn: '2025-07-25',
    filedBy: 'Deepak Malhotra',
    applicantName: 'Deepak Malhotra',
    grounds:
      'The information provided about infrastructure projects is incomplete. The budget details do not include cost overruns and delays. I request a complete and transparent response.',
    order:
      'The appeal is accepted. CPIO is directed to provide complete budget details including cost overruns within 15 days.',
    orderDate: '2025-08-01',
    status: 'Approved',
    returnedTo: 'CPIO',
  },
  {
    id: 'AP2',
    rtiId: 'R1',
    rtiNumber: 'RTI/2025/001',
    level: 'FAA',
    filedOn: '2025-06-30',
    filedBy: 'Amit Sharma',
    applicantName: 'Amit Sharma',
    grounds:
      'The fee structure provided does not include semester-wise breakdown and annual increase percentage.',
    order: '',
    orderDate: '',
    status: 'Pending',
    returnedTo: '',
  },
];

export const rtiActivities: RTIActivity[] = [
  {
    id: 'L1',
    rtiId: 'R1',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-01 09:00',
    details: 'RTI registered with number RTI/2025/001',
  },
  {
    id: 'L2',
    rtiId: 'R1',
    action: 'Forwarded to Department',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-02 10:30',
    details: 'Forwarded to Examination and Finance departments',
  },
  {
    id: 'L3',
    rtiId: 'R1',
    action: 'Department Reply',
    performedBy: 'Dr. Rajesh Kumar',
    role: 'Nodal Officer',
    timestamp: '2025-06-12 14:00',
    details: 'Examination department submitted reply with fee structure',
  },
  {
    id: 'L4',
    rtiId: 'R1',
    action: 'Department Reply',
    performedBy: 'Mr. Sanjay Gupta',
    role: 'Nodal Officer',
    timestamp: '2025-06-14 11:00',
    details: 'Finance department confirmed fee structure',
  },
  {
    id: 'L5',
    rtiId: 'R1',
    action: 'Final Reply Issued',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-25 16:00',
    details: 'Final reply sent to applicant',
  },
  {
    id: 'L6',
    rtiId: 'R1',
    action: 'RTI Closed',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-25 16:01',
    details: 'RTI closed after final reply',
  },
  {
    id: 'L7',
    rtiId: 'R2',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-05 09:30',
    details: 'RTI registered with number RTI/2025/002',
  },
  {
    id: 'L8',
    rtiId: 'R2',
    action: 'Forwarded to Department',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-06 11:00',
    details: 'Forwarded to Admission department',
  },
  {
    id: 'L9',
    rtiId: 'R6',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-18 10:00',
    details: 'RTI registered with number RTI/2025/006 - Life & Liberty case',
  },
  {
    id: 'L10',
    rtiId: 'R6',
    action: 'Forwarded to Department',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-19 09:00',
    details: 'Forwarded to Examination department - Marked Urgent',
  },
  {
    id: 'L11',
    rtiId: 'R9',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-25 11:00',
    details: 'RTI registered with number RTI/2025/009',
  },
  {
    id: 'L12',
    rtiId: 'R9',
    action: 'Final Reply Issued',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-07-20 15:00',
    details: 'Final reply sent to applicant',
  },
  {
    id: 'L13',
    rtiId: 'R9',
    action: 'RTI Closed',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-07-20 15:01',
    details: 'RTI closed',
  },
  {
    id: 'L14',
    rtiId: 'R9',
    action: 'Appeal Filed',
    performedBy: 'Deepak Malhotra',
    role: 'Applicant',
    timestamp: '2025-07-25 10:00',
    details: 'FAA appeal filed - incomplete information',
  },
  {
    id: 'L15',
    rtiId: 'R9',
    action: 'Appeal Order Issued',
    performedBy: 'FAA Office',
    role: 'FAA',
    timestamp: '2025-08-01 14:00',
    details: 'Appeal approved - returned to CPIO for fresh reply',
  },
  {
    id: 'L16',
    rtiId: 'R3',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-10 08:00',
    details: 'RTI registered with number RTI/2025/003',
  },
  {
    id: 'L17',
    rtiId: 'R4',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-12 09:00',
    details: 'RTI registered with number RTI/2025/004 - Disabled person case',
  },
  {
    id: 'L18',
    rtiId: 'R4',
    action: 'Department Reply',
    performedBy: 'Mr. Prakash Joshi',
    role: 'Nodal Officer',
    timestamp: '2025-06-18 13:00',
    details: 'Hostel department submitted reply',
  },
  {
    id: 'L19',
    rtiId: 'R4',
    action: 'Department Reply',
    performedBy: 'Dr. Sunita Sharma',
    role: 'Nodal Officer',
    timestamp: '2025-06-17 15:00',
    details: 'Admission department confirmed support services',
  },
  {
    id: 'L20',
    rtiId: 'R4',
    action: 'Final Reply Issued',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-27 12:00',
    details: 'Final reply sent to applicant within deadline',
  },
  {
    id: 'L21',
    rtiId: 'R8',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-22 10:00',
    details: 'RTI registered with number RTI/2025/008',
  },
  {
    id: 'L22',
    rtiId: 'R8',
    action: 'Forwarded to Department',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-23 09:30',
    details: 'Forwarded to Hostel and Finance departments',
  },
  {
    id: 'L23',
    rtiId: 'R11',
    action: 'RTI Registered',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-06-30 11:00',
    details: 'RTI registered with number RTI/2025/011',
  },
  {
    id: 'L24',
    rtiId: 'R11',
    action: 'Forwarded to Department',
    performedBy: 'CPIO Office',
    role: 'CPIO',
    timestamp: '2025-07-01 10:00',
    details: 'Forwarded to Finance and Registrar departments',
  },
];

export const rtiDocuments: RTIDocument[] = [
  {
    id: 'D1',
    rtiId: 'R1',
    type: 'RTI Application',
    fileName: 'rti_application_001.pdf',
    uploadedOn: '2025-06-01',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D2',
    rtiId: 'R1',
    type: 'Department Reply',
    fileName: 'fee_structure_2024_25.pdf',
    uploadedOn: '2025-06-12',
    uploadedBy: 'Dr. Rajesh Kumar',
  },
  {
    id: 'D3',
    rtiId: 'R1',
    type: 'Final Reply',
    fileName: 'final_reply_001.pdf',
    uploadedOn: '2025-06-25',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D4',
    rtiId: 'R2',
    type: 'RTI Application',
    fileName: 'rti_application_002.pdf',
    uploadedOn: '2025-06-05',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D5',
    rtiId: 'R4',
    type: 'RTI Application',
    fileName: 'rti_application_004.pdf',
    uploadedOn: '2025-06-12',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D6',
    rtiId: 'R4',
    type: 'Supporting Document',
    fileName: 'disability_certificate.pdf',
    uploadedOn: '2025-06-12',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D7',
    rtiId: 'R4',
    type: 'Department Reply',
    fileName: 'hostel_disabled_facilities.pdf',
    uploadedOn: '2025-06-18',
    uploadedBy: 'Mr. Prakash Joshi',
  },
  {
    id: 'D8',
    rtiId: 'R4',
    type: 'Final Reply',
    fileName: 'final_reply_004.pdf',
    uploadedOn: '2025-06-27',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D9',
    rtiId: 'R9',
    type: 'RTI Application',
    fileName: 'rti_application_009.pdf',
    uploadedOn: '2025-06-25',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D10',
    rtiId: 'R9',
    type: 'Department Reply',
    fileName: 'land_holdings.pdf',
    uploadedOn: '2025-07-05',
    uploadedBy: 'Dr. Amit Verma',
  },
  {
    id: 'D11',
    rtiId: 'R9',
    type: 'Department Reply',
    fileName: 'infrastructure_projects.pdf',
    uploadedOn: '2025-07-05',
    uploadedBy: 'Dr. Amit Verma',
  },
  {
    id: 'D12',
    rtiId: 'R9',
    type: 'Department Reply',
    fileName: 'budget_infrastructure.pdf',
    uploadedOn: '2025-07-08',
    uploadedBy: 'Mr. Sanjay Gupta',
  },
  {
    id: 'D13',
    rtiId: 'R9',
    type: 'Final Reply',
    fileName: 'final_reply_009.pdf',
    uploadedOn: '2025-07-20',
    uploadedBy: 'CPIO Office',
  },
  {
    id: 'D14',
    rtiId: 'R9',
    type: 'FAA Order',
    fileName: 'faa_order_009.pdf',
    uploadedOn: '2025-08-01',
    uploadedBy: 'FAA Office',
  },
  {
    id: 'D15',
    rtiId: 'R6',
    type: 'RTI Application',
    fileName: 'rti_application_006.pdf',
    uploadedOn: '2025-06-18',
    uploadedBy: 'CPIO Office',
  },
];

export const rtiSettings: RTISettings = {
  autoDeadlineCalculation: true,
  defaultPriority: 'Normal',
  autoReminderEnabled: true,
  reminderDays: [7, 3, 1],
  digitalSignatureRequired: false,
  standardDays: 30,
  lifeLibertyHours: 48,
  transferDays: 35,
  disabledDays: 15,
  maxAppeals: 2,
};

export const departmentOptions = [
  'Registrar',
  'Finance',
  'Examination',
  'Admission',
  'Library',
  'Hostel',
];

export const officerOptions = [
  'Dr. Rajesh Kumar',
  'Mr. Sanjay Gupta',
  'Dr. Sunita Sharma',
  'Mrs. Anita Desai',
  'Mr. Prakash Joshi',
  'Dr. Amit Verma',
];

export const categoryOptions = [
  'Admission',
  'Examination',
  'Finance',
  'Hostel',
  'Library',
  'Academic',
  'HR',
  'General Administration',
];

export const modeOptions = [
  'Offline',
  'Online',
  'Email',
  'Speed Post',
  'Portal',
];

export const citizenTypeOptions = [
  'General',
  'BPL',
  'Senior Citizen',
  'Disabled',
];

export const identityTypeOptions = ['Aadhaar', 'Voter ID', 'Passport', 'Other'];

export const deadlineTypeOptions = [
  'Standard',
  'Life & Liberty',
  'Transfer Case',
  'Disabled Person',
];

export const priorityOptions = ['Normal', 'High', 'Urgent'];

export const rtiStatusOptions = [
  'New',
  'Forwarded',
  'In Progress',
  'Responded',
  'Closed',
  'Appealed',
  'Overdue',
];
