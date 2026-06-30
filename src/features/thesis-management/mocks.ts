// ============================================================
//  Thesis Management Module — Mock Data
// ============================================================

export interface Scholar {
  id: string;
  name: string;
  scholarId: string;
  enrollmentNo: string;
  program: string;
  department: string;
  researchArea: string;
  specialization: string;
  supervisor: string;
  coSupervisor: string;
  email: string;
  mobile: string;
  orcidId: string;
  googleScholarUrl: string;
  researchGateUrl: string;
  domain: string;
  status: 'Active' | 'Inactive' | 'Completed' | 'Withdrawn';
  phase: string;
  registrationDate: string;
  expectedCompletion: string;
  similarity: number;
  researchCode: string;
}

export const scholars: Scholar[] = [
  {
    id: 'sch-1',
    name: 'Rajesh Kumar Sahu',
    scholarId: 'DAVV-PHD-25-089',
    enrollmentNo: 'EN-2025-SCSIT-089',
    program: 'Doctor of Philosophy (Ph.D.)',
    department: 'School of Computer Science & IT',
    researchArea: 'Natural Language Processing',
    specialization: 'Low-Resource Machine Translation',
    supervisor: 'Dr. Sanjay Tanwani',
    coSupervisor: 'Dr. Preeti Saxena',
    email: 'rajesh.sahu@dauniv.ac.in',
    mobile: '+91 9876543210',
    orcidId: '0000-0002-1234-5678',
    googleScholarUrl: 'scholar.google.com/citations?user=rksahu',
    researchGateUrl: 'researchgate.net/profile/Rajesh_Sahu',
    domain: 'Artificial Intelligence & NLP',
    status: 'Active',
    phase: 'Proposal Approved',
    registrationDate: '15 Jan 2025',
    expectedCompletion: 'Dec 2028',
    similarity: 8.5,
    researchCode: 'DAVV-SCS-PHD-2025-0891',
  },
  {
    id: 'sch-2',
    name: 'Priya Verma',
    scholarId: 'DAVV-PHD-24-012',
    enrollmentNo: 'EN-2024-SCSIT-012',
    program: 'Doctor of Philosophy (Ph.D.)',
    department: 'School of Computer Science & IT',
    researchArea: 'Cloud Security',
    specialization: 'Homomorphic Encryption',
    supervisor: 'Dr. Sanjay Tanwani',
    coSupervisor: '',
    email: 'priya.verma@dauniv.ac.in',
    mobile: '+91 9765432109',
    orcidId: '0000-0002-8765-4321',
    googleScholarUrl: 'scholar.google.com/citations?user=pverma',
    researchGateUrl: 'researchgate.net/profile/Priya_Verma',
    domain: 'Cyber Security & Cloud',
    status: 'Active',
    phase: 'Writing Thesis',
    registrationDate: '10 Aug 2024',
    expectedCompletion: 'Jun 2027',
    similarity: 6.2,
    researchCode: 'DAVV-SCS-PHD-2024-0120',
  },
  {
    id: 'sch-3',
    name: 'Amit Khandelwal',
    scholarId: 'DAVV-PHD-23-041',
    enrollmentNo: 'EN-2023-SCSIT-041',
    program: 'Doctor of Philosophy (Ph.D.)',
    department: 'School of Computer Science & IT',
    researchArea: 'Computer Vision',
    specialization: 'Medical Image Segmentation',
    supervisor: 'Dr. Preeti Saxena',
    coSupervisor: '',
    email: 'amit.khandelwal@dauniv.ac.in',
    mobile: '+91 9654321098',
    orcidId: '0000-0003-2468-1357',
    googleScholarUrl: 'scholar.google.com/citations?user=akhandelwal',
    researchGateUrl: 'researchgate.net/profile/Amit_Khandelwal',
    domain: 'Deep Learning & Vision',
    status: 'Active',
    phase: 'Synopsis Pending',
    registrationDate: '20 Mar 2023',
    expectedCompletion: 'Mar 2027',
    similarity: 12.1,
    researchCode: 'DAVV-SCS-PHD-2023-0410',
  },
  {
    id: 'sch-4',
    name: 'Sunita Chouhan',
    scholarId: 'DAVV-PHD-22-008',
    enrollmentNo: 'EN-2022-SCSIT-008',
    program: 'Doctor of Philosophy (Ph.D.)',
    department: 'School of Computer Science & IT',
    researchArea: 'IoT & Edge Computing',
    specialization: 'Smart Healthcare Systems',
    supervisor: 'Dr. Sanjay Tanwani',
    coSupervisor: 'Dr. Preeti Saxena',
    email: 'sunita.chouhan@dauniv.ac.in',
    mobile: '+91 9543210987',
    orcidId: '0000-0001-3579-2468',
    googleScholarUrl: 'scholar.google.com/citations?user=schouhan',
    researchGateUrl: 'researchgate.net/profile/Sunita_Chouhan',
    domain: 'IoT & Healthcare Tech',
    status: 'Active',
    phase: 'Viva Scheduled',
    registrationDate: '05 Jan 2022',
    expectedCompletion: 'Sep 2026',
    similarity: 4.8,
    researchCode: 'DAVV-SCS-PHD-2022-0080',
  },
];

