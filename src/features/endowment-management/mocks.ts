export type StatusVariant = 'pending' | 'approved' | 'rejected' | 'neutral';

export const statusVariant = (status: string): StatusVariant => {
  switch (status?.toLowerCase()) {
    case 'proposed':
    case 'draft':
    case 'returned':
    case 'closed':
      return 'neutral';
    case 'corpus building':
    case 'selection in progress':
    case 'applied':
    case 'pending':
    case 'suspended':
    case 'eligible':
    case 'shortlisted':
      return 'pending';
    case 'active':
    case 'open':
    case 'selected':
    case 'disbursed':
    case 'processed':
      return 'approved';
    case 'rejected':
    case 'failed':
      return 'rejected';
    default:
      return 'neutral';
  }
};

export const MOCK_ENDOWMENT_TYPES = [
  { id: 1, name: 'Permanent', spendable: 'No', active: true },
  { id: 2, name: 'Term', spendable: 'Yes', active: true },
  { id: 3, name: 'Quasi-Endowment', spendable: 'Yes', active: true },
  { id: 4, name: 'Gift-in-Kind', spendable: 'No', active: true },
  { id: 5, name: 'Annuity', spendable: 'Yes', active: false },
];

export const MOCK_FUND_CATEGORIES = [
  { id: 1, name: 'Scholarship', beneficiaryType: 'Student', active: true },
  { id: 2, name: 'Prize/Medal', beneficiaryType: 'Student', active: true },
  { id: 3, name: 'Named Chair', beneficiaryType: 'Faculty', active: true },
  {
    id: 4,
    name: 'Lecture Series',
    beneficiaryType: 'Institution',
    active: true,
  },
  {
    id: 5,
    name: 'Infrastructure',
    beneficiaryType: 'Institution',
    active: true,
  },
  { id: 6, name: 'Research Grant', beneficiaryType: 'Both', active: true },
];

export const MOCK_AWARD_TYPES = [
  {
    id: 1,
    name: 'Merit Scholarship',
    nature: 'Monetary',
    certificate: 'Yes',
    active: true,
  },
  {
    id: 2,
    name: 'Need-based Scholarship',
    nature: 'Monetary',
    certificate: 'Yes',
    active: true,
  },
  {
    id: 3,
    name: 'Gold Medal',
    nature: 'Both',
    certificate: 'Yes',
    active: true,
  },
  {
    id: 4,
    name: 'Cash Prize',
    nature: 'Monetary',
    certificate: 'Yes',
    active: true,
  },
  {
    id: 5,
    name: 'Book Grant',
    nature: 'Non-Monetary',
    certificate: 'No',
    active: true,
  },
  {
    id: 6,
    name: 'Travel Grant',
    nature: 'Monetary',
    certificate: 'No',
    active: true,
  },
];

export const MOCK_ELIGIBILITY_PARAMS = [
  { id: 1, name: 'Min CGPA', type: 'Number', active: true },
  { id: 2, name: 'Max Family Income', type: 'Number', active: true },
  { id: 3, name: 'Year of Study', type: 'Dropdown', active: true },
  { id: 4, name: 'Department', type: 'Dropdown', active: true },
  { id: 5, name: 'Gender', type: 'Dropdown', active: true },
  { id: 6, name: 'No Active Backlog', type: 'Boolean', active: true },
  { id: 7, name: 'Category', type: 'Dropdown', active: true },
  { id: 8, name: 'Min Attendance %', type: 'Number', active: true },
];

