// ─── Projects ────────────────────────────────────────────────────────────────
export type ProjectStatus =
  | 'Planning'
  | 'Ongoing'
  | 'Completed'
  | 'Delayed'
  | 'On Hold';
export type Priority = 'High' | 'Medium' | 'Low';
export type FundingSource =
  | 'Central Govt'
  | 'State Govt'
  | 'University Fund'
  | 'UGC Grant'
  | 'External';

export interface Project {
  id: string;
  code: string;
  name: string;
  type: string;
  department: string;
  campus: string;
  description: string;
  estimatedCost: number;
  fundingSource: FundingSource;
  startDate: string;
  endDate: string;
  manager: string;
  priority: Priority;
  status: ProjectStatus;
  constructionPermissionDoc?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    code: 'INFRA-001',
    name: 'Academic Block Renovation',
    type: 'Renovation',
    department: 'Civil Engineering',
    campus: 'Main Campus',
    description:
      'Complete renovation of the academic block including structural repair and electrical upgrades.',
    estimatedCost: 4500000,
    fundingSource: 'University Fund',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    manager: 'Dr. Ramesh Kumar',
    priority: 'High',
    status: 'Ongoing',
  },
  {
    id: '2',
    code: 'INFRA-002',
    name: 'Library Extension',
    type: 'New Construction',
    department: 'Library',
    campus: 'Main Campus',
    description:
      'Extension of the central library to add 500 additional seating capacity.',
    estimatedCost: 7800000,
    fundingSource: 'UGC Grant',
    startDate: '2025-03-01',
    endDate: '2026-03-31',
    manager: 'Er. Sunita Sharma',
    priority: 'High',
    status: 'Planning',
  },
  {
    id: '3',
    code: 'INFRA-003',
    name: 'Solar Power Installation',
    type: 'Installation',
    department: 'Electrical',
    campus: 'North Campus',
    description: '500 kW solar panel installation across hostel rooftops.',
    estimatedCost: 3200000,
    fundingSource: 'State Govt',
    startDate: '2024-10-01',
    endDate: '2025-06-30',
    manager: 'Er. Amit Patel',
    priority: 'Medium',
    status: 'Completed',
  },
  {
    id: '4',
    code: 'INFRA-004',
    name: 'Sports Complex',
    type: 'New Construction',
    department: 'Physical Education',
    campus: 'South Campus',
    description:
      'Multi-purpose sports complex with indoor courts and gymnasium.',
    estimatedCost: 15000000,
    fundingSource: 'Central Govt',
    startDate: '2024-06-01',
    endDate: '2025-06-30',
    manager: 'Er. Priya Nair',
    priority: 'High',
    status: 'Delayed',
  },
  {
    id: '5',
    code: 'INFRA-005',
    name: 'Boys Hostel Block C',
    type: 'New Construction',
    department: 'Student Affairs',
    campus: 'Main Campus',
    description:
      'Construction of a new 4-storey hostel block for 200 students.',
    estimatedCost: 9500000,
    fundingSource: 'University Fund',
    startDate: '2025-06-01',
    endDate: '2026-12-31',
    manager: 'Er. Suresh Iyer',
    priority: 'Medium',
    status: 'Planning',
  },
  {
    id: '6',
    code: 'INFRA-006',
    name: 'Campus Road Repair',
    type: 'Maintenance',
    department: 'Civil Engineering',
    campus: 'Main Campus',
    description: 'Resurfacing and repair of internal campus roads.',
    estimatedCost: 1200000,
    fundingSource: 'University Fund',
    startDate: '2025-04-01',
    endDate: '2025-07-31',
    manager: 'Er. Kavitha Menon',
    priority: 'Low',
    status: 'On Hold',
  },
];

// ─── Proposals ───────────────────────────────────────────────────────────────
export interface Proposal {
  id: string;
  proposalNo: string;
  projectId: string;
  projectName: string;
  submittedBy: string;
  proposalDate: string;
  estimatedCost: number;
  objective: string;
  justification: string;
  scope: string;
  benefits: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
}