export interface Milestone {
  id: string;
  scholarId: string;
  name: string;
  dueDate: string;
  completionDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  remarks?: string;
}

export const milestones: Milestone[] = [
  {
    id: 'ml-1',
    scholarId: 'sch-1',
    name: 'Topic Registration',
    dueDate: '31 Mar 2025',
    completionDate: '28 Mar 2025',
    status: 'Completed',
  },
  {
    id: 'ml-2',
    scholarId: 'sch-1',
    name: 'Proposal Submission',
    dueDate: '30 Jun 2025',
    completionDate: '25 Jun 2025',
    status: 'Completed',
  },
  {
    id: 'ml-3',
    scholarId: 'sch-1',
    name: 'Plagiarism Clearance',
    dueDate: '15 Jul 2025',
    completionDate: '12 Jul 2025',
    status: 'Completed',
  },
  {
    id: 'ml-4',
    scholarId: 'sch-1',
    name: 'Research Cell Registration',
    dueDate: '31 Aug 2025',
    status: 'In Progress',
  },
  {
    id: 'ml-5',
    scholarId: 'sch-1',
    name: 'Progress Report 1',
    dueDate: '30 Sep 2025',
    status: 'Pending',
  },
  {
    id: 'ml-6',
    scholarId: 'sch-1',
    name: 'Progress Report 2',
    dueDate: '31 Mar 2026',
    status: 'Pending',
  },
  {
    id: 'ml-7',
    scholarId: 'sch-1',
    name: 'Synopsis Seminar',
    dueDate: '30 Sep 2026',
    status: 'Pending',
  },
  {
    id: 'ml-8',
    scholarId: 'sch-1',
    name: 'Pre-Submission Seminar',
    dueDate: '31 Mar 2027',
    status: 'Pending',
  },
  {
    id: 'ml-9',
    scholarId: 'sch-1',
    name: 'Final Thesis Submission',
    dueDate: '30 Jun 2027',
    status: 'Pending',
  },
  {
    id: 'ml-10',
    scholarId: 'sch-1',
    name: 'Viva Defense',
    dueDate: '31 Aug 2027',
    status: 'Pending',
  },
  {
    id: 'ml-11',
    scholarId: 'sch-3',
    name: 'Synopsis Seminar',
    dueDate: '30 Apr 2026',
    status: 'Overdue',
    remarks: '14 Days Overdue',
  },
];

export interface MeetingLog {
  id: string;
  scholarId: string;
  date: string;
  time: string;
  agenda: string;
  mode: 'Offline' | 'Online';
  discussion: string;
  supervisorComments: string;
  actionItems: string[];
  nextMeetingDate: string;
}

