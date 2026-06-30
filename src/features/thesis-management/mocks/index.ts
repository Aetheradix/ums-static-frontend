export interface ScholarProfile {
  scholarId: string;
  enrollmentNo: string;
  name: string;
  program: string;
  department: string;
  researchArea: string;
  specialization: string;
  domain: string;
  interests: string;
  orcidId: string;
  googleScholarUrl: string;
  researchGateUrl: string;
  email: string;
  mobile: string;
  supervisor: string;
  coSupervisor: string;
}

export interface ProposalDetails {
  title: string;
  category: string;
  researchArea: string;
  keywords: string[];
  abstract: string;
  problemStatement: string;
  objectives: string[];
  scope: string;
  methodology: string;
  expectedOutcomes: string[];
  literatureReview: string;
  references: string[];
}

export interface PlagiarismReport {
  similarity: number;
  acceptedThreshold: number;
  status: 'Passed' | 'Failed' | 'Pending';
  checkedBy: string;
  checkedOn: string;
  remarks: string;
}

export interface MeetingLog {
  id: string;
  date: string;
  time: string;
  agenda: string;
  discussion: string;
  supervisorComments: string;
  actionItems: string[];
  nextMeetingDate: string;
}

export interface ProgressReport {
  id: string;
  type: 'Monthly' | 'Quarterly' | 'Semester';
  period: string;
  workCompleted: string;
  problemsFaced: string;
  futurePlan: string;
  submittedOn: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Returned';
  comments?: string;
}

export interface Milestone {
  id: string;
  name: string;
  weight: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  completionDate?: string;
}

export interface SupervisorRecord {
  id: string;
  name: string;
  department: string;
  designation: string;
  expertise: string[];
  maxLimit: number;
  currentAllocation: number;
  availability: 'Available' | 'Full' | 'On Leave';
  contact: string;
}

export const activeScholar: ScholarProfile = {
  scholarId: 'DAVV-PHD-2025-089',
  enrollmentNo: 'DX2021004523',
  name: 'Rajesh Kumar Sahu',
  program: 'Doctor of Philosophy (Ph.D.)',
  department: 'School of Computer Science & Information Technology',
  researchArea: 'Natural Language Processing (NLP)',
  specialization: 'Large Language Models & Low Resource Indic Languages',
  domain: 'Artificial Intelligence',
  interests: 'Transformer Models, Machine Translation, Hindi Dialect Parsing',
  orcidId: '0000-0002-1823-9312',
  googleScholarUrl: 'https://scholar.google.com/citations?user=DAVV_Rajesh',
  researchGateUrl: 'https://www.researchgate.net/profile/Rajesh_Sahu',
  email: 'rajesh.sahu.research@dauniv.ac.in',
  mobile: '+91 98765 43210',
  supervisor: 'Dr. Sanjay Tanwani (HOD & Professor)',
  coSupervisor: 'Dr. Preeti Saxena (Associate Professor)',
};

export const initialProposal: ProposalDetails = {
  title:
    'Optimizing Low-Resource Translation for Central Indian Dialects using Hybrid Transformer Ensembles',
  category: 'Full-Time Research',
  researchArea: 'Machine Learning & Computational Linguistics',
  keywords: [
    'Low-Resource NLP',
    'Transformers',
    'Indic Languages',
    'Gondi Dialect',
    'Hybrid Ensembles',
  ],
  abstract:
    'Central Indian regional dialects like Gondi and Bhili suffer from severe resource scarcity. This research proposes a hybrid ensemble technique combining pre-trained multilingual representations (like mBART and IndicBART) with custom vocabulary tokenizer structures to optimize translation accuracy into standardized Hindi.',
  problemStatement:
    'Current neural translation systems perform poorly on unstandardized verbal dialects due to low text corpus availability, high out-of-vocabulary rate, and morphological complex variants.',
  objectives: [
    'Compile a parallel Gondi-Hindi corpus of 20,000 sentences.',
    'Develop custom wordpiece tokenizer optimized for tribal grammatical constructs.',
    'Benchmark hybrid mBART embeddings vs fine-tuned IndicBART architectures.',
  ],
  scope:
    'The scope covers grammatical mapping of Gondi-Hindi translations only. Real-time speech synthesis is excluded.',
  methodology:
    'Data acquisition via local field transcriptions, followed by data cleaning, fine-tuning neural transformers with custom adapters, and comparative evaluation using BLEU and COMET scoring models.',
  expectedOutcomes: [
    'A publicly accessible parallel Gondi-Hindi translation corpus.',
    'A lightweight transformer model suitable for edge deployments.',
    'Research publications in high-impact ACL/IEEE venues.',
  ],
  literatureReview:
    'Detailed study of Joshi et al. (2020) on low resource Indian translations, and Vaswani (2017) transformer baselines.',
  references: [
    'Vaswani, A. et al. (2017). Attention is All You Need. NeurIPS.',
    'Joshi, P. et al. (2020). Taxonomy of Low Resource Translations. ACL.',
  ],
};