export const proposals: Proposal[] = [
  {
    id: '1',
    proposalNo: 'PROP-2025-001',
    projectId: '2',
    projectName: 'Library Extension',
    submittedBy: 'Er. Sunita Sharma',
    proposalDate: '2025-01-10',
    estimatedCost: 7800000,
    objective: 'Expand library capacity',
    justification: 'Current library is at 120% capacity',
    scope: 'G+2 extension building',
    benefits: 'Enhanced student learning environment',
    status: 'Approved',
  },
  {
    id: '2',
    proposalNo: 'PROP-2025-002',
    projectId: '5',
    projectName: 'Boys Hostel Block C',
    submittedBy: 'Er. Suresh Iyer',
    proposalDate: '2025-02-20',
    estimatedCost: 9500000,
    objective: 'Additional hostel accommodation',
    justification: 'Shortage of hostel rooms for outstation students',
    scope: '4-storey 200-bed hostel',
    benefits: 'Better student retention',
    status: 'Under Review',
  },
  {
    id: '3',
    proposalNo: 'PROP-2025-003',
    projectId: '6',
    projectName: 'Campus Road Repair',
    submittedBy: 'Er. Kavitha Menon',
    proposalDate: '2025-03-05',
    estimatedCost: 1200000,
    objective: 'Restore road surface quality',
    justification: 'Potholes causing vehicle damage and safety hazard',
    scope: '5 km of internal campus roads',
    benefits: 'Improved campus mobility',
    status: 'Submitted',
  },
];

// ─── Budget Allocations ───────────────────────────────────────────────────────
export interface BudgetAllocation {
  id: string;
  projectId: string;
  projectName: string;
  financialYear: string;
  budgetHead: string;
  allocatedAmount: number;
  usedAmount: number;
  fundingSource: FundingSource;
  remarks: string;
  status: 'Active' | 'Exhausted' | 'Partially Used';
}

export const budgetAllocations: BudgetAllocation[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    financialYear: '2025-26',
    budgetHead: 'Civil Works',
    allocatedAmount: 3000000,
    usedAmount: 2100000,
    fundingSource: 'University Fund',
    remarks: 'Phase 1 civil works',
    status: 'Partially Used',
  },
  {
    id: '2',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    financialYear: '2025-26',
    budgetHead: 'Electrical Works',
    allocatedAmount: 1500000,
    usedAmount: 1500000,
    fundingSource: 'University Fund',
    remarks: 'Electrical wiring and fixtures',
    status: 'Exhausted',
  },
  {
    id: '3',
    projectId: '3',
    projectName: 'Solar Power Installation',
    financialYear: '2024-25',
    budgetHead: 'Equipment',
    allocatedAmount: 3200000,
    usedAmount: 3200000,
    fundingSource: 'State Govt',
    remarks: 'Solar panels and inverters',
    status: 'Exhausted',
  },
  {
    id: '4',
    projectId: '4',
    projectName: 'Sports Complex',
    financialYear: '2024-25',
    budgetHead: 'Civil Works',
    allocatedAmount: 8000000,
    usedAmount: 5500000,
    fundingSource: 'Central Govt',
    remarks: 'Foundation and structure',
    status: 'Partially Used',
  },
  {
    id: '5',
    projectId: '5',
    projectName: 'Boys Hostel Block C',
    financialYear: '2025-26',
    budgetHead: 'Civil Works',
    allocatedAmount: 9500000,
    usedAmount: 0,
    fundingSource: 'University Fund',
    remarks: 'Full project budget',
    status: 'Active',
  },
];

// ─── Tenders ──────────────────────────────────────────────────────────────────
export interface Tender {
  id: string;
  tenderNo: string;
  projectId: string;
  projectName: string;
  tenderType: 'Open' | 'Limited' | 'Single Source';
  publishDate: string;
  closingDate: string;
  estimatedValue: number;
  eligibility: string;
  remarks: string;
  status: 'Draft' | 'Published' | 'Closed' | 'Awarded' | 'Cancelled';
}