export const meetingLogs: MeetingLog[] = [
  {
    id: 'mt-1',
    scholarId: 'sch-1',
    date: '25 Jun 2026',
    time: '11:30 AM',
    agenda: 'Tokenizer benchmark analysis and methodology finalization',
    mode: 'Offline',
    discussion:
      'Reviewed SentencePiece vs BPE tokenizer performance on Bundeli dialect corpus.',
    supervisorComments:
      'Excellent path. Continue OOV analysis and submit report by next week.',
    actionItems: [
      'Read 3 papers on Transformer encoders',
      'Generate GPU benchmark log',
      'Prepare bibliography',
    ],
    nextMeetingDate: '07 Jul 2026',
  },
  {
    id: 'mt-2',
    scholarId: 'sch-1',
    date: '10 Jun 2026',
    time: '10:00 AM',
    agenda: 'Literature Review gaps identification',
    mode: 'Online',
    discussion:
      'Identified research gaps in cross-lingual transfer for central Indian dialects.',
    supervisorComments: 'Good progress. Document findings formally.',
    actionItems: [
      'Document 5 identified research gaps',
      'Compare 3 existing models',
    ],
    nextMeetingDate: '25 Jun 2026',
  },
];

export interface ProgressReport {
  id: string;
  scholarId: string;
  type: 'Monthly' | 'Quarterly' | 'Semester';
  period: string;
  workCompleted: string;
  problemsFaced: string;
  futurePlan: string;
  submittedOn: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Returned';
  supervisorRemarks?: string;
}

export const progressReports: ProgressReport[] = [
  {
    id: 'pr-1',
    scholarId: 'sch-1',
    type: 'Semester',
    period: 'Jan–Jun 2026',
    workCompleted:
      'Configured adapter fine-tuning pipeline. Evaluated IndicBART and mBART-50 models on Bundeli test set. Achieved BLEU score of 18.2 on in-domain corpus.',
    problemsFaced:
      'Lack of annotated tribal script corpus for Gondi and Baiga languages.',
    futurePlan:
      'Implement cross-lingual transfer and prepare for Pre-Submission Seminar by Sep 2026.',
    submittedOn: '30 Jun 2026',
    status: 'Submitted',
  },
  {
    id: 'pr-2',
    scholarId: 'sch-1',
    type: 'Semester',
    period: 'Jul–Dec 2025',
    workCompleted:
      'Literature review completed. Baseline experiments with mBART model.',
    problemsFaced:
      'GPU resource constraints. Resolved by using Google Colab Pro+.',
    futurePlan: 'Adapter fine-tuning experiments in Jan 2026.',
    submittedOn: '31 Dec 2025',
    status: 'Approved',
    supervisorRemarks:
      'Well-structured report. Continue with adapter training.',
  },
];

export interface SupervisorRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  specialization: string;
  maxLimit: number;
  currentAllocation: number;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  availability: 'Available' | 'Full';
}

export const supervisors: SupervisorRecord[] = [
  {
    id: 'sv-1',
    name: 'Dr. Sanjay Tanwani',
    designation: 'Professor & HOD',
    department: 'SCSIT',
    specialization: 'AI, NLP, Cloud',
    maxLimit: 8,
    currentAllocation: 6,
    email: 'sanjay.tanwani@dauniv.ac.in',
    phone: '+91 9800001111',
    status: 'Active',
    availability: 'Available',
  },
  {
    id: 'sv-2',
    name: 'Dr. Preeti Saxena',
    designation: 'Associate Professor',
    department: 'SCSIT',
    specialization: 'Computer Vision, IoT',
    maxLimit: 6,
    currentAllocation: 5,
    email: 'preeti.saxena@dauniv.ac.in',
    phone: '+91 9800002222',
    status: 'Active',
    availability: 'Available',
  },
  {
    id: 'sv-3',
    name: 'Dr. Rajesh Sharma',
    designation: 'Assistant Professor',
    department: 'SCSIT',
    specialization: 'Cybersecurity',
    maxLimit: 4,
    currentAllocation: 4,
    email: 'rajesh.sharma@dauniv.ac.in',
    phone: '+91 9800003333',
    status: 'Active',
    availability: 'Full',
  },
  {
    id: 'sv-4',
    name: 'Dr. Anita Gupta',
    designation: 'Assistant Professor',
    department: 'SCSIT',
    specialization: 'Blockchain, Distributed Systems',
    maxLimit: 4,
    currentAllocation: 2,
    email: 'anita.gupta@dauniv.ac.in',
    phone: '+91 9800004444',
    status: 'Active',
    availability: 'Available',
  },
  {
    id: 'sv-5',
    name: 'Dr. Vikas Mishra',
    designation: 'Professor',
    department: 'SCSIT',
    specialization: 'Data Mining, Big Data',
    maxLimit: 6,
    currentAllocation: 0,
    email: 'vikas.mishra@dauniv.ac.in',
    phone: '+91 9800005555',
    status: 'Inactive',
    availability: 'Available',
  },
];

