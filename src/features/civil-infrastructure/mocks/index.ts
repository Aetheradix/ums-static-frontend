// ─── Civil Works (Work Registrations) ────────────────────────────────────────
export type WorkCategory =
  | 'New Capital Construction'
  | 'Maintenance/Overhaul'
  | 'Renewal'
  | 'Strengthening'
  | 'Deposit Work'
  | 'Emergency Work';

export type WorkStatus =
  | 'Requirement Generated'
  | 'Registered'
  | 'AA Approved'
  | 'TS Granted'
  | 'Budget Locked'
  | 'Tender Issued'
  | 'Tender Awarded'
  | 'Work Order Issued'
  | 'In Progress'
  | 'Quality Check'
  | 'Completed'
  | 'DLP Active'
  | 'Closed';

export type ExecutionRoute = 'Internal' | 'External Agency';

export interface CivilWork {
  id: string;
  workId: string; // e.g. CW-2025-001
  name: string;
  category: WorkCategory;
  department: string;
  campus: string;
  location: string;
  executionRoute: ExecutionRoute;
  estimatedCost: number;
  aaAmount: number; // Administrative Approval Amount
  tsAmount: number; // Technical Sanction Amount
  contractAmount: number;
  fundingSource: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  siteEngineer: string;
  status: WorkStatus;
  priority: 'High' | 'Medium' | 'Low';
  physicalProgress: number; // 0–100
  financialProgress: number; // 0–100
  externalAgency?: string; // for Deposit Work
  workBasis?: 'SOR Based' | 'BOQ Based';
  constructionAgreementDoc?: string;
  scopeOfWorkDoc?: string;
  tpiAgencyId?: string;
  tpiAgencyName?: string;
  qualityLabId?: string;
  qualityLabName?: string;
}

export const civilWorks: CivilWork[] = [
  {
    id: '1',
    workId: 'CW-2025-001',
    name: 'New Academic Block – Science Wing',
    category: 'New Capital Construction',
    department: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Zone A – Plot 12',
    executionRoute: 'Internal',
    estimatedCost: 28500000,
    aaAmount: 27800000,
    tsAmount: 27650000,
    contractAmount: 26200000,
    fundingSource: 'UGC Grant',
    startDate: '2024-11-01',
    expectedEndDate: '2026-04-30',
    siteEngineer: 'Er. Rajesh Verma',
    status: 'In Progress',
    priority: 'High',
    physicalProgress: 42,
    financialProgress: 38,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
  },
  {
    id: '2',
    workId: 'CW-2025-002',
    name: 'Boys Hostel Block D – 200 Beds',
    category: 'New Capital Construction',
    department: 'Student Welfare',
    campus: 'Main Campus',
    location: 'Zone C – Hostel Area',
    executionRoute: 'Internal',
    estimatedCost: 18700000,
    aaAmount: 18200000,
    tsAmount: 18050000,
    contractAmount: 17400000,
    fundingSource: 'University Fund',
    startDate: '2025-01-15',
    expectedEndDate: '2026-08-31',
    siteEngineer: 'Er. Suresh Kumar',
    status: 'Tender Awarded',
    priority: 'High',
    physicalProgress: 8,
    financialProgress: 5,
    workBasis: 'BOQ Based',
    tpiAgencyId: 'TPI-02',
    tpiAgencyName: 'SGS India Pvt Ltd',
    qualityLabId: 'LAB-02',
    qualityLabName: 'MANIT Material Testing Lab',
  },
  {
    id: '3',
    workId: 'CW-2025-003',
    name: 'Internal Campus Road Resurfacing',
    category: 'Maintenance/Overhaul',
    department: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Main Gate to Admin Block – 3.2 km',
    executionRoute: 'Internal',
    estimatedCost: 3200000,
    aaAmount: 3100000,
    tsAmount: 3050000,
    contractAmount: 2950000,
    fundingSource: 'University Fund',
    startDate: '2025-03-01',
    expectedEndDate: '2025-09-30',
    siteEngineer: 'Er. Kavitha Menon',
    status: 'In Progress',
    priority: 'Medium',
    physicalProgress: 68,
    financialProgress: 61,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-03',
    tpiAgencyName: 'WAPCOS Limited',
    qualityLabId: 'LAB-03',
    qualityLabName: 'MP PWD Central Laboratory',
  },
  {
    id: '4',
    workId: 'CW-2025-004',
    name: 'Examination Hall Structural Strengthening',
    category: 'Strengthening',
    department: 'Academic Affairs',
    campus: 'Main Campus',
    location: 'Exam Block – Floor 2 & 3',
    executionRoute: 'External Agency',
    estimatedCost: 7800000,
    aaAmount: 7600000,
    tsAmount: 7550000,
    contractAmount: 7800000,
    fundingSource: 'State Govt',
    startDate: '2025-06-01',
    expectedEndDate: '2026-01-31',
    siteEngineer: 'Er. Mohan Singh',
    status: 'Tender Awarded',
    priority: 'High',
    physicalProgress: 0,
    financialProgress: 0,
    externalAgency: 'Sharma Constructions Pvt Ltd',
    workBasis: 'BOQ Based',
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
  },
  {
    id: '5',
    workId: 'CW-2025-005',
    name: 'Central Library Extension – G+2',
    category: 'New Capital Construction',
    department: 'Library',
    campus: 'Main Campus',
    location: 'Library Complex West Wing',
    executionRoute: 'Internal',
    estimatedCost: 12400000,
    aaAmount: 12000000,
    tsAmount: 11900000,
    contractAmount: 11500000,
    fundingSource: 'UGC Grant',
    startDate: '2024-08-01',
    expectedEndDate: '2025-12-31',
    siteEngineer: 'Er. Anita Rao',
    status: 'Completed',
    priority: 'Medium',
    physicalProgress: 100,
    financialProgress: 96,
    workBasis: 'SOR Based',
  },
  {
    id: '6',
    workId: 'CW-2025-006',
    name: 'Sports Complex Boundary Wall',
    category: 'New Capital Construction',
    department: 'Physical Education',
    campus: 'South Campus',
    location: 'Sports Ground Perimeter',
    executionRoute: 'Internal',
    estimatedCost: 2100000,
    aaAmount: 2000000,
    tsAmount: 1980000,
    contractAmount: 1920000,
    fundingSource: 'University Fund',
    startDate: '2025-02-01',
    expectedEndDate: '2025-07-31',
    siteEngineer: 'Er. Priya Joshi',
    status: 'In Progress',
    priority: 'Low',
    physicalProgress: 78,
    financialProgress: 72,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-03',
    tpiAgencyName: 'WAPCOS Limited',
    qualityLabId: 'LAB-02',
    qualityLabName: 'MANIT Material Testing Lab',
  },
  {
    id: '7',
    workId: 'CW-2024-007',
    name: 'Emergency Plumbing Repair – Admin Block',
    category: 'Emergency Work',
    department: 'Administration',
    campus: 'Main Campus',
    location: 'Admin Block – All Floors',
    executionRoute: 'Internal',
    estimatedCost: 480000,
    aaAmount: 480000,
    tsAmount: 475000,
    contractAmount: 470000,
    fundingSource: 'University Fund',
    startDate: '2024-12-10',
    expectedEndDate: '2024-12-25',
    actualEndDate: '2024-12-22',
    siteEngineer: 'Er. Deepak Mishra',
    status: 'DLP Active',
    priority: 'High',
    physicalProgress: 100,
    financialProgress: 100,
    workBasis: 'SOR Based',
  },
  {
    id: '8',
    workId: 'CW-2025-008',
    name: 'Outdoor Amphitheatre – Deposit Work (UGC)',
    category: 'Deposit Work',
    department: 'Student Affairs',
    campus: 'North Campus',
    location: 'Cultural Zone – Plot 5',
    executionRoute: 'External Agency',
    estimatedCost: 9500000,
    aaAmount: 9200000,
    tsAmount: 9100000,
    contractAmount: 0,
    fundingSource: 'UGC Special Grant',
    startDate: '2025-07-01',
    expectedEndDate: '2026-06-30',
    siteEngineer: 'Er. Neha Sharma',
    status: 'AA Approved',
    priority: 'Medium',
    physicalProgress: 0,
    financialProgress: 0,
    externalAgency: 'MPSEDC',
    workBasis: 'BOQ Based',
  },
];