export const tenders: Tender[] = [
  {
    id: '1',
    tenderNo: 'TDR-2025-001',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    tenderType: 'Open',
    publishDate: '2024-12-01',
    closingDate: '2024-12-31',
    estimatedValue: 4500000,
    eligibility: 'Class A Civil Contractors with 5+ years experience',
    remarks: 'EMD Rs 90,000 required',
    status: 'Awarded',
  },
  {
    id: '2',
    tenderNo: 'TDR-2025-002',
    projectId: '4',
    projectName: 'Sports Complex',
    tenderType: 'Open',
    publishDate: '2024-04-01',
    closingDate: '2024-05-15',
    estimatedValue: 15000000,
    eligibility: 'Class AA registered with PWD',
    remarks: 'Performance guarantee required',
    status: 'Awarded',
  },
  {
    id: '3',
    tenderNo: 'TDR-2025-003',
    projectId: '2',
    projectName: 'Library Extension',
    tenderType: 'Open',
    publishDate: '2025-02-01',
    closingDate: '2025-03-15',
    estimatedValue: 7800000,
    eligibility: 'Class A Civil Contractors',
    remarks: 'Technical bid + financial bid',
    status: 'Published',
  },
  {
    id: '4',
    tenderNo: 'TDR-2025-004',
    projectId: '5',
    projectName: 'Boys Hostel Block C',
    tenderType: 'Open',
    publishDate: '2025-05-01',
    closingDate: '2025-06-15',
    estimatedValue: 9500000,
    eligibility: 'Class A or above',
    remarks: 'Site visit mandatory',
    status: 'Draft',
  },
];

// ─── Contractors ──────────────────────────────────────────────────────────────
export interface Contractor {
  id: string;
  companyName: string;
  contractorName: string;
  address: string;
  mobile: string;
  email: string;
  gstNo: string;
  pan: string;
  registrationNo: string;
  bank: string;
  rating: number;
  status: 'Active' | 'Blacklisted' | 'Inactive';
}

export const contractors: Contractor[] = [
  {
    id: '1',
    companyName: 'Rajesh Constructions Pvt Ltd',
    contractorName: 'Rajesh Verma',
    address: '123, Industrial Area, Sector 5, Nagpur',
    mobile: '9876543210',
    email: 'rajesh@rconst.com',
    gstNo: '27AABCR1234A1Z5',
    pan: 'AABCR1234A',
    registrationNo: 'PWD-MH-A-001',
    bank: 'SBI - A/c 1234567890',
    rating: 4.5,
    status: 'Active',
  },
  {
    id: '2',
    companyName: 'Sharma Infra Ltd',
    contractorName: 'Vikram Sharma',
    address: '45, Civil Lines, Pune',
    mobile: '9765432109',
    email: 'vikram@sharmainfra.com',
    gstNo: '27AABCS5678B1Z3',
    pan: 'AABCS5678B',
    registrationNo: 'PWD-MH-AA-005',
    bank: 'PNB - A/c 9876543210',
    rating: 4.0,
    status: 'Active',
  },
  {
    id: '3',
    companyName: 'Green Build Associates',
    contractorName: 'Amit Gupta',
    address: '78, MG Road, Nashik',
    mobile: '9654321098',
    email: 'amit@greenbuild.in',
    gstNo: '27AABCG3456C1Z1',
    pan: 'AABCG3456C',
    registrationNo: 'PWD-MH-B-012',
    bank: 'HDFC - A/c 1122334455',
    rating: 3.8,
    status: 'Active',
  },
  {
    id: '4',
    companyName: 'Suntech Electricals',
    contractorName: 'Sunil Patil',
    address: '22, MIDC, Aurangabad',
    mobile: '9543210987',
    email: 'sunil@suntech.com',
    gstNo: '27AABCS9012D1Z7',
    pan: 'AABCS9012D',
    registrationNo: 'PWD-MH-ELEC-008',
    bank: 'Axis - A/c 5566778899',
    rating: 4.2,
    status: 'Active',
  },
  {
    id: '5',
    companyName: 'Patel Builders',
    contractorName: 'Haresh Patel',
    address: '5, Ring Road, Kolhapur',
    mobile: '9432109876',
    email: 'haresh@patelbuilders.com',
    gstNo: '27AABCP2345E1Z9',
    pan: 'AABCP2345E',
    registrationNo: 'PWD-MH-A-019',
    bank: 'BOI - A/c 2233445566',
    rating: 2.5,
    status: 'Blacklisted',
  },
];