export interface ProgramMaster {
  id: string;
  name: string;
  code: string;
  minMonths: number;
  maxMonths: number;
  status: 'Active' | 'Inactive';
}

export const programs: ProgramMaster[] = [
  {
    id: 'pg-1',
    name: 'Doctor of Philosophy (Ph.D.)',
    code: 'PHD',
    minMonths: 36,
    maxMonths: 72,
    status: 'Active',
  },
  {
    id: 'pg-2',
    name: 'Master of Philosophy (M.Phil.)',
    code: 'MPHIL',
    minMonths: 18,
    maxMonths: 36,
    status: 'Active',
  },
  {
    id: 'pg-3',
    name: 'Doctor of Science (D.Sc.)',
    code: 'DSC',
    minMonths: 60,
    maxMonths: 120,
    status: 'Inactive',
  },
];

export interface AreaMaster {
  id: string;
  name: string;
  parentDomain: string;
  keywords: string;
  status: 'Active' | 'Inactive';
}

export const researchAreas: AreaMaster[] = [
  {
    id: 'ra-1',
    name: 'Natural Language Processing',
    parentDomain: 'Artificial Intelligence',
    keywords: 'NLP, Transformers, BERT, GPT, Language Models',
    status: 'Active',
  },
  {
    id: 'ra-2',
    name: 'Computer Vision',
    parentDomain: 'Deep Learning',
    keywords: 'CNN, Image Segmentation, Object Detection, YOLO',
    status: 'Active',
  },
  {
    id: 'ra-3',
    name: 'Cloud Security',
    parentDomain: 'Cyber Security',
    keywords: 'Encryption, Zero Trust, Cloud Audit, GDPR',
    status: 'Active',
  },
  {
    id: 'ra-4',
    name: 'IoT & Edge Computing',
    parentDomain: 'Embedded Systems',
    keywords: 'MQTT, Edge AI, Smart Sensors, Fog Computing',
    status: 'Active',
  },
  {
    id: 'ra-5',
    name: 'Blockchain',
    parentDomain: 'Distributed Systems',
    keywords: 'Ethereum, Smart Contracts, DApps, Consensus',
    status: 'Active',
  },
];

export interface CommitteeMember {
  name: string;
  role: string;
}

export interface CommitteeMaster {
  id: string;
  name: string;
  chairperson: string;
  members: CommitteeMember[];
  status: 'Active' | 'Inactive';
}

export const committees: CommitteeMaster[] = [
  {
    id: 'cm-1',
    name: 'DAVV Research Advisory Committee (RAC)',
    chairperson: 'Dean of Academic Affairs',
    members: [
      { name: 'Dr. Sanjay Tanwani', role: 'HOD Representative' },
      { name: 'Dr. Preeti Saxena', role: 'Faculty Member' },
      { name: 'Prof. K. K. Verma (IIT Indore)', role: 'External Expert' },
    ],
    status: 'Active',
  },
  {
    id: 'cm-2',
    name: 'Doctoral Committee (DC)',
    chairperson: 'HOD, SCSIT',
    members: [
      { name: 'Dr. Rajesh Sharma', role: 'Member' },
      { name: 'Dr. Anita Gupta', role: 'Member' },
    ],
    status: 'Active',
  },
];

export interface DefenseSchedule {
  id: string;
  scholarId: string;
  scholarName: string;
  date: string;
  time: string;
  venue: string;
  chairperson: string;
  externalExaminer: string;
  internalExaminer: string;
  status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
}

export const defenseSchedules: DefenseSchedule[] = [
  {
    id: 'ds-1',
    scholarId: 'sch-4',
    scholarName: 'Sunita Chouhan',
    date: '18 Aug 2026',
    time: '11:30 AM',
    venue: 'Auditorium Hall #2, SCS Block',
    chairperson: 'Dr. Sanjay Tanwani',
    externalExaminer: 'Prof. K. K. Verma (IIT Indore)',
    internalExaminer: 'Dr. Preeti Saxena',
    status: 'Scheduled',
  },
];