// ─── SOR Items (Schedule of Rates) ────────────────────────────────────────────
export interface SORItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  govtRate: number; // ₹ per unit
  category: string;
  year: string;
}

export const sorItems: SORItem[] = [
  {
    id: '1',
    code: 'SOR-CC-001',
    description: 'RCC M20 Concrete (Including formwork)',
    unit: 'Cum',
    govtRate: 7600,
    category: 'Concrete Works',
    year: '2025-26',
  },
  {
    id: '2',
    code: 'SOR-CC-002',
    description: 'RCC M25 Concrete (Including formwork)',
    unit: 'Cum',
    govtRate: 8400,
    category: 'Concrete Works',
    year: '2025-26',
  },
  {
    id: '3',
    code: 'SOR-CC-003',
    description: 'PCC M10 Plain Cement Concrete',
    unit: 'Cum',
    govtRate: 5200,
    category: 'Concrete Works',
    year: '2025-26',
  },
  {
    id: '4',
    code: 'SOR-ST-001',
    description: 'HYSD Steel Reinforcement Fe415',
    unit: 'Kg',
    govtRate: 68,
    category: 'Steel Works',
    year: '2025-26',
  },
  {
    id: '5',
    code: 'SOR-ST-002',
    description: 'MS Structural Steel (Sections)',
    unit: 'Kg',
    govtRate: 72,
    category: 'Steel Works',
    year: '2025-26',
  },
  {
    id: '6',
    code: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    category: 'Earthwork',
    year: '2025-26',
  },
  {
    id: '7',
    code: 'SOR-EX-002',
    description: 'Earth Filling & Compaction',
    unit: 'Cum',
    govtRate: 280,
    category: 'Earthwork',
    year: '2025-26',
  },
  {
    id: '8',
    code: 'SOR-MN-001',
    description: 'Brick Masonry 1:6 CM (Conventional)',
    unit: 'Cum',
    govtRate: 6200,
    category: 'Masonry',
    year: '2025-26',
  },
  {
    id: '9',
    code: 'SOR-MN-002',
    description: 'Hollow Block Masonry (200mm)',
    unit: 'Sqm',
    govtRate: 890,
    category: 'Masonry',
    year: '2025-26',
  },
  {
    id: '10',
    code: 'SOR-PL-001',
    description: 'Cement Plaster 12mm 1:4 (Internal)',
    unit: 'Sqm',
    govtRate: 185,
    category: 'Plastering',
    year: '2025-26',
  },
  {
    id: '11',
    code: 'SOR-PL-002',
    description: 'Cement Plaster 20mm 1:4 (External)',
    unit: 'Sqm',
    govtRate: 220,
    category: 'Plastering',
    year: '2025-26',
  },
  {
    id: '12',
    code: 'SOR-FL-001',
    description: 'Vitrified Floor Tiles 600x600mm (AAA Grade)',
    unit: 'Sqm',
    govtRate: 950,
    category: 'Flooring',
    year: '2025-26',
  },
  {
    id: '13',
    code: 'SOR-FL-002',
    description: 'Kota Stone Flooring (Polished)',
    unit: 'Sqm',
    govtRate: 680,
    category: 'Flooring',
    year: '2025-26',
  },
  {
    id: '14',
    code: 'SOR-PT-001',
    description: 'Acrylic Distemper (2 coats) on Plastered Surface',
    unit: 'Sqm',
    govtRate: 95,
    category: 'Painting',
    year: '2025-26',
  },
  {
    id: '15',
    code: 'SOR-PT-002',
    description: 'Exterior Emulsion Paint (Weather Coat, 2 coats)',
    unit: 'Sqm',
    govtRate: 145,
    category: 'Painting',
    year: '2025-26',
  },
];

// ─── BOQ Items (Bill of Quantities) ──────────────────────────────────────────
export interface BOQItem {
  id: string;
  boqId: string; // parent BOQ reference
  workId: string;
  sorItemId: string;
  sorCode: string;
  description: string;
  unit: string;
  govtRate: number;
  approvedQty: number;
  amount: number; // govtRate × approvedQty
  isLocked: boolean;
  milestoneId?: string;
}