// ─── Work Orders ──────────────────────────────────────────────────────────────
export interface WorkOrder {
  id: string;
  workOrderNo: string;
  projectId: string;
  projectName: string;
  contractorId: string;
  contractorName: string;
  issueDate: string;
  completionDate: string;
  amount: number;
  terms: string;
  status: 'Issued' | 'In Progress' | 'Completed' | 'Terminated';
}

export const workOrders: WorkOrder[] = [
  {
    id: '1',
    workOrderNo: 'WO-2025-001',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    contractorId: '1',
    contractorName: 'Rajesh Constructions Pvt Ltd',
    issueDate: '2025-01-20',
    completionDate: '2025-12-31',
    amount: 4500000,
    terms: 'Payment on milestone completion',
    status: 'In Progress',
  },
  {
    id: '2',
    workOrderNo: 'WO-2024-002',
    projectId: '3',
    projectName: 'Solar Power Installation',
    contractorId: '4',
    contractorName: 'Suntech Electricals',
    issueDate: '2024-10-15',
    completionDate: '2025-06-30',
    amount: 3200000,
    terms: '40% advance, 60% on completion',
    status: 'Completed',
  },
  {
    id: '3',
    workOrderNo: 'WO-2024-003',
    projectId: '4',
    projectName: 'Sports Complex',
    contractorId: '2',
    contractorName: 'Sharma Infra Ltd',
    issueDate: '2024-06-01',
    completionDate: '2025-06-30',
    amount: 15000000,
    terms: 'Quarterly billing',
    status: 'In Progress',
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────
export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  milestoneName: string;
  description: string;
  plannedDate: string;
  completionDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
}

export const milestones: Milestone[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    milestoneName: 'Site Clearance',
    description: 'Complete removal of existing debris and site preparation',
    plannedDate: '2025-02-01',
    completionDate: '2025-02-05',
    status: 'Completed',
  },
  {
    id: '2',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    milestoneName: 'Civil Work Phase 1',
    description: 'Foundation reinforcement and wall repair',
    plannedDate: '2025-05-01',
    completionDate: '2025-05-20',
    status: 'Completed',
  },
  {
    id: '3',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    milestoneName: 'Electrical Wiring',
    description: 'Complete internal wiring and panel upgrade',
    plannedDate: '2025-08-01',
    completionDate: '',
    status: 'In Progress',
  },
  {
    id: '4',
    projectId: '4',
    projectName: 'Sports Complex',
    milestoneName: 'Foundation Laying',
    description: 'Deep foundation with pile driving',
    plannedDate: '2024-09-01',
    completionDate: '2024-11-30',
    status: 'Delayed',
  },
  {
    id: '5',
    projectId: '4',
    projectName: 'Sports Complex',
    milestoneName: 'Structural Frame',
    description: 'RCC frame and slab construction',
    plannedDate: '2025-03-01',
    completionDate: '',
    status: 'Pending',
  },
  {
    id: '6',
    projectId: '3',
    projectName: 'Solar Power Installation',
    milestoneName: 'Panel Installation',
    description: 'Mounting and wiring of solar panels',
    plannedDate: '2025-02-01',
    completionDate: '2025-02-28',
    status: 'Completed',
  },
];

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface Progress {
  id: string;
  projectId: string;
  projectName: string;
  progressPct: number;
  currentStage: string;
  currentActivity: string;
  issues: string;
  nextMilestone: string;
  remarks: string;
  updatedBy: string;
  updatedDate: string;
}