export const MOCK_DONORS = [
  {
    id: 1,
    name: 'Ramesh Gupta',
    type: 'Alumni',
    category: 'Individual',
    recognition: 'Patron',
    batch: '1985',
    mobile: '9876543210',
    email: 'ramesh.g@example.com',
    pan: 'ABCDE1234F',
    lifetimeContribution: 5000000,
    status: 'Active',
  },
  {
    id: 2,
    name: 'TechCorp India Pvt Ltd',
    type: 'Corporate (CSR)',
    category: 'Institutional',
    recognition: 'Benefactor',
    cin: 'U72900MH2000PTC123456',
    signatory: 'Aditi Sharma',
    mobile: '9876543211',
    email: 'csr@techcorp.in',
    lifetimeContribution: 2500000,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dr. S. K. Verma',
    type: 'Retired Faculty',
    category: 'Individual',
    recognition: 'Supporter',
    dept: 'Computer Science',
    mobile: '9876543212',
    email: 'skverma@example.com',
    pan: 'VWXYZ5678G',
    lifetimeContribution: 100000,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Anjali Desai Foundation',
    type: 'Trust/Foundation',
    category: 'Institutional',
    recognition: 'Patron',
    signatory: 'Rajesh Desai',
    mobile: '9876543213',
    email: 'info@anjalidesaifoundation.org',
    lifetimeContribution: 7500000,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    type: 'Philanthropist',
    category: 'Individual',
    recognition: 'Friend',
    mobile: '9876543214',
    email: 'vikram.s@example.com',
    pan: 'PQRST9012H',
    lifetimeContribution: 25000,
    status: 'Active',
  },
];

export const MOCK_FUNDS = [
  {
    id: 1,
    fundCode: 'FND-2025-001',
    name: 'Ramesh Gupta Memorial Scholarship Fund',
    type: 'Permanent',
    category: 'Scholarship',
    donorName: 'Ramesh Gupta',
    targetCorpus: 5000000,
    currentCorpus: 5000000,
    duration: 'Perpetual',
    status: 'Active',
    established: '12 Jan 2024',
    yield: 350000,
    disbursed: 200000,
  },
  {
    id: 2,
    fundCode: 'FND-2025-002',
    name: 'TechCorp Innovation Prize',
    type: 'Term',
    category: 'Prize/Medal',
    donorName: 'TechCorp India Pvt Ltd',
    targetCorpus: 1000000,
    currentCorpus: 1000000,
    duration: 'Fixed Term',
    endDate: '31 Dec 2030',
    status: 'Active',
    established: '05 Mar 2024',
    yield: 60000,
    disbursed: 50000,
  },
  {
    id: 3,
    fundCode: 'FND-2025-003',
    name: 'Verma Excellence Chair',
    type: 'Permanent',
    category: 'Named Chair',
    donorName: 'Dr. S. K. Verma',
    targetCorpus: 2000000,
    currentCorpus: 100000,
    duration: 'Perpetual',
    status: 'Corpus Building',
    established: '15 Aug 2025',
    yield: 0,
    disbursed: 0,
  },
  {
    id: 4,
    fundCode: 'FND-2025-004',
    name: 'Desai Women in Tech Grant',
    type: 'Quasi-Endowment',
    category: 'Research Grant',
    donorName: 'Anjali Desai Foundation',
    targetCorpus: 7500000,
    currentCorpus: 7500000,
    duration: 'Perpetual',
    status: 'Active',
    established: '20 Nov 2023',
    yield: 525000,
    disbursed: 400000,
  },
  {
    id: 5,
    fundCode: 'FND-2025-005',
    name: 'Campus Green Infrastructure',
    type: 'Permanent',
    category: 'Infrastructure',
    donorName: 'Vikram Singh',
    targetCorpus: 500000,
    currentCorpus: 25000,
    duration: 'Perpetual',
    status: 'Proposed',
    established: '01 Jan 2026',
    yield: 0,
    disbursed: 0,
  },
];