export const boqItems: BOQItem[] = [
  // CW-2025-001 (Academic Block)
  {
    id: 'b1',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '6',
    sorCode: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    approvedQty: 850,
    amount: 297500,
    isLocked: true,
    milestoneId: 'm1',
  },
  {
    id: 'b2',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '3',
    sorCode: 'SOR-CC-003',
    description: 'PCC M10 Plain Cement Concrete',
    unit: 'Cum',
    govtRate: 5200,
    approvedQty: 120,
    amount: 624000,
    isLocked: true,
    milestoneId: 'm1',
  },
  {
    id: 'b3',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '1',
    sorCode: 'SOR-CC-001',
    description: 'RCC M20 Concrete (Including formwork)',
    unit: 'Cum',
    govtRate: 7600,
    approvedQty: 900,
    amount: 6840000,
    isLocked: true,
    milestoneId: 'm2',
  },
  {
    id: 'b4',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '4',
    sorCode: 'SOR-ST-001',
    description: 'HYSD Steel Reinforcement Fe415',
    unit: 'Kg',
    govtRate: 68,
    approvedQty: 95000,
    amount: 6460000,
    isLocked: true,
    milestoneId: 'm2',
  },
  {
    id: 'b5',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '8',
    sorCode: 'SOR-MN-001',
    description: 'Brick Masonry 1:6 CM',
    unit: 'Cum',
    govtRate: 6200,
    approvedQty: 480,
    amount: 2976000,
    isLocked: true,
    milestoneId: 'm3',
  },
  {
    id: 'b6',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '10',
    sorCode: 'SOR-PL-001',
    description: 'Cement Plaster 12mm (Internal)',
    unit: 'Sqm',
    govtRate: 185,
    approvedQty: 8500,
    amount: 1572500,
    isLocked: true,
    milestoneId: 'm3',
  },
  {
    id: 'b7',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '12',
    sorCode: 'SOR-FL-001',
    description: 'Vitrified Floor Tiles 600x600mm',
    unit: 'Sqm',
    govtRate: 950,
    approvedQty: 3200,
    amount: 3040000,
    isLocked: true,
    milestoneId: 'm4',
  },
  {
    id: 'b8',
    boqId: 'BOQ-001',
    workId: '1',
    sorItemId: '14',
    sorCode: 'SOR-PT-001',
    description: 'Acrylic Distemper (2 coats)',
    unit: 'Sqm',
    govtRate: 95,
    approvedQty: 9000,
    amount: 855000,
    isLocked: true,
    milestoneId: 'm4',
  },

  // CW-2025-003 (Road Resurfacing)
  {
    id: 'b9',
    boqId: 'BOQ-003',
    workId: '3',
    sorItemId: '6',
    sorCode: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    approvedQty: 400,
    amount: 140000,
    isLocked: true,
    milestoneId: 'm7',
  },
  {
    id: 'b10',
    boqId: 'BOQ-003',
    workId: '3',
    sorItemId: '7',
    sorCode: 'SOR-EX-002',
    description: 'Earth Filling & Compaction',
    unit: 'Cum',
    govtRate: 280,
    approvedQty: 350,
    amount: 98000,
    isLocked: true,
    milestoneId: 'm8',
  },
  {
    id: 'b11',
    boqId: 'BOQ-003',
    workId: '3',
    sorItemId: '3',
    sorCode: 'SOR-CC-003',
    description: 'PCC M10 Plain Cement Concrete',
    unit: 'Cum',
    govtRate: 5200,
    approvedQty: 180,
    amount: 936000,
    isLocked: true,
    milestoneId: 'm8',
  },
];

// ─── E-Measurement Book ───────────────────────────────────────────────────────
export type MBStatus =
  | 'Draft'
  | 'Submitted'
  | 'Verified by AE'
  | 'Approved by EE'
  | 'Rejected';

export interface MBEntry {
  id: string;
  mbNo: string; // e.g. MB-2025-001
  workId: string;
  workName: string;
  boqItemId: string;
  sorCode: string;
  description: string;
  unit: string;
  govtRate: number;
  boqQty: number; // locked BOQ quantity
  prevBilledQty: number; // sum of all previous MBs for this item
  executedQty: number; // THIS entry's measured quantity
  cumulativeQty: number; // prevBilledQty + executedQty
  balanceQty: number; // boqQty - cumulativeQty
  billAmount: number; // executedQty × govtRate
  billNo?: string; // linked RA Bill
  raNo?: string;
  geoLatitude: string;
  geoLongitude: string;
  geoTimestamp: string;
  engineerName: string;
  deviceInfo: string;
  status: MBStatus;
  advanceAdjusted: number;
  securityDeposit: number;
  netPayable: number;
  remarks?: string;
  milestoneId?: string;
}

export const mbEntries: MBEntry[] = [
  {
    id: '1',
    mbNo: 'MB-2025-001',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    boqItemId: 'b1',
    sorCode: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    boqQty: 850,
    prevBilledQty: 0,
    executedQty: 420,
    cumulativeQty: 420,
    balanceQty: 430,
    billAmount: 147000,
    billNo: 'BILL-2025-001',
    raNo: 'RA-001/2025',
    geoLatitude: '23.1815',
    geoLongitude: '77.4200',
    geoTimestamp: '2025-03-10 10:45:22',
    engineerName: 'Er. Rajesh Verma',
    deviceInfo: 'Samsung Galaxy A52 (Android 13)',
    status: 'Approved by EE',
    advanceAdjusted: 10000,
    securityDeposit: 7350,
    netPayable: 129650,
    remarks: 'Foundation excavation completed for Grid A1–A8',
  },
  {
    id: '2',
    mbNo: 'MB-2025-002',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    boqItemId: 'b1',
    sorCode: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    boqQty: 850,
    prevBilledQty: 420,
    executedQty: 310,
    cumulativeQty: 730,
    balanceQty: 120,
    billAmount: 108500,
    billNo: 'BILL-2025-003',
    raNo: 'RA-002/2025',
    geoLatitude: '23.1816',
    geoLongitude: '77.4201',
    geoTimestamp: '2025-05-14 14:22:05',
    engineerName: 'Er. Rajesh Verma',
    deviceInfo: 'iPhone 13 (iOS 17)',
    status: 'Approved by EE',
    advanceAdjusted: 8000,
    securityDeposit: 5425,
    netPayable: 95075,
    remarks: 'Remaining excavation Grid B1–B6 complete',
  },
  {
    id: '3',
    mbNo: 'MB-2025-003',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    boqItemId: 'b3',
    sorCode: 'SOR-CC-001',
    description: 'RCC M20 Concrete (Including formwork)',
    unit: 'Cum',
    govtRate: 7600,
    boqQty: 900,
    prevBilledQty: 0,
    executedQty: 180,
    cumulativeQty: 180,
    balanceQty: 720,
    billAmount: 1368000,
    billNo: 'BILL-2025-003',
    raNo: 'RA-002/2025',
    geoLatitude: '23.1815',
    geoLongitude: '77.4199',
    geoTimestamp: '2025-06-05 09:30:15',
    engineerName: 'Er. Rajesh Verma',
    deviceInfo: 'Samsung Galaxy A52 (Android 13)',
    status: 'Verified by AE',
    advanceAdjusted: 50000,
    securityDeposit: 68400,
    netPayable: 1249600,
    remarks: 'Foundation footing + plinth beam concrete poured',
  },
  {
    id: '4',
    mbNo: 'MB-2025-004',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    boqItemId: 'b9',
    sorCode: 'SOR-EX-001',
    description: 'Earth Excavation in Ordinary Soil',
    unit: 'Cum',
    govtRate: 350,
    boqQty: 400,
    prevBilledQty: 0,
    executedQty: 280,
    cumulativeQty: 280,
    balanceQty: 120,
    billAmount: 98000,
    billNo: 'BILL-2025-004',
    raNo: 'RA-001/2025-R',
    geoLatitude: '23.1800',
    geoLongitude: '77.4180',
    geoTimestamp: '2025-04-20 11:15:30',
    engineerName: 'Er. Kavitha Menon',
    deviceInfo: 'Realme 9 Pro (Android 12)',
    status: 'Approved by EE',
    advanceAdjusted: 5000,
    securityDeposit: 4900,
    netPayable: 88100,
    remarks: 'Excavation for stretch Gate → Admin Block 2.1km',
  },
];