export const progressRecords: Progress[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    progressPct: 65,
    currentStage: 'Electrical Works',
    currentActivity: 'Panel installation and wiring in floors 1-3',
    issues: 'Delay in supply of switchgear panels',
    nextMilestone: 'Electrical Wiring Completion',
    remarks: 'Expected to complete by Aug end',
    updatedBy: 'Er. Ramesh Kumar',
    updatedDate: '2025-06-25',
  },
  {
    id: '2',
    projectId: '4',
    projectName: 'Sports Complex',
    progressPct: 30,
    currentStage: 'Foundation',
    currentActivity: 'Pile foundation work ongoing',
    issues: 'Soil stability issues in sector B delayed work by 45 days',
    nextMilestone: 'Foundation Completion',
    remarks: 'Revised completion date: Dec 2025',
    updatedBy: 'Er. Priya Nair',
    updatedDate: '2025-06-20',
  },
  {
    id: '3',
    projectId: '3',
    projectName: 'Solar Power Installation',
    progressPct: 100,
    currentStage: 'Commissioning',
    currentActivity: 'Grid sync and monitoring setup',
    issues: 'None',
    nextMilestone: 'Final Handover',
    remarks: 'Project successfully commissioned',
    updatedBy: 'Er. Amit Patel',
    updatedDate: '2025-06-10',
  },
];

// ─── Materials ────────────────────────────────────────────────────────────────
export interface Material {
  id: string;
  projectId: string;
  projectName: string;
  materialName: string;
  unit: string;
  quantity: number;
  supplier: string;
  deliveryDate: string;
  cost: number;
}

export const materials: Material[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    materialName: 'Portland Cement (OPC 53)',
    unit: 'Bags',
    quantity: 5000,
    supplier: 'ACC Cement Ltd',
    deliveryDate: '2025-02-10',
    cost: 375000,
  },
  {
    id: '2',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    materialName: 'TMT Steel Bars (Fe500)',
    unit: 'MT',
    quantity: 80,
    supplier: 'JSW Steel',
    deliveryDate: '2025-02-15',
    cost: 560000,
  },
  {
    id: '3',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    materialName: 'Ceramic Floor Tiles',
    unit: 'Sq ft',
    quantity: 12000,
    supplier: 'Kajaria Ceramics',
    deliveryDate: '2025-05-01',
    cost: 720000,
  },
  {
    id: '4',
    projectId: '3',
    projectName: 'Solar Power Installation',
    materialName: 'Solar Panels (400W)',
    unit: 'Nos',
    quantity: 1250,
    supplier: 'Adani Solar',
    deliveryDate: '2024-11-01',
    cost: 2500000,
  },
  {
    id: '5',
    projectId: '4',
    projectName: 'Sports Complex',
    materialName: 'M30 Ready Mix Concrete',
    unit: 'Cu.m',
    quantity: 2000,
    supplier: 'RMC Readymix India',
    deliveryDate: '2024-08-01',
    cost: 1400000,
  },
  {
    id: '6',
    projectId: '4',
    projectName: 'Sports Complex',
    materialName: 'High Tensile Bolts',
    unit: 'Nos',
    quantity: 10000,
    supplier: 'Bharat Fasteners',
    deliveryDate: '2025-01-10',
    cost: 150000,
  },
];

// ─── Bills ────────────────────────────────────────────────────────────────────
export interface Bill {
  id: string;
  billNo: string;
  projectId: string;
  projectName: string;
  contractorId: string;
  contractorName: string;
  billDate: string;
  amount: number;
  gst: number;
  status: 'Submitted' | 'Verified' | 'Approved' | 'Paid' | 'Rejected';
}