export const samplePlagiarismReport: PlagiarismReport = {
  similarity: 8.5,
  acceptedThreshold: 10.0,
  status: 'Passed',
  checkedBy: 'Shodhganga Plagiarism Cell',
  checkedOn: '12 Mar 2026',
  remarks:
    'Similarity index satisfies university policy guidelines. Standard references and quotations excluded.',
};

export const initialMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Topic Registration',
    weight: 10,
    status: 'Completed',
    completionDate: '10 Jan 2026',
  },
  {
    id: '2',
    name: 'Proposal Submission & Plagiarism Check',
    weight: 10,
    status: 'Completed',
    completionDate: '12 Mar 2026',
  },
  {
    id: '3',
    name: 'Supervisor Allocation Signoff',
    weight: 10,
    status: 'Completed',
    completionDate: '15 Mar 2026',
  },
  {
    id: '4',
    name: 'Research Cell Registration & Code Issuance',
    weight: 10,
    status: 'In Progress',
  },
  {
    id: '5',
    name: 'Semester Progress Report 1',
    weight: 10,
    status: 'Pending',
  },
  {
    id: '6',
    name: 'Semester Progress Report 2',
    weight: 10,
    status: 'Pending',
  },
  {
    id: '7',
    name: 'Pre-Synopsis Defense Seminar',
    weight: 10,
    status: 'Pending',
  },
  { id: '8', name: 'Final Thesis Submission', weight: 15, status: 'Pending' },
  {
    id: '9',
    name: 'Jury Review & External Approval',
    weight: 10,
    status: 'Pending',
  },
  {
    id: '10',
    name: 'Viva Defense & Repository Publish',
    weight: 5,
    status: 'Pending',
  },
];

export const sampleMeetingLogs: MeetingLog[] = [
  {
    id: 'M-0912',
    date: '18 Jun 2025',
    time: '11:00 AM',
    agenda: 'Literature Review on Multilingual Transformer Architectures',
    discussion:
      'Reviewed recent models (IndicBART vs mT5). Supervisor advised focusing specifically on vocabulary size mismatch in tokenizers.',
    supervisorComments:
      'Keep tracking out-of-vocabulary (OOV) stats during early corpus runs.',
    actionItems: [
      'Test Gondi tokenizer on 500 sample words',
      'Create OOV percentage chart',
    ],
    nextMeetingDate: '25 Jun 2025',
  },
  {
    id: 'M-0925',
    date: '25 Jun 2025',
    time: '11:30 AM',
    agenda: 'Tokenizer benchmarks & Adapter settings',
    discussion:
      'Presented Gondi vocabulary stats. Discussed custom adapters vs full fine-tuning.',
    supervisorComments:
      'Adapter fine-tuning will reduce server cost. Prepare design chart for adapter architecture.',
    actionItems: [
      'Implement adapter layer in PyTorch model',
      'Draft semester progress report 1',
    ],
    nextMeetingDate: '02 Jul 2025',
  },
];

export const sampleProgressReports: ProgressReport[] = [
  {
    id: 'R-001',
    type: 'Semester',
    period: 'Jan 2025 - Jun 2025',
    workCompleted:
      'Gathered parallel corpus for Gondi dialect. Setup baseline model using IndicBART.',
    problemsFaced:
      'Lack of pre-written Gondi script data. Relied heavily on field speech recordings converted to dev-text.',
    futurePlan: 'Execute adapter fine-tuning runs and calculate BLEU scores.',
    submittedOn: '15 Jun 2025',
    status: 'Approved',
    comments:
      'Academic progress is excellent. Proceed with neural evaluations.',
  },
  {
    id: 'R-002',
    type: 'Monthly',
    period: 'Jul 2025',
    workCompleted:
      'Configured parameter-efficient adapters. Achieved BLEU score of 12.4 on test dial.',
    problemsFaced: 'GPU memory out-of-bounds on large transformer stacks.',
    futurePlan: 'Benchmark smaller quantization variants (int8).',
    submittedOn: '01 Aug 2025',
    status: 'Submitted',
  },
];