// ─── Running Account Bills ─────────────────────────────────────────────────────
export type RABillStatus =
  | 'Submitted'
  | 'MB Verified'
  | 'AE Checked'
  | 'EE Approved'
  | 'Finance Cleared'
  | 'Paid'
  | 'Rejected';

export interface RABill {
  id: string;
  billNo: string;
  raNo: string;
  workId: string;
  workName: string;
  contractorId: string;
  contractorName: string;
  billDate: string;
  grossAmount: number;
  advanceRecovery: number;
  securityDeposit: number;
  otherDeductions: number;
  netPayable: number;
  cumulativePaid: number;
  status: RABillStatus;
  linkedMBs: string[]; // MB IDs
  paymentDate?: string;
  paymentRef?: string;
  remarks?: string;
}

export const raBills: RABill[] = [
  {
    id: '1',
    billNo: 'BILL-2025-001',
    raNo: 'RA-001/2025',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    contractorId: 'CON-001',
    contractorName: 'Sharma Constructions Pvt Ltd',
    billDate: '2025-03-15',
    grossAmount: 147000,
    advanceRecovery: 10000,
    securityDeposit: 7350,
    otherDeductions: 0,
    netPayable: 129650,
    cumulativePaid: 129650,
    status: 'Paid',
    linkedMBs: ['1'],
    paymentDate: '2025-03-28',
    paymentRef: 'NEFT/2025/03/0042',
    remarks: 'RA Bill 1 – Excavation Phase',
  },
  {
    id: '2',
    billNo: 'BILL-2025-003',
    raNo: 'RA-002/2025',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    contractorId: 'CON-001',
    contractorName: 'Sharma Constructions Pvt Ltd',
    billDate: '2025-06-10',
    grossAmount: 1476500,
    advanceRecovery: 58000,
    securityDeposit: 73825,
    otherDeductions: 2000,
    netPayable: 1342675,
    cumulativePaid: 1472325,
    status: 'EE Approved',
    linkedMBs: ['2', '3'],
    remarks: 'RA Bill 2 – Excavation balance + Foundation Concrete',
  },
  {
    id: '3',
    billNo: 'BILL-2025-004',
    raNo: 'RA-001/2025-R',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    contractorId: 'CON-003',
    contractorName: 'Madhav Infratech',
    billDate: '2025-04-25',
    grossAmount: 98000,
    advanceRecovery: 5000,
    securityDeposit: 4900,
    otherDeductions: 0,
    netPayable: 88100,
    cumulativePaid: 88100,
    status: 'Paid',
    linkedMBs: ['4'],
    paymentDate: '2025-05-05',
    paymentRef: 'NEFT/2025/05/0018',
    remarks: 'Road excavation RA Bill',
  },
];

// ─── Contractors (Agency Master) ──────────────────────────────────────────────
export type ContractorStatus =
  | 'Active'
  | 'Blacklisted'
  | 'Suspended'
  | 'Pending Verification';

export interface Contractor {
  id: string;
  regNo: string; // registration no in vendor master
  companyName: string;
  proprietorName: string;
  grade: string; // Class A / B / C
  registeredWithPWD: boolean;
  gstNo: string;
  panNo: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  contactPhone: string;
  email: string;
  address: string;
  securityDepositPaid: number;
  performanceBond: number;
  status: ContractorStatus;
  completedWorks: number;
  totalWorksDone: number; // ₹
}

export const contractors: Contractor[] = [
  {
    id: 'CON-001',
    regNo: 'PWD/MP/CA/2019/0041',
    companyName: 'Sharma Constructions Pvt Ltd',
    proprietorName: 'Mr. Ramesh Sharma',
    grade: 'Class A',
    registeredWithPWD: true,
    gstNo: '23AABCS4832Q1ZX',
    panNo: 'AABCS4832Q',
    bankName: 'State Bank of India',
    bankAccount: '38491023450012',
    ifscCode: 'SBIN0003412',
    contactPhone: '+91 94251 88001',
    email: 'sharma.constructions@email.com',
    address: '42, Industrial Area, Phase II, Bhopal – 462022',
    securityDepositPaid: 1310000,
    performanceBond: 2620000,
    status: 'Active',
    completedWorks: 18,
    totalWorksDone: 125000000,
  },
  {
    id: 'CON-002',
    regNo: 'PWD/MP/CB/2021/0088',
    companyName: 'Nirmaan Infra Projects',
    proprietorName: 'Mr. Anil Gupta',
    grade: 'Class B',
    registeredWithPWD: true,
    gstNo: '23AACNI3212K1ZA',
    panNo: 'AACNI3212K',
    bankName: 'Bank of Baroda',
    bankAccount: '70093820001200',
    ifscCode: 'BARB0BHOPAL',
    contactPhone: '+91 88020 44321',
    email: 'nirmaan.infra@email.com',
    address: '18, New Market, Kolar Road, Bhopal – 462042',
    securityDepositPaid: 870000,
    performanceBond: 1740000,
    status: 'Active',
    completedWorks: 11,
    totalWorksDone: 58000000,
  },
  {
    id: 'CON-003',
    regNo: 'PWD/MP/CA/2020/0056',
    companyName: 'Madhav Infratech',
    proprietorName: 'Er. Suresh Patel',
    grade: 'Class A',
    registeredWithPWD: true,
    gstNo: '23AAECM8820P1ZB',
    panNo: 'AAECM8820P',
    bankName: 'HDFC Bank',
    bankAccount: '50100234500078',
    ifscCode: 'HDFC0001234',
    contactPhone: '+91 98930 22210',
    email: 'madhav.infratech@email.com',
    address: '7, Maharana Pratap Nagar, Bhopal – 462011',
    securityDepositPaid: 147500,
    performanceBond: 295000,
    status: 'Active',
    completedWorks: 24,
    totalWorksDone: 182000000,
  },
];

// ─── Tenders ──────────────────────────────────────────────────────────────────
export type TenderStatus =
  | 'Draft'
  | 'Published'
  | 'Bids Received'
  | 'Under Evaluation'
  | 'L1 Identified'
  | 'Awarded'
  | 'Cancelled';