export const bills: Bill[] = [
  {
    id: '1',
    billNo: 'BILL-2025-001',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    contractorId: '1',
    contractorName: 'Rajesh Constructions Pvt Ltd',
    billDate: '2025-03-31',
    amount: 1200000,
    gst: 216000,
    status: 'Paid',
  },
  {
    id: '2',
    billNo: 'BILL-2025-002',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    contractorId: '1',
    contractorName: 'Rajesh Constructions Pvt Ltd',
    billDate: '2025-06-30',
    amount: 900000,
    gst: 162000,
    status: 'Approved',
  },
  {
    id: '3',
    billNo: 'BILL-2024-003',
    projectId: '3',
    projectName: 'Solar Power Installation',
    contractorId: '4',
    contractorName: 'Suntech Electricals',
    billDate: '2025-06-15',
    amount: 3200000,
    gst: 576000,
    status: 'Paid',
  },
  {
    id: '4',
    billNo: 'BILL-2024-004',
    projectId: '4',
    projectName: 'Sports Complex',
    contractorId: '2',
    contractorName: 'Sharma Infra Ltd',
    billDate: '2025-04-30',
    amount: 3500000,
    gst: 630000,
    status: 'Verified',
  },
  {
    id: '5',
    billNo: 'BILL-2025-005',
    projectId: '4',
    projectName: 'Sports Complex',
    contractorId: '2',
    contractorName: 'Sharma Infra Ltd',
    billDate: '2025-06-28',
    amount: 2000000,
    gst: 360000,
    status: 'Submitted',
  },
];

// ─── Payments ─────────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  paymentNo: string;
  billId: string;
  billNo: string;
  projectName: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'NEFT' | 'RTGS' | 'Cheque' | 'Online';
  bank: string;
  utrNo: string;
  remarks: string;
  status: 'Processed' | 'Pending' | 'Failed';
}

export const payments: Payment[] = [
  {
    id: '1',
    paymentNo: 'PAY-2025-001',
    billId: '1',
    billNo: 'BILL-2025-001',
    projectName: 'Academic Block Renovation',
    amount: 1416000,
    paymentDate: '2025-04-10',
    paymentMode: 'RTGS',
    bank: 'SBI',
    utrNo: 'SBIN025041012345',
    remarks: 'Full payment of Bill 001',
    status: 'Processed',
  },
  {
    id: '2',
    paymentNo: 'PAY-2024-002',
    billId: '3',
    billNo: 'BILL-2024-003',
    projectName: 'Solar Power Installation',
    amount: 3776000,
    paymentDate: '2025-06-25',
    paymentMode: 'RTGS',
    bank: 'SBI',
    utrNo: 'SBIN025062598765',
    remarks: 'Final payment for solar project',
    status: 'Processed',
  },
  {
    id: '3',
    paymentNo: 'PAY-2024-003',
    billId: '4',
    billNo: 'BILL-2024-004',
    projectName: 'Sports Complex',
    amount: 4130000,
    paymentDate: '2025-05-15',
    paymentMode: 'NEFT',
    bank: 'PNB',
    utrNo: 'PUNB025051554321',
    remarks: 'Part payment bill 004',
    status: 'Processed',
  },
  {
    id: '4',
    paymentNo: 'PAY-2025-004',
    billId: '2',
    billNo: 'BILL-2025-002',
    projectName: 'Academic Block Renovation',
    amount: 1062000,
    paymentDate: '',
    paymentMode: 'RTGS',
    bank: 'SBI',
    utrNo: '',
    remarks: 'Awaiting finance approval',
    status: 'Pending',
  },
];

// ─── Inspections ──────────────────────────────────────────────────────────────
export interface Inspection {
  id: string;
  inspectionNo: string;
  projectId: string;
  projectName: string;
  inspectionDate: string;
  inspector: string;
  findings: string;
  compliance: 'Compliant' | 'Non-Compliant' | 'Partial';
  remarks: string;
  result: 'Passed' | 'Failed' | 'Conditional';
}