export const MOCK_DONATIONS = [
  {
    id: 1,
    donorName: 'Ramesh Gupta',
    amount: 5000000,
    mode: 'NEFT',
    date: '10 Jan 2024',
    purpose: 'Ramesh Gupta Memorial Scholarship Fund',
    eligible80G: true,
  },
  {
    id: 2,
    donorName: 'TechCorp India Pvt Ltd',
    amount: 1000000,
    mode: 'RTGS',
    date: '01 Mar 2024',
    purpose: 'TechCorp Innovation Prize',
    eligible80G: true,
  },
  {
    id: 3,
    donorName: 'Dr. S. K. Verma',
    amount: 100000,
    mode: 'Cheque',
    date: '10 Aug 2025',
    purpose: 'Verma Excellence Chair',
    eligible80G: true,
  },
  {
    id: 4,
    donorName: 'Anjali Desai Foundation',
    amount: 7500000,
    mode: 'RTGS',
    date: '15 Nov 2023',
    purpose: 'Desai Women in Tech Grant',
    eligible80G: true,
  },
  {
    id: 5,
    donorName: 'Vikram Singh',
    amount: 25000,
    mode: 'Online',
    date: '01 Jan 2026',
    purpose: 'Campus Green Infrastructure',
    eligible80G: false,
  },
];

export const MOCK_SCHEMES = [
  {
    id: 1,
    name: 'Gupta Merit Scholarship (CSE)',
    fundName: 'Ramesh Gupta Memorial Scholarship Fund',
    awardType: 'Merit Scholarship',
    frequency: 'Annual',
    budget: 200000,
    mode: 'Open',
    status: 'Open',
    openDate: '01 Jul 2026',
    closeDate: '31 Aug 2026',
  },
  {
    id: 2,
    name: 'TechCorp Best Project Prize',
    fundName: 'TechCorp Innovation Prize',
    awardType: 'Cash Prize',
    frequency: 'Annual',
    budget: 50000,
    mode: 'Auto-Select',
    status: 'Disbursed',
  },
  {
    id: 3,
    name: 'Desai Women in Tech Fellowship',
    fundName: 'Desai Women in Tech Grant',
    awardType: 'Merit Scholarship',
    frequency: 'Annual',
    budget: 400000,
    mode: 'Open',
    status: 'Selection in Progress',
    openDate: '01 May 2026',
    closeDate: '30 Jun 2026',
  },
  {
    id: 4,
    name: 'Desai Travel Grant',
    fundName: 'Desai Women in Tech Grant',
    awardType: 'Travel Grant',
    frequency: 'Event-Based',
    budget: 100000,
    mode: 'Open',
    status: 'Draft',
  },
];

export const MOCK_APPLICATIONS = [
  {
    id: 1,
    schemeName: 'Gupta Merit Scholarship (CSE)',
    studentName: 'Rahul Verma',
    cgpa: 9.2,
    status: 'Applied',
    date: '15 Jul 2026',
  },
  {
    id: 2,
    schemeName: 'Gupta Merit Scholarship (CSE)',
    studentName: 'Sneha Patel',
    cgpa: 9.5,
    status: 'Eligible',
    date: '16 Jul 2026',
  },
  {
    id: 3,
    schemeName: 'Desai Women in Tech Fellowship',
    studentName: 'Priya Sharma',
    cgpa: 9.1,
    status: 'Selected',
    date: '10 Jun 2026',
  },
  {
    id: 4,
    schemeName: 'Desai Women in Tech Fellowship',
    studentName: 'Kavita Rao',
    cgpa: 8.8,
    status: 'Shortlisted',
    date: '12 Jun 2026',
  },
  {
    id: 5,
    schemeName: 'Desai Women in Tech Fellowship',
    studentName: 'Aarti Desai',
    cgpa: 7.5,
    status: 'Rejected',
    date: '14 Jun 2026',
  },
];

export const MOCK_DISBURSEMENTS = [
  {
    id: 1,
    beneficiary: 'Priya Sharma',
    schemeName: 'Desai Women in Tech Fellowship',
    amount: 400000,
    date: '15 Jul 2026',
    mode: 'NEFT',
    status: 'Processed',
  },
  {
    id: 2,
    beneficiary: 'Amit Kumar',
    schemeName: 'TechCorp Best Project Prize',
    amount: 50000,
    date: '10 Apr 2026',
    mode: 'RTGS',
    status: 'Processed',
  },
];