export interface CivilTender {
  id: string;
  tenderNo: string;
  workId: string;
  workName: string;
  tenderType: 'Open (e-Procurement)' | 'Limited' | 'Single Source';
  nit: string; // Notice Inviting Tender number
  publishDate: string;
  closingDate: string;
  preBidDate: string;
  emdAmount: number; // Earnest Money Deposit
  estimatedValue: number;
  l1ContractorId?: string;
  l1ContractorName?: string;
  l1BidAmount?: number;
  l1Percentage?: number; // above/below estimated %
  totalBidsReceived?: number;
  eligibilityCriteria: string;
  status: TenderStatus;
}

export const tenders: CivilTender[] = [
  {
    id: '1',
    tenderNo: 'NIT/CW/2024-25/001',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    tenderType: 'Open (e-Procurement)',
    nit: 'NIT-CW-2024-001',
    publishDate: '2024-09-01',
    closingDate: '2024-09-25',
    preBidDate: '2024-09-10',
    emdAmount: 524000,
    estimatedValue: 26200000,
    l1ContractorId: 'CON-001',
    l1ContractorName: 'Sharma Constructions Pvt Ltd',
    l1BidAmount: 25850000,
    l1Percentage: -1.34,
    totalBidsReceived: 6,
    eligibilityCriteria:
      'Class A PWD contractors; Min 3 similar works > ₹1 Cr; Avg Turnover > ₹5 Cr (3 yrs)',
    status: 'Awarded',
  },
  {
    id: '2',
    tenderNo: 'NIT/CW/2024-25/005',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    tenderType: 'Open (e-Procurement)',
    nit: 'NIT-CW-2025-005',
    publishDate: '2024-12-15',
    closingDate: '2025-01-10',
    preBidDate: '2024-12-22',
    emdAmount: 348000,
    estimatedValue: 17400000,
    l1ContractorId: 'CON-002',
    l1ContractorName: 'Nirmaan Infra Projects',
    l1BidAmount: 17200000,
    l1Percentage: -1.15,
    totalBidsReceived: 4,
    eligibilityCriteria:
      'Class A/B PWD contractors; Min 2 hostel construction works > ₹50L',
    status: 'Awarded',
  },
  {
    id: '3',
    tenderNo: 'NIT/CW/2025-26/003',
    workId: '6',
    workName: 'Sports Complex Boundary Wall',
    tenderType: 'Limited',
    nit: 'NIT-CW-2025-003',
    publishDate: '2025-01-05',
    closingDate: '2025-01-20',
    preBidDate: '2025-01-12',
    emdAmount: 38400,
    estimatedValue: 1920000,
    l1ContractorId: 'CON-003',
    l1ContractorName: 'Madhav Infratech',
    l1BidAmount: 1895000,
    l1Percentage: -1.3,
    totalBidsReceived: 3,
    eligibilityCriteria: 'Class B and above; Min 1 boundary wall work > ₹10L',
    status: 'Awarded',
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────
export type MilestoneStatus =
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Delayed'
  | 'Quality Fail';

export interface Milestone {
  id: string;
  workId: string;
  workName: string;
  sequenceNo: number;
  milestoneName: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  weightage: number; // % of total project
  status: MilestoneStatus;
  qualityTestRequired: boolean;
  qualityTestStatus?: 'Pending' | 'Pass' | 'Fail';
  // Optional quality test details
  testName?: string;
  testType?: string;
  materialTested?: string;
  labName?: string;
  requiredValue?: string;
  observedValue?: string;
  certNo?: string;
  testDate?: string;
  uploadedDoc?: string;
  testRemarks?: string;
}

export const milestones: Milestone[] = [
  {
    id: 'm1',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 1,
    milestoneName: 'Excavation & Foundation',
    description: 'Complete excavation, PCC & RCC footings',
    plannedStartDate: '2024-11-01',
    plannedEndDate: '2025-01-31',
    actualStartDate: '2024-11-05',
    actualEndDate: '2025-02-10',
    weightage: 10,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pass',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M20 Concrete',
    labName: 'IIT Bhopal Civil Testing Lab',
    requiredValue: '≥ 20 N/mm² at 28 days',
    observedValue: '22.4 N/mm²',
    certNo: 'IIT/BPL/CC/2025/0142',
    testDate: '2025-01-20',
    uploadedDoc: 'iit_bpl_cc_2025_0142.pdf',
    testRemarks: 'All 6 cubes passed',
  },
  {
    id: 'm2',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 2,
    milestoneName: 'Plinth & Ground Floor Slab',
    description: 'Plinth beam, ground floor column & slab',
    plannedStartDate: '2025-02-01',
    plannedEndDate: '2025-04-30',
    actualStartDate: '2025-02-15',
    weightage: 15,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M20 Concrete – Columns & Slab',
    labName: 'IIT Bhopal Civil Testing Lab',
    requiredValue: '≥ 20 N/mm² at 28 days',
  },
  {
    id: 'm3',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 3,
    milestoneName: '1st Floor Structure',
    description: '1st floor columns, beams & slab casting',
    plannedStartDate: '2025-05-01',
    plannedEndDate: '2025-07-31',
    weightage: 15,
    status: 'Pending',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Tensile Strength of Steel',
    testType: 'UTM Test (IS 1786)',
    materialTested: 'Fe415 HYSD Bars 16mm',
    labName: 'MANIT Material Testing Lab',
    requiredValue: 'UTS ≥ 485 N/mm²',
  },
  {
    id: 'm4',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 4,
    milestoneName: '2nd Floor Structure',
    description: '2nd floor structure completion',
    plannedStartDate: '2025-08-01',
    plannedEndDate: '2025-10-31',
    weightage: 15,
    status: 'Pending',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M20 Concrete',
    labName: 'MANIT Material Testing Lab',
    requiredValue: '≥ 20 N/mm² at 28 days',
  },
  {
    id: 'm5',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 5,
    milestoneName: 'Masonry & Roofing',
    description: 'Brick masonry, roof slab, waterproofing',
    plannedStartDate: '2025-11-01',
    plannedEndDate: '2026-01-31',
    weightage: 15,
    status: 'Pending',
    qualityTestRequired: false,
  },
  {
    id: 'm6',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    sequenceNo: 6,
    milestoneName: 'Finishing & MEP',
    description: 'Plaster, tiles, painting, electrical & plumbing',
    plannedStartDate: '2026-02-01',
    plannedEndDate: '2026-04-30',
    weightage: 30,
    status: 'Pending',
    qualityTestRequired: false,
  },
  {
    id: 'm7',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    sequenceNo: 1,
    milestoneName: 'Old Surface Removal',
    description: 'Breaking and removing existing road surface',
    plannedStartDate: '2025-03-01',
    plannedEndDate: '2025-04-15',
    actualStartDate: '2025-03-05',
    actualEndDate: '2025-04-18',
    weightage: 20,
    status: 'In Progress',
    qualityTestRequired: false,
  },
  {
    id: 'm8',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    sequenceNo: 2,
    milestoneName: 'Sub-base & Base Course',
    description: 'Laying sub-base granular material & WMM',
    plannedStartDate: '2025-04-16',
    plannedEndDate: '2025-06-30',
    actualStartDate: '2025-04-20',
    weightage: 35,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Compaction Test – Sub Base',
    testType: 'Proctor Density Test',
    materialTested: 'Granular Sub Base Material',
    labName: 'MPRRDA Lab, Bhopal',
    requiredValue: '≥ 97% MDD',
  },
  {
    id: 'm9',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    sequenceNo: 3,
    milestoneName: 'Bituminous Top Course',
    description: 'Laying BM and SDBC courses + shoulders',
    plannedStartDate: '2025-07-01',
    plannedEndDate: '2025-09-30',
    weightage: 45,
    status: 'Pending',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Bitumen Extraction Test',
    testType: 'Centrifuge Extraction (AASHTO T164)',
    materialTested: 'Bituminous Concrete Mix',
    labName: 'MP PWD Central Laboratory',
    requiredValue: 'Binder Content ≥ 5.0%',
  },
  {
    id: 'm10',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    sequenceNo: 1,
    milestoneName: 'Foundation & Earthwork',
    description: 'Soil excavation, column footing casting, and backfilling',
    plannedStartDate: '2025-01-15',
    plannedEndDate: '2025-03-31',
    actualStartDate: '2025-01-18',
    actualEndDate: '2025-03-28',
    weightage: 20,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pass',
    testName: 'Soil Bearing Capacity Test',
    testType: 'Plate Load Test (IS 1888)',
    materialTested: 'Foundation Soil Subgrade',
    labName: 'IIT Bhopal Civil Testing Lab',
    requiredValue: 'SBC ≥ 150 kN/m²',
    observedValue: '172 kN/m²',
    certNo: 'IIT/BPL/SBC/2025/0087',
    testDate: '2025-02-10',
    uploadedDoc: 'iit_bpl_sbc_2025_0087.pdf',
    testRemarks: 'Bearing capacity matches structural design requirements',
  },
  {
    id: 'm11',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    sequenceNo: 2,
    milestoneName: 'Superstructure (G+1 Slab)',
    description: 'RCC pillar casting, floor beam slab reinforcement and concrete pouring',
    plannedStartDate: '2025-04-01',
    plannedEndDate: '2025-07-31',
    actualStartDate: '2025-04-05',
    weightage: 30,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pending',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M25 Concrete - Column Pouring',
    labName: 'MANIT Material Testing Lab',
    requiredValue: '≥ 25 N/mm² at 28 days',
  },
  {
    id: 'm12',
    workId: '6',
    workName: 'Sports Complex Boundary Wall',
    sequenceNo: 1,
    milestoneName: 'Excavation & Masonry foundation',
    description: 'Foundation digging and brick masonry up to ground level',
    plannedStartDate: '2025-02-01',
    plannedEndDate: '2025-04-15',
    actualStartDate: '2025-02-05',
    actualEndDate: '2025-04-20',
    weightage: 40,
    status: 'In Progress',
    qualityTestRequired: true,
    qualityTestStatus: 'Pass',
    testName: 'Brick Compressive strength',
    testType: 'NABL Brick strength test',
    materialTested: 'Clay Bricks',
    labName: 'MP PWD Central Laboratory',
    requiredValue: '7.5 N/mm²',
    observedValue: '8.2 N/mm²',
    certNo: 'PWD/BPL/2025/1109',
    testDate: '2025-03-15',
    uploadedDoc: 'pwd_bpl_2025_1109.pdf',
    testRemarks: 'Meets standards',
  },
  {
    id: 'm13',
    workId: '6',
    workName: 'Sports Complex Boundary Wall',
    sequenceNo: 2,
    milestoneName: 'Superstructure Brickwork & Plaster',
    description: 'Brickwork walling up to 2.4m height and plastering',
    plannedStartDate: '2025-04-16',
    plannedEndDate: '2025-07-31',
    actualStartDate: '2025-04-22',
    weightage: 60,
    status: 'In Progress',
    qualityTestRequired: false,
  },
];

// ─── Quality Tests ─────────────────────────────────────────────────────────────
export type TestResult = 'Pending' | 'Pass' | 'Fail' | 'Re-test Required';

export interface QualityTest {
  id: string;
  workId: string;
  workName: string;
  milestoneId: string;
  testName: string;
  testType: string; // Cube, Tensile, Core, etc.
  materialTested: string;
  labName: string;
  testDate?: string;
  sampleQty: number;
  requiredValue: string;
  observedValue?: string;
  result: TestResult;
  certNo?: string;
  tpiEngineer?: string;
  remarks?: string;
}

export const qualityTests: QualityTest[] = [
  {
    id: 'qt1',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    milestoneId: 'm1',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M20 Concrete',
    labName: 'IIT Bhopal Civil Lab',
    testDate: '2025-01-20',
    sampleQty: 6,
    requiredValue: '≥ 20 N/mm² at 28 days',
    observedValue: '22.4 N/mm²',
    result: 'Pass',
    certNo: 'IIT/BPL/CC/2025/0142',
    tpiEngineer: 'Er. S.K. Jain (TPI)',
    remarks: 'All 6 cubes passed',
  },
  {
    id: 'qt2',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    milestoneId: 'm1',
    testName: 'Tensile Strength of Steel',
    testType: 'UTM Test (IS 1786)',
    materialTested: 'Fe415 HYSD Bars 16mm',
    labName: 'MANIT Testing Lab',
    testDate: '2024-12-15',
    sampleQty: 3,
    requiredValue: 'UTS ≥ 485 N/mm²',
    observedValue: '512 N/mm²',
    result: 'Pass',
    certNo: 'MANIT/TL/ST/2024/0891',
    tpiEngineer: 'Er. S.K. Jain (TPI)',
    remarks: 'Steel from approved vendor',
  },
  {
    id: 'qt3',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    milestoneId: 'm2',
    testName: 'Compressive Strength of Concrete',
    testType: 'Cube Test (IS 456)',
    materialTested: 'RCC M20 Concrete – 1F Columns',
    labName: 'IIT Bhopal Civil Lab',
    sampleQty: 6,
    requiredValue: '≥ 20 N/mm² at 28 days',
    result: 'Pending',
    tpiEngineer: 'Er. S.K. Jain (TPI)',
    remarks: 'Samples collected – awaiting 28-day result',
  },
  {
    id: 'qt4',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    milestoneId: 'm8',
    testName: 'Compaction Test – Sub Base',
    testType: 'Proctor Density Test',
    materialTested: 'Granular Sub Base Material',
    labName: 'MPRRDA Lab, Bhopal',
    sampleQty: 3,
    requiredValue: '≥ 97% MDD',
    result: 'Pending',
    tpiEngineer: 'Er. P. Sharma (TPI)',
    remarks: 'Scheduled for next week',
  },
];

// ─── EOT Requests (Extension of Time) ────────────────────────────────────────
export type EOTStatus = 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
export type EOTType = 'Extension of Time' | 'Revised Estimate';

export interface EOTRequest {
  id: string;
  eotNo: string;
  workId: string;
  workName: string;
  type: EOTType;
  requestedBy: string;
  applicationDate: string;
  originalEndDate: string;
  proposedEndDate?: string;
  daysRequested?: number;
  additionalBudget?: number;
  reason: string;
  justification: string;
  status: EOTStatus;
  approvedDays?: number;
  approvedBudget?: number;
  reviewRemarks?: string;
}

export const eotRequests: EOTRequest[] = [
  {
    id: '1',
    eotNo: 'EOT-2025-001',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    type: 'Extension of Time',
    requestedBy: 'Er. Rajesh Verma',
    applicationDate: '2025-04-01',
    originalEndDate: '2026-04-30',
    proposedEndDate: '2026-07-31',
    daysRequested: 92,
    reason: 'Monsoon season delay + Supply chain disruption',
    justification:
      'Heavy rainfall from July–September 2025 caused 45 working days loss. Steel supply delay due to market shortage caused additional 47 days loss. Site records and rainfall data attached.',
    status: 'Approved',
    approvedDays: 90,
    reviewRemarks:
      'EOT approved for 90 days after review of site records. Revised completion date: 29 July 2026.',
  },
  {
    id: '2',
    eotNo: 'EOT-2025-002',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    type: 'Revised Estimate',
    requestedBy: 'Er. Kavitha Menon',
    applicationDate: '2025-05-20',
    originalEndDate: '2025-09-30',
    additionalBudget: 280000,
    reason: 'SOR rate revision + Scope increase',
    justification:
      'State Govt revised SOR rates upward by 8% effective April 2025. Additionally, 400m extra stretch identified as requiring resurfacing. Revised estimate submitted for approval.',
    status: 'Under Review',
  },
];

// ─── DLP (Defect Liability Period) ─────────────────────────────────────────────
export interface DLPRecord {
  id: string;
  workId: string;
  workName: string;
  completionDate: string;
  dlpStartDate: string;
  dlpEndDate: string; // typically 12 months
  retentionAmount: number;
  retentionReleased: boolean;
  retentionReleaseDate?: string;
  defectsReported: number;
  defectsRectified: number;
  status:
    | 'Active'
    | 'Defects Reported'
    | 'Rectification In Progress'
    | 'Closed';
  remarks?: string;
}

export const dlpRecords: DLPRecord[] = [
  {
    id: '1',
    workId: '5',
    workName: 'Central Library Extension – G+2',
    completionDate: '2025-11-30',
    dlpStartDate: '2025-12-01',
    dlpEndDate: '2026-11-30',
    retentionAmount: 575000,
    retentionReleased: false,
    defectsReported: 3,
    defectsRectified: 2,
    status: 'Defects Reported',
    remarks:
      'Minor seepage reported in terrace. Contractor notified on 2026-02-10.',
  },
  {
    id: '2',
    workId: '7',
    workName: 'Emergency Plumbing Repair – Admin Block',
    completionDate: '2024-12-22',
    dlpStartDate: '2024-12-23',
    dlpEndDate: '2025-12-22',
    retentionAmount: 23500,
    retentionReleased: false,
    defectsReported: 0,
    defectsRectified: 0,
    status: 'Active',
    remarks: 'No defects observed so far',
  },
];

// ─── Progress Logs ─────────────────────────────────────────────────────────────
export interface ProgressLog {
  id: string;
  workId: string;
  logDate: string;
  engineerName: string;
  physicalProgress: number;
  description: string;
  geoLatitude: string;
  geoLongitude: string;
  photoCount: number;
  issues?: string;
  weatherCondition: string;
  milestoneId?: string;
  milestoneName?: string;
}

export const progressLogs: ProgressLog[] = [
  {
    id: '1',
    workId: '1',
    logDate: '2025-07-01',
    engineerName: 'Er. Rajesh Verma',
    physicalProgress: 42,
    description:
      'Plinth beam reinforcement work ongoing. Concrete casting planned for 3rd July.',
    geoLatitude: '23.1815',
    geoLongitude: '77.4200',
    photoCount: 8,
    weatherCondition: 'Partly Cloudy',
    milestoneId: 'm2',
    milestoneName: 'Plinth & Ground Floor Slab',
  },
  {
    id: '2',
    workId: '1',
    logDate: '2025-06-25',
    engineerName: 'Er. Rajesh Verma',
    physicalProgress: 40,
    description:
      'Foundation concrete M20 completed for Grid A. Steel for plinth beam delivered.',
    geoLatitude: '23.1815',
    geoLongitude: '77.4200',
    photoCount: 6,
    weatherCondition: 'Clear',
    issues: 'Delay in steel delivery from supplier – 2 days',
    milestoneId: 'm1',
    milestoneName: 'Excavation & Foundation',
  },
  {
    id: '3',
    workId: '3',
    logDate: '2025-07-01',
    engineerName: 'Er. Kavitha Menon',
    physicalProgress: 68,
    description:
      'WMM layer compaction in progress. DLC complete for stretch 1.2km–1.8km.',
    geoLatitude: '23.1800',
    geoLongitude: '77.4180',
    photoCount: 5,
    weatherCondition: 'Overcast',
    milestoneId: 'm8',
    milestoneName: 'Sub-base & Base Course',
  },
  {
    id: '4',
    workId: '6',
    logDate: '2025-07-01',
    engineerName: 'Er. Priya Joshi',
    physicalProgress: 78,
    description:
      'Brick masonry for boundary wall complete. Plastering in progress – 380m done.',
    geoLatitude: '23.1750',
    geoLongitude: '77.4250',
    photoCount: 4,
    weatherCondition: 'Clear',
    milestoneId: 'm13',
    milestoneName: 'Superstructure Brickwork & Plaster',
  },
];

// ─── Work Orders ──────────────────────────────────────────────────────────────
export interface WorkOrder {
  id: string;
  workOrderNo: string;
  workId: string;
  workName: string;
  contractorId: string;
  contractorName: string;
  issuedDate: string;
  commencementDate: string;
  completionDate: string;
  contractAmount: number;
  advancePaid: number;
  advanceRecoveryRate: number; // % per RA Bill
  sdPercentage: number; // Security Deposit %
  sdAmount: number;
  status: 'Issued' | 'Work Started' | 'Suspended' | 'Completed' | 'Terminated';
  signedByContractor: boolean;
  signedByEE: boolean;
  signedByAdmin: boolean;
  tpiAgencyId?: string;
  tpiAgencyName?: string;
  qualityLabId?: string;
  qualityLabName?: string;
}

export const workOrders: WorkOrder[] = [
  {
    id: '1',
    workOrderNo: 'WO/CW/2024-25/001',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    contractorId: 'CON-001',
    contractorName: 'Sharma Constructions Pvt Ltd',
    issuedDate: '2024-10-20',
    commencementDate: '2024-11-01',
    completionDate: '2026-07-29',
    contractAmount: 25850000,
    advancePaid: 2585000,
    advanceRecoveryRate: 10,
    sdPercentage: 5,
    sdAmount: 1292500,
    status: 'Work Started',
    signedByContractor: true,
    signedByEE: true,
    signedByAdmin: true,
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
  },
  {
    id: '2',
    workOrderNo: 'WO/CW/2025-26/002',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    contractorId: 'CON-002',
    contractorName: 'Nirmaan Infra Projects',
    issuedDate: '2025-01-12',
    commencementDate: '2025-01-15',
    completionDate: '2026-08-31',
    contractAmount: 17200000,
    advancePaid: 1720000,
    advanceRecoveryRate: 10,
    sdPercentage: 5,
    sdAmount: 860000,
    status: 'Work Started',
    signedByContractor: true,
    signedByEE: true,
    signedByAdmin: true,
    tpiAgencyId: 'TPI-02',
    tpiAgencyName: 'SGS India Pvt Ltd',
    qualityLabId: 'LAB-02',
    qualityLabName: 'MANIT Material Testing Lab',
  },
  {
    id: '3',
    workOrderNo: 'WO/CW/2025-26/003',
    workId: '3',
    workName: 'Internal Campus Road Resurfacing',
    contractorId: 'CON-003',
    contractorName: 'Madhav Infratech',
    issuedDate: '2025-02-28',
    commencementDate: '2025-03-01',
    completionDate: '2025-09-30',
    contractAmount: 2950000,
    advancePaid: 295000,
    advanceRecoveryRate: 10,
    sdPercentage: 5,
    sdAmount: 147500,
    status: 'Work Started',
    signedByContractor: true,
    signedByEE: true,
    signedByAdmin: true,
    tpiAgencyId: 'TPI-03',
    tpiAgencyName: 'WAPCOS Limited',
    qualityLabId: 'LAB-03',
    qualityLabName: 'MP PWD Central Laboratory',
  },
  {
    id: '4',
    workOrderNo: 'WO/CW/2025-26/004',
    workId: '4',
    workName: 'Examination Hall Structural Strengthening',
    contractorId: 'CON-001',
    contractorName: 'Sharma Constructions Pvt Ltd',
    issuedDate: '2025-06-15',
    commencementDate: '2025-07-01',
    completionDate: '2026-01-31',
    contractAmount: 7600000,
    advancePaid: 760000,
    advanceRecoveryRate: 10,
    sdPercentage: 5,
    sdAmount: 380000,
    status: 'Issued',
    signedByContractor: true,
    signedByEE: true,
    signedByAdmin: false,
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
  },
  {
    id: '5',
    workOrderNo: 'WO/CW/2025-26/005',
    workId: '8',
    workName: 'Outdoor Amphitheatre – Deposit Work (UGC)',
    contractorId: 'CON-002',
    contractorName: 'Nirmaan Infra Projects',
    issuedDate: '2025-06-20',
    commencementDate: '2025-07-01',
    completionDate: '2026-06-30',
    contractAmount: 9200000,
    advancePaid: 920000,
    advanceRecoveryRate: 10,
    sdPercentage: 5,
    sdAmount: 460000,
    status: 'Issued',
    signedByContractor: false,
    signedByEE: false,
    signedByAdmin: false,
  },
];

export interface TPIAgency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  mobile: string;
  licenseNo: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface LabAgency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  mobile: string;
  nablAccreditation: string;
  scopeOfTesting: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export const initialTPIAgencies: TPIAgency[] = [
  {
    id: 'TPI-01',
    name: 'RITES Limited',
    contactPerson: 'Shri A.K. Sharma',
    email: 'sharma.ak@rites.com',
    mobile: '9425012345',
    licenseNo: 'TPI-REG-2021-098',
    address: 'Bhopal Office, MP Nagar',
    status: 'Active',
  },
  {
    id: 'TPI-02',
    name: 'SGS India Pvt Ltd',
    contactPerson: 'Mr. Vivek Patel',
    email: 'vivek.patel@sgs.com',
    mobile: '9893098765',
    licenseNo: 'TPI-REG-2022-142',
    address: 'Indore Regional Hub',
    status: 'Active',
  },
  {
    id: 'TPI-03',
    name: 'WAPCOS Limited',
    contactPerson: 'Dr. Sanjay Gupta',
    email: 'bhopal@wapcos.co.in',
    mobile: '9111822334',
    licenseNo: 'TPI-REG-2023-311',
    address: 'Arera Hills, Bhopal',
    status: 'Active',
  },
];

export const initialLabAgencies: LabAgency[] = [
  {
    id: 'LAB-01',
    name: 'IIT Bhopal Civil Testing Lab',
    contactPerson: 'Dr. R.C. Mishra',
    email: 'civil.testing@iitb.ac.in',
    mobile: '7552908871',
    nablAccreditation: 'NABL-TC-8891',
    scopeOfTesting: 'Concrete, Steel, Aggregates, Cement',
    address: 'IIT Campus, Bhopal',
    status: 'Active',
  },
  {
    id: 'LAB-02',
    name: 'MANIT Material Testing Lab',
    contactPerson: 'Prof. Sandeep Verma',
    email: 'verma.sandeep@manit.ac.in',
    mobile: '7552670231',
    nablAccreditation: 'NABL-TC-4521',
    scopeOfTesting: 'Concrete, Bitumen, Soils, Steel',
    address: 'MANIT Campus, Link Road 3',
    status: 'Active',
  },
  {
    id: 'LAB-03',
    name: 'MP PWD Central Laboratory',
    contactPerson: 'Er. Rajesh K. Soni',
    email: 'pwd.centrallab@mp.gov.in',
    mobile: '9407055443',
    nablAccreditation: 'NABL-TC-1209',
    scopeOfTesting: 'Brickwork, Concrete, Soils, Bitumen',
    address: 'PWD Yard, Jahangirabad',
    status: 'Active',
  },
];