export const inspections: Inspection[] = [
  {
    id: '1',
    inspectionNo: 'INSP-2025-001',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    inspectionDate: '2025-05-15',
    inspector: 'PWD Inspector Sharma',
    findings:
      'Civil work quality satisfactory. Minor crack observed in east wall — to be rectified.',
    compliance: 'Partial',
    remarks: 'Re-inspection required for east wall crack',
    result: 'Conditional',
  },
  {
    id: '2',
    inspectionNo: 'INSP-2025-002',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    inspectionDate: '2025-06-01',
    inspector: 'PWD Inspector Sharma',
    findings: 'East wall crack repaired. All civil works compliant.',
    compliance: 'Compliant',
    remarks: 'Cleared for next phase',
    result: 'Passed',
  },
  {
    id: '3',
    inspectionNo: 'INSP-2024-003',
    projectId: '3',
    projectName: 'Solar Power Installation',
    inspectionDate: '2025-06-05',
    inspector: 'DISCOM Engineer Patil',
    findings: 'All panels installed as per spec. Grid sync successful.',
    compliance: 'Compliant',
    remarks: 'Project ready for handover',
    result: 'Passed',
  },
  {
    id: '4',
    inspectionNo: 'INSP-2024-004',
    projectId: '4',
    projectName: 'Sports Complex',
    inspectionDate: '2025-06-10',
    inspector: 'PWD Inspector Joshi',
    findings:
      'Foundation work incomplete. Compaction not done properly in sector B.',
    compliance: 'Non-Compliant',
    remarks: 'Contractor issued notice to comply within 30 days',
    result: 'Failed',
  },
];

// ─── Completion & Handover ────────────────────────────────────────────────────
export interface Completion {
  id: string;
  projectId: string;
  projectName: string;
  completionDate: string;
  completionCertificate: string;
  handoverDepartment: string;
  handoverTo: string;
  remarks: string;
  status: 'Pending' | 'Completed';
}

export const completions: Completion[] = [
  {
    id: '1',
    projectId: '3',
    projectName: 'Solar Power Installation',
    completionDate: '2025-06-15',
    completionCertificate: 'CC-2025-SOLAR-001',
    handoverDepartment: 'Electrical Department',
    handoverTo: 'HOD Electrical',
    remarks: 'Project handed over with O&M manual and warranty cards',
    status: 'Completed',
  },
];

// ─── Documents ────────────────────────────────────────────────────────────────
export interface ProjectDocument {
  id: string;
  documentName: string;
  projectId: string;
  projectName: string;
  documentType: string;
  uploadDate: string;
  version: string;
  remarks: string;
}

export const projectDocuments: ProjectDocument[] = [
  {
    id: '1',
    documentName: 'DPR_AcademicBlock_v2.pdf',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    documentType: 'DPR',
    uploadDate: '2025-01-05',
    version: '2.0',
    remarks: 'Revised DPR with structural audit findings',
  },
  {
    id: '2',
    documentName: 'TenderDoc_AcademicBlock.pdf',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    documentType: 'Tender',
    uploadDate: '2025-01-15',
    version: '1.0',
    remarks: 'Original tender document',
  },
  {
    id: '3',
    documentName: 'WorkOrder_WO2025001.pdf',
    projectId: '1',
    projectName: 'Academic Block Renovation',
    documentType: 'Work Order',
    uploadDate: '2025-01-22',
    version: '1.0',
    remarks: 'Signed work order copy',
  },
  {
    id: '4',
    documentName: 'SolarProject_DPR.pdf',
    projectId: '3',
    projectName: 'Solar Power Installation',
    documentType: 'DPR',
    uploadDate: '2024-09-10',
    version: '1.0',
    remarks: 'Initial DPR approved by VC',
  },
  {
    id: '5',
    documentName: 'SolarProject_CompletionCert.pdf',
    projectId: '3',
    projectName: 'Solar Power Installation',
    documentType: 'Completion Certificate',
    uploadDate: '2025-06-15',
    version: '1.0',
    remarks: 'Final completion certificate',
  },
  {
    id: '6',
    documentName: 'SportsComplex_StructuralDrawing.pdf',
    projectId: '4',
    projectName: 'Sports Complex',
    documentType: 'Drawing',
    uploadDate: '2024-05-15',
    version: '3.1',
    remarks: 'Revised structural drawings',
  },
];