export const supervisorDatabase: SupervisorRecord[] = [
  {
    id: 'SUP-089',
    name: 'Dr. Sanjay Tanwani',
    department: 'School of Computer Science',
    designation: 'Professor & HOD',
    expertise: [
      'Natural Language Processing',
      'Big Data Analytics',
      'Distributed Systems',
    ],
    maxLimit: 8,
    currentAllocation: 6,
    availability: 'Available',
    contact: 'sanjay.tanwani@dauniv.ac.in',
  },
  {
    id: 'SUP-102',
    name: 'Dr. Preeti Saxena',
    department: 'School of Computer Science',
    designation: 'Associate Professor',
    expertise: ['Machine Learning', 'Neural Networks', 'Data Mining'],
    maxLimit: 6,
    currentAllocation: 5,
    availability: 'Available',
    contact: 'preeti.saxena@dauniv.ac.in',
  },
  {
    id: 'SUP-154',
    name: 'Dr. Priyesh Kanungo',
    department: 'Information Technology',
    designation: 'Professor',
    expertise: ['Computational Linguistics', 'Cloud Computing', 'AI Security'],
    maxLimit: 8,
    currentAllocation: 8,
    availability: 'Full',
    contact: 'pkanungo@dauniv.ac.in',
  },
];

export const auditLogsList = [
  {
    id: '1',
    action: 'Proposal Submission',
    timestamp: '12 Mar 2026 14:23:10',
    details: 'Scholar Sahu submitted low-resource translation proposal.',
    performedBy: 'Rajesh Kumar Sahu',
    role: 'Scholar',
    ipAddress: '172.16.50.21',
  },
  {
    id: '2',
    action: 'Plagiarism Checked',
    timestamp: '12 Mar 2026 16:45:22',
    details: 'Turnitin report generated. Similarity index 8.5% passed.',
    performedBy: 'System Auto-Check',
    role: 'Integration',
    ipAddress: '127.0.0.1',
  },
  {
    id: '3',
    action: 'Supervisor Signoff',
    timestamp: '15 Mar 2026 11:00:14',
    details: 'Approved proposal as supervisor and guide.',
    performedBy: 'Dr. Sanjay Tanwani',
    role: 'Supervisor',
    ipAddress: '172.16.10.89',
  },
  {
    id: '4',
    action: 'HOD Approval',
    timestamp: '16 Mar 2026 10:22:01',
    details: 'Forwarded proposal to University Research Cell.',
    performedBy: 'Dr. Sanjay Tanwani',
    role: 'HOD',
    ipAddress: '172.16.10.89',
  },
];

export const integrationStatusList = [
  {
    id: 'turnitin',
    name: 'Turnitin similarity Engine',
    type: 'External',
    status: 'Connected',
    lastSync: '30 Jun 2026 09:15',
    health: '99.8%',
    latency: '240ms',
  },
  {
    id: 'orcid',
    name: 'ORCID Profile API',
    type: 'External',
    status: 'Connected',
    lastSync: '30 Jun 2026 08:30',
    health: '100%',
    latency: '120ms',
  },
  {
    id: 'shodhganga',
    name: 'Shodhganga National Archive',
    type: 'External',
    status: 'Connected',
    lastSync: '29 Jun 2026 23:00',
    health: '95.4%',
    latency: '480ms',
  },
  {
    id: 'crossref',
    name: 'Crossref DOI Generator',
    type: 'External',
    status: 'Connected',
    lastSync: '30 Jun 2026 04:00',
    health: '98.9%',
    latency: '350ms',
  },
  {
    id: 'sis',
    name: 'ERP Student Module (SIS)',
    type: 'Internal',
    status: 'Connected',
    lastSync: '30 Jun 2026 11:00',
    health: '100%',
    latency: '15ms',
  },
  {
    id: 'exams',
    name: 'ERP Examination Module',
    type: 'Internal',
    status: 'Connected',
    lastSync: '30 Jun 2026 10:45',
    health: '100%',
    latency: '20ms',
  },
];