export interface JuryMember {
  id: string;
  name: string;
  institution: string;
  type: 'External' | 'Internal';
  specialization: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export const juryMembers: JuryMember[] = [
  {
    id: 'jm-1',
    name: 'Prof. K. K. Verma',
    institution: 'IIT Indore',
    type: 'External',
    specialization: 'AI & ML',
    email: 'kk.verma@iiti.ac.in',
    status: 'Active',
  },
  {
    id: 'jm-2',
    name: 'Prof. Deepak Gupta',
    institution: 'NIT Bhopal',
    type: 'External',
    specialization: 'Computer Vision',
    email: 'd.gupta@mnit.ac.in',
    status: 'Active',
  },
  {
    id: 'jm-3',
    name: 'Dr. Anita Gupta',
    institution: 'DAVV',
    type: 'Internal',
    specialization: 'Blockchain',
    email: 'anita.gupta@dauniv.ac.in',
    status: 'Active',
  },
];

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
}

export const auditLogs: AuditLog[] = [
  {
    id: 'al-1',
    timestamp: '30 Jun 2026, 11:15 AM',
    action: 'Proposal Approved',
    module: 'Student / Proposal',
    performedBy: 'Dr. Sanjay Tanwani',
    role: 'Supervisor',
    ipAddress: '192.168.1.101',
    status: 'Success',
  },
  {
    id: 'al-2',
    timestamp: '30 Jun 2026, 10:42 AM',
    action: 'Scholar Code Allocated: DAVV-SCS-PHD-2025-0891',
    module: 'Cell / Registration',
    performedBy: 'Cell Officer',
    role: 'Research Cell',
    ipAddress: '192.168.1.102',
    status: 'Success',
  },
  {
    id: 'al-3',
    timestamp: '29 Jun 2026, 04:30 PM',
    action: 'Plagiarism Score Synced: 8.5%',
    module: 'Turnitin API',
    performedBy: 'System',
    role: 'System',
    ipAddress: 'API Gateway',
    status: 'Success',
  },
  {
    id: 'al-4',
    timestamp: '28 Jun 2026, 09:00 AM',
    action: 'Milestone Alert Sent: Overdue — Synopsis',
    module: 'Cell / Monitoring',
    performedBy: 'System',
    role: 'System',
    ipAddress: 'CRON Job',
    status: 'Warning',
  },
  {
    id: 'al-5',
    timestamp: '27 Jun 2026, 03:15 PM',
    action: 'DOI Registration Failed — Crossref Timeout',
    module: 'Cell / Repository',
    performedBy: 'System',
    role: 'System',
    ipAddress: 'API Gateway',
    status: 'Failed',
  },
];

export interface NotificationTemplate {
  id: string;
  event: string;
  channel: 'Email' | 'SMS' | 'Push';
  subject: string;
  body: string;
  status: 'Active' | 'Inactive';
}

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'nt-1',
    event: 'Proposal Submitted',
    channel: 'Email',
    subject: 'Your Research Proposal Has Been Submitted',
    body: 'Dear {name}, your proposal "{title}" has been submitted successfully and is awaiting supervisor review.',
    status: 'Active',
  },
  {
    id: 'nt-2',
    event: 'Milestone Overdue',
    channel: 'SMS',
    subject: 'Milestone Overdue Alert',
    body: 'Alert: Your milestone "{milestone}" was due on {date}. Please submit immediately.',
    status: 'Active',
  },
  {
    id: 'nt-3',
    event: 'Viva Scheduled',
    channel: 'Email',
    subject: 'Your Viva Defense Has Been Scheduled',
    body: 'Dear {name}, your viva defense is scheduled on {date} at {time} in {venue}.',
    status: 'Active',
  },
  {
    id: 'nt-4',
    event: 'DOI Published',
    channel: 'Push',
    subject: 'Thesis Published in Repository',
    body: 'Congratulations! Your thesis has been published with DOI: {doi}',
    status: 'Active',
  },
];
