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

export type ExecutionRoute = 'Internal' | 'External Agency' | 'External';

export interface MockWorkRegistration {
  workRegistrationId: number;
  code: string;
  projectId: number;
  projectDescription?: string;
  name: string;
  workCategoryId: number;
  workCategoryName?: string;
  subCategoryId: number;
  subCategoryName?: string;
  priorityLevel: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  fundingSourceId: number;
  fundingSourceName?: string;
  workBasis: 'SOR' | 'NonSor' | 'BOQBased' | string;
  executionRoute: 'Internal' | 'External' | string;
  siteEngineerSource: 'Internal' | 'External';
  employeeIds?: number[];
  externalEngineers?: { engineerName: string; mobileNumber: string }[];
  status: string;
  estimatedCost: number;
  isActive: boolean;
}

export interface MockAdministrativeSanction extends MockWorkRegistration {
  administrativeSanctionId?: number;
  administrativeApprovalAmount?: number;
  remark?: string;
  aaStatus: 'Pending' | 'AAApproved' | string;
  documentId?: string;
  documentName?: string;
}

export interface MockTechnicalSanction extends MockAdministrativeSanction {
  technicalSanctionId?: number;
  technicalSanctionAmount?: number;
  tsStatus: 'Pending' | 'Approved' | string;
  canGrantTs?: boolean;
}

export interface MockBudgetAllocation extends MockTechnicalSanction {
  budgetAllocationId?: number;
  financialYearId?: number;
  financialYear?: string;
  budgetHeadId?: number;
  budgetHeadName?: string;
  budgetHeadCode?: string;
  budgetAmount?: number;
  isLocked?: boolean;
  canAllocateBudget?: boolean;
}

export interface CivilWork {
  id: string;
  workRegistrationId?: number;
  workId: string; // e.g. CW-2025-001
  code?: string;
  name: string;
  projectId?: number | string;
  projectDescription?: string;
  category: WorkCategory;
  workCategoryId?: number | string;
  workCategoryName?: string;
  department: string;
  subCategoryId?: number | string;
  subCategoryName?: string;
  campus: string;
  location: string;
  executionRoute: ExecutionRoute | string;
  estimatedCost: number;
  aaAmount: number; // Administrative Approval Amount
  administrativeApprovalAmount?: number;
  administrativeSanctionId?: number;
  aaStatus?: 'Pending' | 'AAApproved' | string;
  remark?: string;
  documentId?: string;
  documentName?: string;
  tsAmount: number; // Technical Sanction Amount
  technicalSanctionAmount?: number;
  technicalSanctionId?: number;
  tsStatus?: 'Pending' | 'Approved' | string;
  canGrantTs?: boolean;
  contractAmount: number;
  fundingSource: string;
  fundingSourceId?: number | string;
  fundingSourceName?: string;
  financialYearId?: number;
  financialYear?: string;
  budgetHeadId?: number | string;
  budgetHeadName?: string;
  budgetHeadCode?: string;
  budgetAmount?: number;
  budgetAllocationId?: number;
  isLocked?: boolean;
  canAllocateBudget?: boolean;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  siteEngineer: string;
  siteEngineerSource?: 'Internal' | 'External';
  employeeIds?: number[];
  externalEngineers?: { engineerName: string; mobileNumber: string }[];
  status: WorkStatus | string;
  priority: 'High' | 'Medium' | 'Low' | string;
  priorityLevel?: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  physicalProgress: number; // 0–100
  financialProgress: number; // 0–100
  externalAgency?: string; // for Deposit Work
  workBasis?:
    | 'SOR'
    | 'Non-SOR'
    | 'SOR Based'
    | 'BOQ Based'
    | 'NonSor'
    | 'BOQBased'
    | string;
  constructionAgreementDoc?: string;
  scopeOfWorkDoc?: string;
  layoutDrawingDoc?: string;
  tpiAgencyId?: string;
  tpiAgencyName?: string;
  qualityLabId?: string;
  qualityLabName?: string;
  projectArea?: string;
  landOwnershipType?: string;
  ownershipVerified?: string;
  // Dynamic documents uploaded via document master
  mandateDocs?: Record<string, string>; // { docTypeName: uploadedFileName }
  isStatuaryCheck?: boolean;
  isActive?: boolean;
}

export const civilWorks: CivilWork[] = [
  {
    id: '1',
    workRegistrationId: 1,
    workId: 'CW-2025-001',
    code: 'CW-2025-001',
    name: 'New Academic Block – Science Wing',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'New Capital Construction',
    workCategoryId: 1,
    workCategoryName: 'New Capital Construction',
    department: 'Civil Engineering Dept',
    subCategoryId: 1,
    subCategoryName: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Zone A – Plot 12',
    executionRoute: 'Internal',
    estimatedCost: 28500000,
    aaAmount: 27800000,
    administrativeApprovalAmount: 27800000,
    administrativeSanctionId: 101,
    aaStatus: 'AAApproved',
    remark: 'Sanctioned under UGC Special Capital Development Scheme.',
    documentId: 'doc-aa-001',
    documentName: 'Sanction_Order_CW_2025_001.pdf',
    tsAmount: 27650000,
    technicalSanctionAmount: 27650000,
    technicalSanctionId: 201,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 1,
    budgetHeadName: 'Capital Outlay — University Buildings & Civil Works',
    budgetHeadCode: '4202-01-203',
    budgetAmount: 27650000,
    budgetAllocationId: 301,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 26200000,
    fundingSource: 'UGC Grant',
    fundingSourceId: 1,
    fundingSourceName: 'UGC Development Grant',
    startDate: '2024-11-01',
    expectedEndDate: '2026-04-30',
    siteEngineer: 'Er. Rajesh Verma',
    siteEngineerSource: 'Internal',
    employeeIds: [101],
    status: 'In Progress',
    priority: 'High',
    priorityLevel: 'High',
    physicalProgress: 42,
    financialProgress: 38,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
    isActive: true,
  },
  {
    id: '2',
    workRegistrationId: 2,
    workId: 'CW-2025-002',
    code: 'CW-2025-002',
    name: 'Boys Hostel Block D – 200 Beds',
    projectId: 2,
    projectDescription:
      'Student Residential Infrastructure Phase II (Main Campus)',
    category: 'New Capital Construction',
    workCategoryId: 1,
    workCategoryName: 'New Capital Construction',
    department: 'Student Welfare',
    subCategoryId: 3,
    subCategoryName: 'Student Welfare & Hostels',
    campus: 'Main Campus',
    location: 'Zone C – Hostel Area',
    executionRoute: 'Internal',
    estimatedCost: 18700000,
    aaAmount: 18200000,
    administrativeApprovalAmount: 18200000,
    administrativeSanctionId: 102,
    aaStatus: 'AAApproved',
    remark:
      'Approved per B&WC resolution 4.2 for student hostel capacity enhancement.',
    documentId: 'doc-aa-002',
    documentName: 'Sanction_Order_CW_2025_002.pdf',
    tsAmount: 18050000,
    technicalSanctionAmount: 18050000,
    technicalSanctionId: 202,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 2,
    budgetHeadName: 'Revenue Maintenance & Repairs of Hostels/Colleges',
    budgetHeadCode: '2202-03-102',
    budgetAmount: 18050000,
    budgetAllocationId: 302,
    isLocked: true,
    canAllocateBudget: false,
    contractAmount: 17400000,
    fundingSource: 'University Fund',
    fundingSourceId: 3,
    fundingSourceName: 'Institute Development Fund (Internal)',
    startDate: '2025-01-15',
    expectedEndDate: '2026-08-31',
    siteEngineer: 'Er. Suresh Kumar',
    siteEngineerSource: 'Internal',
    employeeIds: [102],
    status: 'Tender Awarded',
    priority: 'High',
    priorityLevel: 'High',
    physicalProgress: 8,
    financialProgress: 5,
    workBasis: 'BOQ Based',
    tpiAgencyId: 'TPI-02',
    tpiAgencyName: 'SGS India Pvt Ltd',
    qualityLabId: 'LAB-02',
    qualityLabName: 'MANIT Material Testing Lab',
    isActive: true,
  },
  {
    id: '3',
    workRegistrationId: 3,
    workId: 'CW-2025-003',
    code: 'CW-2025-003',
    name: 'Internal Campus Road Resurfacing',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'Maintenance/Overhaul',
    workCategoryId: 2,
    workCategoryName: 'Maintenance/Overhaul',
    department: 'Civil Engineering Dept',
    subCategoryId: 1,
    subCategoryName: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Main Gate to Admin Block – 3.2 km',
    executionRoute: 'Internal',
    estimatedCost: 3200000,
    aaAmount: 3100000,
    administrativeApprovalAmount: 3100000,
    administrativeSanctionId: 103,
    aaStatus: 'AAApproved',
    remark: 'Annual maintenance budget allocation for arterial roads.',
    documentId: 'doc-aa-003',
    documentName: 'Sanction_Order_CW_2025_003.pdf',
    tsAmount: 3050000,
    technicalSanctionAmount: 3050000,
    technicalSanctionId: 203,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 2,
    budgetHeadName: 'Revenue Maintenance & Repairs of Hostels/Colleges',
    budgetHeadCode: '2202-03-102',
    budgetAmount: 3050000,
    budgetAllocationId: 303,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 2950000,
    fundingSource: 'University Fund',
    fundingSourceId: 3,
    fundingSourceName: 'Institute Development Fund (Internal)',
    startDate: '2025-03-01',
    expectedEndDate: '2025-09-30',
    siteEngineer: 'Er. Kavitha Menon',
    siteEngineerSource: 'Internal',
    employeeIds: [103],
    status: 'In Progress',
    priority: 'Medium',
    priorityLevel: 'Medium',
    physicalProgress: 68,
    financialProgress: 61,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-03',
    tpiAgencyName: 'WAPCOS Limited',
    qualityLabId: 'LAB-03',
    qualityLabName: 'MP PWD Central Laboratory',
    isActive: true,
  },
  {
    id: '4',
    workRegistrationId: 4,
    workId: 'CW-2025-004',
    code: 'CW-2025-004',
    name: 'Examination Hall Structural Strengthening',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'Strengthening',
    workCategoryId: 4,
    workCategoryName: 'Strengthening',
    department: 'Academic Affairs',
    subCategoryId: 1,
    subCategoryName: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Exam Block – Floor 2 & 3',
    executionRoute: 'External',
    estimatedCost: 7800000,
    aaAmount: 7600000,
    administrativeApprovalAmount: 7600000,
    administrativeSanctionId: 104,
    aaStatus: 'AAApproved',
    remark: 'Seismic and load retrofitting authorized under state grant.',
    tsAmount: 7550000,
    technicalSanctionAmount: 7550000,
    technicalSanctionId: 204,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 1,
    budgetHeadName: 'Capital Outlay — University Buildings & Civil Works',
    budgetHeadCode: '4202-01-203',
    budgetAmount: 7550000,
    budgetAllocationId: 304,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 7800000,
    fundingSource: 'State Govt',
    fundingSourceId: 2,
    fundingSourceName: 'State Govt Capital Grant',
    startDate: '2025-06-01',
    expectedEndDate: '2026-01-31',
    siteEngineer: 'Er. Mohan Singh',
    siteEngineerSource: 'External',
    externalEngineers: [
      { engineerName: 'Er. Mohan Singh', mobileNumber: '9826011990' },
    ],
    status: 'Tender Awarded',
    priority: 'High',
    priorityLevel: 'High',
    physicalProgress: 0,
    financialProgress: 0,
    externalAgency: 'Sharma Constructions Pvt Ltd',
    workBasis: 'BOQ Based',
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    qualityLabId: 'LAB-01',
    qualityLabName: 'IIT Bhopal Civil Testing Lab',
    isActive: true,
  },
  {
    id: '5',
    workRegistrationId: 5,
    workId: 'CW-2025-005',
    code: 'CW-2025-005',
    name: 'Central Library Extension – G+2',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'New Capital Construction',
    workCategoryId: 1,
    workCategoryName: 'New Capital Construction',
    department: 'Library',
    subCategoryId: 1,
    subCategoryName: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'Library Complex West Wing',
    executionRoute: 'Internal',
    estimatedCost: 12400000,
    aaAmount: 12000000,
    administrativeApprovalAmount: 12000000,
    administrativeSanctionId: 105,
    aaStatus: 'AAApproved',
    remark: 'UGC development grant approval for central library modernization.',
    tsAmount: 11900000,
    technicalSanctionAmount: 11900000,
    technicalSanctionId: 205,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 1,
    financialYear: '2024-25',
    budgetHeadId: 3,
    budgetHeadName: 'UGC Development Grant — Institutional Infrastructure',
    budgetHeadCode: 'UGC-CAP-99',
    budgetAmount: 11900000,
    budgetAllocationId: 305,
    isLocked: true,
    canAllocateBudget: false,
    contractAmount: 11500000,
    fundingSource: 'UGC Grant',
    fundingSourceId: 1,
    fundingSourceName: 'UGC Development Grant',
    startDate: '2024-08-01',
    expectedEndDate: '2025-12-31',
    siteEngineer: 'Er. Anita Rao',
    siteEngineerSource: 'Internal',
    employeeIds: [104],
    status: 'Completed',
    priority: 'Medium',
    priorityLevel: 'Medium',
    physicalProgress: 100,
    financialProgress: 96,
    workBasis: 'SOR Based',
    isActive: true,
  },
  {
    id: '6',
    workRegistrationId: 6,
    workId: 'CW-2025-006',
    code: 'CW-2025-006',
    name: 'Sports Complex Boundary Wall',
    projectId: 4,
    projectDescription: 'University Sports Complex & Stadium (Main Campus)',
    category: 'New Capital Construction',
    workCategoryId: 1,
    workCategoryName: 'New Capital Construction',
    department: 'Physical Education',
    subCategoryId: 5,
    subCategoryName: 'Sports Council & Facilities',
    campus: 'South Campus',
    location: 'Sports Ground Perimeter',
    executionRoute: 'Internal',
    estimatedCost: 2100000,
    aaAmount: 2000000,
    administrativeApprovalAmount: 2000000,
    administrativeSanctionId: 106,
    aaStatus: 'AAApproved',
    remark: 'Campus perimeter security walling sanctioned.',
    tsAmount: 1980000,
    technicalSanctionAmount: 1980000,
    technicalSanctionId: 206,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 4,
    budgetHeadName: 'Institute Development Fund (Internal Corpus)',
    budgetHeadCode: 'IDF-GEN-12',
    budgetAmount: 1980000,
    budgetAllocationId: 306,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 1920000,
    fundingSource: 'University Fund',
    fundingSourceId: 3,
    fundingSourceName: 'Institute Development Fund (Internal)',
    startDate: '2025-02-01',
    expectedEndDate: '2025-07-31',
    siteEngineer: 'Er. Priya Joshi',
    siteEngineerSource: 'Internal',
    employeeIds: [105],
    status: 'In Progress',
    priority: 'Low',
    priorityLevel: 'Low',
    physicalProgress: 78,
    financialProgress: 72,
    workBasis: 'SOR Based',
    tpiAgencyId: 'TPI-03',
    tpiAgencyName: 'WAPCOS Limited',
    qualityLabId: 'LAB-02',
    qualityLabName: 'MANIT Material Testing Lab',
    isActive: true,
  },
  {
    id: '7',
    workRegistrationId: 7,
    workId: 'CW-2024-007',
    code: 'CW-2024-007',
    name: 'Emergency Plumbing Repair – Admin Block',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'Emergency Work',
    workCategoryId: 6,
    workCategoryName: 'Emergency Work',
    department: 'Administration',
    subCategoryId: 2,
    subCategoryName: 'Estate & Campus Maintenance',
    campus: 'Main Campus',
    location: 'Admin Block – All Floors',
    executionRoute: 'Internal',
    estimatedCost: 480000,
    aaAmount: 480000,
    administrativeApprovalAmount: 480000,
    administrativeSanctionId: 107,
    aaStatus: 'AAApproved',
    remark:
      'Emergency administrative sanction under Vice Chancellor discretionary emergency power.',
    tsAmount: 475000,
    technicalSanctionAmount: 475000,
    technicalSanctionId: 207,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 1,
    financialYear: '2024-25',
    budgetHeadId: 2,
    budgetHeadName: 'Revenue Maintenance & Repairs of Hostels/Colleges',
    budgetHeadCode: '2202-03-102',
    budgetAmount: 475000,
    budgetAllocationId: 307,
    isLocked: true,
    canAllocateBudget: false,
    contractAmount: 470000,
    fundingSource: 'University Fund',
    fundingSourceId: 3,
    fundingSourceName: 'Institute Development Fund (Internal)',
    startDate: '2024-12-10',
    expectedEndDate: '2024-12-25',
    actualEndDate: '2024-12-22',
    siteEngineer: 'Er. Deepak Mishra',
    siteEngineerSource: 'Internal',
    employeeIds: [106],
    status: 'DLP Active',
    priority: 'High',
    priorityLevel: 'High',
    physicalProgress: 100,
    financialProgress: 100,
    workBasis: 'SOR Based',
    isActive: true,
  },
  {
    id: '8',
    workRegistrationId: 8,
    workId: 'CW-2025-008',
    code: 'CW-2025-008',
    name: 'Outdoor Amphitheatre – Deposit Work (UGC)',
    projectId: 3,
    projectDescription:
      'Campus Green Infrastructure & Solar Transition (City Campus)',
    category: 'Deposit Work',
    workCategoryId: 5,
    workCategoryName: 'Deposit Work',
    department: 'Student Affairs',
    subCategoryId: 3,
    subCategoryName: 'Student Welfare & Hostels',
    campus: 'North Campus',
    location: 'Cultural Zone – Plot 5',
    executionRoute: 'External',
    estimatedCost: 9500000,
    aaAmount: 9200000,
    administrativeApprovalAmount: 9200000,
    administrativeSanctionId: 108,
    aaStatus: 'AAApproved',
    remark: 'Sanctioned deposit work for MPSEDC execution.',
    tsAmount: 9100000,
    technicalSanctionAmount: 9100000,
    technicalSanctionId: 208,
    tsStatus: 'Approved',
    canGrantTs: false,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 3,
    budgetHeadName: 'UGC Development Grant — Institutional Infrastructure',
    budgetHeadCode: 'UGC-CAP-99',
    budgetAmount: 9100000,
    budgetAllocationId: 308,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 0,
    fundingSource: 'UGC Special Grant',
    fundingSourceId: 1,
    fundingSourceName: 'UGC Development Grant',
    startDate: '2025-07-01',
    expectedEndDate: '2026-06-30',
    siteEngineer: 'Er. Neha Sharma',
    siteEngineerSource: 'External',
    externalEngineers: [
      { engineerName: 'Er. Neha Sharma', mobileNumber: '9425088112' },
    ],
    status: 'AaApproved',
    priority: 'Medium',
    priorityLevel: 'Medium',
    physicalProgress: 0,
    financialProgress: 0,
    externalAgency: 'MPSEDC',
    workBasis: 'BOQ Based',
    isActive: true,
  },
  {
    id: '9',
    workRegistrationId: 9,
    workId: 'CW-2026-009',
    code: 'CW-2026-009',
    name: 'Advanced Computing & AI Research Center',
    projectId: 1,
    projectDescription: 'Main Campus Academic Complex Expansion (Main Campus)',
    category: 'New Capital Construction',
    workCategoryId: 1,
    workCategoryName: 'New Capital Construction',
    department: 'Civil Engineering Dept',
    subCategoryId: 1,
    subCategoryName: 'Civil Engineering Dept',
    campus: 'Main Campus',
    location: 'North Block – Sector 4',
    executionRoute: 'Internal',
    estimatedCost: 35000000,
    aaAmount: 0,
    administrativeApprovalAmount: undefined,
    administrativeSanctionId: undefined,
    aaStatus: 'Pending',
    tsAmount: 0,
    technicalSanctionAmount: undefined,
    technicalSanctionId: undefined,
    tsStatus: 'Pending',
    canGrantTs: false,
    contractAmount: 0,
    fundingSource: 'RUSA Grant',
    fundingSourceId: 4,
    fundingSourceName: 'Rashtriya Uchchatar Shiksha Abhiyan (RUSA)',
    startDate: '2026-04-01',
    expectedEndDate: '2027-09-30',
    siteEngineer: 'Er. Rajesh Verma',
    siteEngineerSource: 'Internal',
    employeeIds: [101],
    status: 'Registered',
    priority: 'Critical',
    priorityLevel: 'Critical',
    physicalProgress: 0,
    financialProgress: 0,
    workBasis: 'SOR Based',
    isActive: true,
  },
  {
    id: '10',
    workRegistrationId: 10,
    workId: 'CW-2026-010',
    code: 'CW-2026-010',
    name: 'Green Energy Rooftop Solar Facility 500kW',
    projectId: 3,
    projectDescription:
      'Campus Green Infrastructure & Solar Transition (City Campus)',
    category: 'Renewal',
    workCategoryId: 3,
    workCategoryName: 'Renewal',
    department: 'Electrical Engineering Wing',
    subCategoryId: 4,
    subCategoryName: 'Electrical Engineering Wing',
    campus: 'City Campus',
    location: 'All Building Rooftops',
    executionRoute: 'External',
    estimatedCost: 15000000,
    aaAmount: 14800000,
    administrativeApprovalAmount: 14800000,
    administrativeSanctionId: 110,
    aaStatus: 'AAApproved',
    remark: 'Approved by B&WC for solar net-metering project.',
    documentId: 'doc-aa-010',
    documentName: 'Sanction_Order_Solar_2026.pdf',
    tsAmount: 0,
    technicalSanctionAmount: undefined,
    technicalSanctionId: undefined,
    tsStatus: 'Pending',
    canGrantTs: true,
    financialYearId: 2,
    financialYear: '2025-26',
    budgetHeadId: 5,
    budgetHeadName: 'RUSA Phase-II Modernization & Lab Complex',
    budgetHeadCode: 'RUSA-INF-05',
    budgetAmount: 0,
    isLocked: false,
    canAllocateBudget: false,
    contractAmount: 0,
    fundingSource: 'CSR Contribution',
    fundingSourceId: 5,
    fundingSourceName: 'Industry CSR Infrastructure Contribution',
    startDate: '2026-05-01',
    expectedEndDate: '2026-11-30',
    siteEngineer: 'Er. Sandeep Singh',
    siteEngineerSource: 'External',
    externalEngineers: [
      { engineerName: 'Er. Sandeep Singh', mobileNumber: '9893011445' },
    ],
    status: 'AaApproved',
    priority: 'High',
    priorityLevel: 'High',
    physicalProgress: 0,
    financialProgress: 0,
    workBasis: 'NonSor',
    isActive: true,
  },
];

// ─── SOR Items (Schedule of Rates) ────────────────────────────────────────────
export interface MockSORItem {
  sorItemId: number;
  sorCode: string;
  itemDescription: string;
  unit: string;
  rate: number;
  sorTypeId: number;
  sorTypeName?: string;
  sorChapterId: number;
  sorChapterName?: string;
  sorSubjectId?: number;
  sorSubjectName?: string;
  isActive: boolean;
}

export interface SORItem {
  id: string;
  sorItemId?: number;
  code: string;
  sorCode?: string;
  description: string;
  itemDescription?: string;
  unit: string;
  govtRate: number; // ₹ per unit
  rate?: number;
  category: string;
  year: string;
  sorTypeId?: number | string;
  sorTypeName?: string;
  sorChapterId?: number | string;
  sorChapterName?: string;
  sorSubjectId?: number | string;
  sorSubjectName?: string;
  isActive?: boolean;
}

// ─── Technical Plans ────────────────────────────────────────────────────────
export interface MockTechnicalPlan {
  technicalPlanId: number;
  workRegistrationId: number;
  workRegistrationCode?: string;
  workRegistrationName?: string;
  plotArea: number;
  builtUpArea?: number;
  numberOfFloors?: string;
  soilType: string;
  bearingCapacity: number;
  concreteGrade: 'M10' | 'M15' | 'M20' | 'M25' | 'M30' | 'M35' | 'M40' | string;
  steelQuantity?: number;
  brickworkQuantity?: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | string;
  isActive: boolean;
}

export const initialTechnicalPlans: MockTechnicalPlan[] = [
  {
    technicalPlanId: 1,
    workRegistrationId: 1,
    workRegistrationCode: 'CW-2025-001',
    workRegistrationName: 'New Academic Block – Science Wing',
    plotArea: 2400,
    builtUpArea: 8500,
    numberOfFloors: 'G+3',
    soilType: 'Black Cotton Soil',
    bearingCapacity: 120,
    concreteGrade: 'M25',
    steelQuantity: 95,
    brickworkQuantity: 480,
    status: 'Approved',
    isActive: true,
  },
  {
    technicalPlanId: 2,
    workRegistrationId: 2,
    workRegistrationCode: 'CW-2025-002',
    workRegistrationName: 'Boys Hostel Block D – 200 Beds',
    plotArea: 3200,
    builtUpArea: 11000,
    numberOfFloors: 'G+4',
    soilType: 'Clayey Silt',
    bearingCapacity: 150,
    concreteGrade: 'M25',
    steelQuantity: 120,
    brickworkQuantity: 620,
    status: 'Approved',
    isActive: true,
  },
  {
    technicalPlanId: 3,
    workRegistrationId: 3,
    workRegistrationCode: 'CW-2025-003',
    workRegistrationName: 'Internal Campus Road Resurfacing',
    plotArea: 32000,
    numberOfFloors: 'Single Level Road',
    soilType: 'Alluvial Medium Gravel',
    bearingCapacity: 180,
    concreteGrade: 'M10',
    status: 'Approved',
    isActive: true,
  },
];

// ─── Work to Manpower Mappings ───────────────────────────────────────────────
export interface MockWorkManpowerMapping {
  workManpowerMappingId: number;
  workRegistrationId: number;
  workRegistrationCode?: string;
  workRegistrationName?: string;
  isInternal: boolean;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  designation?: string;
  externalEngineerName?: string;
  externalEngineerContactNumber?: string;
  responsibility: string;
  fromDate: string;
  toDate?: string;
  remarks?: string;
  relievingDocument?: string;
  relievingRemarks?: string;
  isActive: boolean;
}

export const initialWorkManpowerMappings: MockWorkManpowerMapping[] = [
  {
    workManpowerMappingId: 1,
    workRegistrationId: 1,
    workRegistrationCode: 'CW-2025-001',
    workRegistrationName: 'New Academic Block – Science Wing',
    isInternal: true,
    employeeId: 101,
    employeeName: 'Er. Rajesh Verma',
    employeeCode: 'EMP-CIV-001',
    designation: 'Executive Engineer (Civil)',
    responsibility: 'Lead Site Supervising Engineer — Structural Inspection',
    fromDate: '2024-11-01',
    toDate: '2026-04-30',
    remarks: 'Full-time site in-charge',
    isActive: true,
  },
  {
    workManpowerMappingId: 2,
    workRegistrationId: 2,
    workRegistrationCode: 'CW-2025-002',
    workRegistrationName: 'Boys Hostel Block D – 200 Beds',
    isInternal: true,
    employeeId: 102,
    employeeName: 'Er. Suresh Kumar',
    employeeCode: 'EMP-CIV-002',
    designation: 'Assistant Engineer (Quality)',
    responsibility: 'Assistant Engineer — Quality & Material Compliance',
    fromDate: '2025-01-15',
    toDate: '2026-08-31',
    remarks: 'Hostel construction supervision',
    isActive: true,
  },
  {
    workManpowerMappingId: 3,
    workRegistrationId: 4,
    workRegistrationCode: 'CW-2025-004',
    workRegistrationName: 'Examination Hall Structural Strengthening',
    isInternal: false,
    externalEngineerName: 'Er. Mohan Singh',
    externalEngineerContactNumber: '+91 98260 11990',
    responsibility:
      'External Chartered Structural Consultant (Seismic Retrofit)',
    fromDate: '2025-06-01',
    toDate: '2026-01-31',
    remarks: 'Engaged through State PWD empanelment',
    isActive: true,
  },
];

// ─── Vendor Agency Registrations ─────────────────────────────────────────────
export interface MockVendorAgencyRegistration {
  vendorAgencyRegistrationId: number;
  registrationNumber: string;
  companyName: string;
  proprietorName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  gstNumber: string;
  panNumber: string;
  isGstPanValidated: boolean;
  gstPanValidatedOn?: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  isBankMandateVerified: boolean;
  bankMandateVerifiedOn?: string;
  licenseGrade: string;
  securityDepositPaid: number;
  performanceBondValue: number;
  isRegisteredWithPwd: boolean;
  pwdRegistrationNumber?: string;
  pwdRegistrationDate?: string;
  completedWorks?: number;
  totalWorksDone?: number;
  isActive: boolean;
}

export const initialVendorAgencies: MockVendorAgencyRegistration[] = [
  {
    vendorAgencyRegistrationId: 1,
    registrationNumber: 'PWD/MP/CA/2019/0041',
    companyName: 'Sharma Constructions Pvt Ltd',
    proprietorName: 'Mr. Ramesh Sharma',
    contactPerson: 'Mr. Ramesh Sharma',
    contactPhone: '+91 94251 88001',
    contactEmail: 'sharma.constructions@email.com',
    officeAddress: '42, Industrial Area, Phase II, Bhopal – 462022',
    gstNumber: '23AABCS4832Q1ZX',
    panNumber: 'AABCS4832Q',
    isGstPanValidated: true,
    gstPanValidatedOn: '2024-01-15',
    bankName: 'State Bank of India',
    bankAccountNumber: '38491023450012',
    ifscCode: 'SBIN0003412',
    isBankMandateVerified: true,
    bankMandateVerifiedOn: '2024-01-20',
    licenseGrade: 'Class A',
    securityDepositPaid: 1310000,
    performanceBondValue: 2620000,
    isRegisteredWithPwd: true,
    pwdRegistrationNumber: 'PWD-MP-CA-2019-041',
    pwdRegistrationDate: '2019-04-10',
    completedWorks: 18,
    totalWorksDone: 125000000,
    isActive: true,
  },
  {
    vendorAgencyRegistrationId: 2,
    registrationNumber: 'PWD/MP/CB/2021/0088',
    companyName: 'Nirmaan Infra Projects',
    proprietorName: 'Mr. Anil Gupta',
    contactPerson: 'Mr. Anil Gupta',
    contactPhone: '+91 88020 44321',
    contactEmail: 'nirmaan.infra@email.com',
    officeAddress: '18, New Market, Kolar Road, Bhopal – 462042',
    gstNumber: '23AACNI3212K1ZA',
    panNumber: 'AACNI3212K',
    isGstPanValidated: true,
    gstPanValidatedOn: '2024-03-10',
    bankName: 'Bank of Baroda',
    bankAccountNumber: '70093820001200',
    ifscCode: 'BARB0BHOPAL',
    isBankMandateVerified: true,
    bankMandateVerifiedOn: '2024-03-15',
    licenseGrade: 'Class B',
    securityDepositPaid: 870000,
    performanceBondValue: 1740000,
    isRegisteredWithPwd: true,
    pwdRegistrationNumber: 'PWD-MP-CB-2021-088',
    pwdRegistrationDate: '2021-06-22',
    completedWorks: 11,
    totalWorksDone: 58000000,
    isActive: true,
  },
  {
    vendorAgencyRegistrationId: 3,
    registrationNumber: 'PWD/MP/CA/2020/0056',
    companyName: 'Madhav Infratech',
    proprietorName: 'Er. Suresh Patel',
    contactPerson: 'Er. Suresh Patel',
    contactPhone: '+91 98930 22210',
    contactEmail: 'madhav.infratech@email.com',
    officeAddress: '7, Maharana Pratap Nagar, Bhopal – 462011',
    gstNumber: '23AAECM8820P1ZB',
    panNumber: 'AAECM8820P',
    isGstPanValidated: true,
    gstPanValidatedOn: '2024-02-05',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100234500078',
    ifscCode: 'HDFC0001234',
    isBankMandateVerified: true,
    bankMandateVerifiedOn: '2024-02-12',
    licenseGrade: 'Class A',
    securityDepositPaid: 147500,
    performanceBondValue: 295000,
    isRegisteredWithPwd: true,
    pwdRegistrationNumber: 'PWD-MP-CA-2020-056',
    pwdRegistrationDate: '2020-09-18',
    completedWorks: 24,
    totalWorksDone: 182000000,
    isActive: true,
  },
];

export const initialSORItemMasters: MockSORItem[] = [
  {
    sorItemId: 1,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 1,
    sorChapterName: 'Earthwork & Excavation',
    sorSubjectId: 1,
    sorSubjectName: 'General Site Clearance & Excavation',
    sorCode: 'SOR-2024-01-001',
    itemDescription:
      'Earth work in excavation by mechanical means (Hydraulic excavator) / manual means in foundation trenches or drains not exceeding 1.5 m in width or 10 sqm on plan, including dressing of sides and ramming of bottoms, lift up to 1.5 m, including getting out the excavated soil and disposal of surplus excavated soil as directed, within a lead of 50 m. All kinds of soil.',
    unit: 'Cum',
    rate: 285.5,
    isActive: true,
  },
  {
    sorItemId: 2,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 1,
    sorChapterName: 'Earthwork & Excavation',
    sorSubjectId: 1,
    sorSubjectName: 'General Site Clearance & Excavation',
    sorCode: 'SOR-2024-01-002',
    itemDescription:
      'Earth work in excavation in ordinary rock including dressing of sides, lift up to 1.5 m, stack measurement within lead of 50 m.',
    unit: 'Cum',
    rate: 495.0,
    isActive: true,
  },
  {
    sorItemId: 3,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 2,
    sorChapterName: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    sorSubjectId: 3,
    sorSubjectName: 'Substructure Concrete',
    sorCode: 'SOR-2024-02-001',
    itemDescription:
      'Providing and laying in position cement concrete of specified grade excluding the cost of centering and shuttering - All work up to plinth level: 1:2:4 (1 cement : 2 coarse sand (zone-III) derived from natural sources : 4 graded stone aggregate 20 mm nominal size derived from natural sources).',
    unit: 'Cum',
    rate: 5450.0,
    isActive: true,
  },
  {
    sorItemId: 4,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 2,
    sorChapterName: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    sorSubjectId: 4,
    sorSubjectName: 'Superstructure RCC Beams & Columns',
    sorCode: 'SOR-2024-02-002',
    itemDescription:
      'Reinforced cement concrete work in beams, suspended floors, roofs having slope up to 15 deg, landings, balconies, shelves, chajjas, lintels, bands, plain window sills, staircases and spiral stair cases up to floor five level, excluding the cost of centering, shuttering, finishing and reinforcement, with 1:1.5:3 (1 cement : 1.5 coarse sand : 3 graded stone aggregate 20 mm nominal size).',
    unit: 'Cum',
    rate: 7200.0,
    isActive: true,
  },
  {
    sorItemId: 5,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 2,
    sorChapterName: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    sorSubjectId: 4,
    sorSubjectName: 'Superstructure RCC Beams & Columns',
    sorCode: 'SOR-2024-02-003',
    itemDescription:
      'Steel reinforcement for R.C.C. work including straightening, cutting, bending, placing in position and binding all complete up to plinth level: Thermo-Mechanically Treated bars of grade Fe-500D or more.',
    unit: 'Kg',
    rate: 78.5,
    isActive: true,
  },
  {
    sorItemId: 6,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 3,
    sorChapterName: 'Brickwork & Masonry',
    sorSubjectId: 5,
    sorSubjectName: 'Fly Ash Brick Masonry',
    sorCode: 'SOR-2024-03-001',
    itemDescription:
      'Brick work with common burnt clay F.P.S. (non modular) bricks of class designation 7.5 in foundation and plinth in: Cement mortar 1:6 (1 cement : 6 coarse sand).',
    unit: 'Cum',
    rate: 4650.0,
    isActive: true,
  },
  {
    sorItemId: 7,
    sorTypeId: 1,
    sorTypeName: 'Building Works (MP PWD SOR 2024)',
    sorChapterId: 3,
    sorChapterName: 'Brickwork & Masonry',
    sorSubjectId: 5,
    sorSubjectName: 'Fly Ash Brick Masonry',
    sorCode: 'SOR-2024-03-002',
    itemDescription:
      'Brick work with modular fly ash lime bricks (FALG Bricks) conforming to IS:12894-2002, in superstructure above plinth level up to floor V level in : Cement mortar 1:6 (1 cement : 6 coarse sand).',
    unit: 'Cum',
    rate: 4850.0,
    isActive: true,
  },
  {
    sorItemId: 8,
    sorTypeId: 2,
    sorTypeName: 'Roads & Bridges (MoRTH / MP PWD 2024)',
    sorChapterId: 5,
    sorChapterName: 'Sub-Base & Base Courses',
    sorSubjectId: 8,
    sorSubjectName: 'Granular Sub Base (GSB)',
    sorCode: 'SOR-2024-RD-001',
    itemDescription:
      'Construction of Granular Sub-base by providing well graded material, spreading in uniform layers with motor grader on prepared surface, mixing by pug mill/motor grader at OMC, and compacting with smooth wheel roller to achieve the desired density, complete as per Technical Specification Clause 401. Plant Mix Method - Grading I Material.',
    unit: 'Cum',
    rate: 1450.0,
    isActive: true,
  },
  {
    sorItemId: 9,
    sorTypeId: 2,
    sorTypeName: 'Roads & Bridges (MoRTH / MP PWD 2024)',
    sorChapterId: 6,
    sorChapterName: 'Bituminous Courses',
    sorSubjectId: 10,
    sorSubjectName: 'Dense Bituminous Macadam (DBM)',
    sorCode: 'SOR-2024-RD-002',
    itemDescription:
      'Providing and laying dense bituminous macadam with 100-120 TPH batch type HMP using crushed aggregates of specified grading, premixed with bituminous binder @ 4.0 to 4.5 per cent by weight of total mix and filler, transporting the hot mix to work site, laying with a hydrostatic paver finisher with sensor control to the required grade, level and alignment, rolling with smooth wheeled, vibratory and tandem rollers to achieve the desired density (50 mm thickness).',
    unit: 'Cum',
    rate: 8950.0,
    isActive: true,
  },
];

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
  // Statutory Taxation & Deductions (Task 4.1)
  gstRate?: number; // 18, 12, 0
  isRCM?: boolean; // Reverse Charge Mechanism
  gstAmount?: number;
  itTdsRate?: number; // 1% or 2% (Sec 194C)
  itTdsAmount?: number;
  gstTdsRate?: number; // 2% (Sec 51 CGST)
  gstTdsAmount?: number;
  labourCessRate?: number; // 1% (BOCW Act)
  labourCessAmount?: number;
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
    netPayable: 125197,
    cumulativePaid: 125197,
    status: 'Paid',
    linkedMBs: ['1'],
    paymentDate: '2025-03-28',
    paymentRef: 'NEFT/2025/03/0042',
    remarks: 'RA Bill 1 – Excavation Phase',
    gstRate: 18,
    isRCM: false,
    gstAmount: 26460,
    itTdsRate: 2,
    itTdsAmount: 2940,
    gstTdsRate: 2,
    gstTdsAmount: 2940,
    labourCessRate: 1,
    labourCessAmount: 1470,
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
    netPayable: 1268850,
    cumulativePaid: 1394047,
    status: 'EE Approved',
    linkedMBs: ['2', '3'],
    remarks: 'RA Bill 2 – Excavation balance + Foundation Concrete',
    gstRate: 18,
    isRCM: false,
    gstAmount: 265770,
    itTdsRate: 2,
    itTdsAmount: 29530,
    gstTdsRate: 2,
    gstTdsAmount: 29530,
    labourCessRate: 1,
    labourCessAmount: 14765,
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
  tenderPricingType?: 'Below' | 'Above' | 'At Par';
  actualTenderAmount?: number;
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
    description:
      'RCC pillar casting, floor beam slab reinforcement and concrete pouring',
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
export interface DLPDefectItem {
  id: string;
  defectCategory:
    | 'Crack'
    | 'Seepage'
    | 'Plumbing'
    | 'Electrical'
    | 'Flooring / Tile'
    | 'Structural'
    | 'Other';
  description: string;
  location: string;
  reportedDate: string;
  contractorNotifiedDate: string;
  rectificationDeadline: string;
  rectifiedDate?: string;
  isRectified: boolean;
  verifiedByAE: boolean;
  aeVerificationDate?: string;
  aeRemarks?: string;
}

export interface DLPRecord {
  id: string;
  workId: string;
  workName: string;
  contractorName?: string;
  completionDate: string;
  dlpStartDate: string;
  dlpEndDate: string; // typically 12 months
  retentionAmount: number;
  retentionReleased: boolean;
  retentionReleaseDate?: string;
  releaseOrderNo?: string;
  releaseRemarks?: string;
  defectsReported: number;
  defectsRectified: number;
  defects?: DLPDefectItem[];
  status:
    | 'Active'
    | 'Defects Reported'
    | 'Rectification In Progress'
    | 'Retention Released'
    | 'Closed';
  remarks?: string;
}

export const dlpRecords: DLPRecord[] = [
  {
    id: '1',
    workId: '5',
    workName: 'Central Library Extension – G+2',
    contractorName: 'Sharma Constructions Pvt Ltd',
    completionDate: '2025-11-30',
    dlpStartDate: '2025-12-01',
    dlpEndDate: '2026-11-30',
    retentionAmount: 575000,
    retentionReleased: false,
    defectsReported: 3,
    defectsRectified: 2,
    status: 'Defects Reported',
    remarks:
      'Terrace rainwater joint seepage reported. Contractor notified on 2026-02-10.',
    defects: [
      {
        id: 'DF-01',
        defectCategory: 'Seepage',
        description:
          'Terrace rainwater pipe outlet joint water seepage into 2nd floor reading hall',
        location: 'Reading Hall 2B ceiling',
        reportedDate: '2026-01-15',
        contractorNotifiedDate: '2026-01-18',
        rectificationDeadline: '2026-02-05',
        rectifiedDate: '2026-02-02',
        isRectified: true,
        verifiedByAE: true,
        aeVerificationDate: '2026-02-04',
        aeRemarks:
          'Elastomeric waterproofing coating re-applied and ponding test passed.',
      },
      {
        id: 'DF-02',
        defectCategory: 'Electrical',
        description: 'LED panel flickering and driver failure in Stack Area 3',
        location: 'Ground Floor Stack Room',
        reportedDate: '2026-02-10',
        contractorNotifiedDate: '2026-02-12',
        rectificationDeadline: '2026-02-25',
        rectifiedDate: '2026-02-20',
        isRectified: true,
        verifiedByAE: true,
        aeVerificationDate: '2026-02-22',
        aeRemarks:
          'Drivers replaced under warranty by electrical subcontractor.',
      },
      {
        id: 'DF-03',
        defectCategory: 'Flooring / Tile',
        description: 'Hollow sounding vitrified tiles near main entrance foyer',
        location: 'Entrance Foyer Grid C-4',
        reportedDate: '2026-03-01',
        contractorNotifiedDate: '2026-03-03',
        rectificationDeadline: '2026-03-25',
        isRectified: false,
        verifiedByAE: false,
      },
    ],
  },
  {
    id: '2',
    workId: '7',
    workName: 'Emergency Plumbing Repair – Admin Block',
    contractorName: 'Apex Buildcon Engineers',
    completionDate: '2024-12-22',
    dlpStartDate: '2024-12-23',
    dlpEndDate: '2025-12-22',
    retentionAmount: 23500,
    retentionReleased: false,
    defectsReported: 0,
    defectsRectified: 0,
    status: 'Active',
    remarks:
      'DLP expired with zero reported defects. Eligible for retention release.',
    defects: [],
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
  // Contract Agreement details (Task 4.2)
  agreementNo?: string;
  agreementDate?: string;
  stampDutyAmount?: number;
  stampDutyReceiptNo?: string;
  registrationStatus?: 'Registered' | 'Notary Stamped' | 'Pending';
  scannedAgreementDoc?: string;
  bgNo?: string;
  bgBank?: string;
  bgAmount?: number;
  bgExpiryDate?: string;
  mobAdvanceBgNo?: string;
  mobAdvanceBgBank?: string;
  mobAdvanceBgAmount?: number;
  mobAdvanceBgExpiry?: string;
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
    agreementNo: 'AGR/CW/2024-25/001',
    agreementDate: '2024-10-25',
    stampDutyAmount: 129250,
    stampDutyReceiptNo: 'STAMP/MP/2024/88921',
    registrationStatus: 'Registered',
    scannedAgreementDoc: 'Agreement_CW_2024_001_Signed.pdf',
    bgNo: 'BG-SBI-2024-99120',
    bgBank: 'State Bank of India, TT Nagar Branch',
    bgAmount: 1292500,
    bgExpiryDate: '2026-10-31',
    mobAdvanceBgNo: 'BG-MOB-SBI-2024-441',
    mobAdvanceBgBank: 'State Bank of India',
    mobAdvanceBgAmount: 2585000,
    mobAdvanceBgExpiry: '2025-11-01',
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
    agreementNo: 'AGR/CW/2025-26/002',
    agreementDate: '2025-01-14',
    stampDutyAmount: 86000,
    stampDutyReceiptNo: 'STAMP/MP/2025/11029',
    registrationStatus: 'Registered',
    scannedAgreementDoc: 'Agreement_CW_2025_002_Signed.pdf',
    bgNo: 'BG-PNB-2025-3341',
    bgBank: 'Punjab National Bank, MP Nagar',
    bgAmount: 860000,
    bgExpiryDate: '2026-11-30',
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
    agreementNo: 'AGR/CW/2025-26/003',
    agreementDate: '2025-02-28',
    stampDutyAmount: 15000,
    stampDutyReceiptNo: 'STAMP/MP/2025/44910',
    registrationStatus: 'Notary Stamped',
    scannedAgreementDoc: 'Agreement_Road_2025.pdf',
    bgNo: 'BG-BOI-2025-8812',
    bgBank: 'Bank of India, Arera Colony',
    bgAmount: 147500,
    bgExpiryDate: '2026-03-31',
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

// ─── Masters Data Collections ───────────────────────────────────────────────

export const initialCivilProjects: CivilManagement.CivilProject[] = [
  {
    id: 'PROJ-01',
    name: 'Main Campus Academic Complex Expansion',
    description:
      'Construction of multidisciplinary academic blocks, advanced research labs, and seminar halls',
    campus: 'Main Campus',
    location: 'North Sector – Academic Zone',
    isActive: true,
  },
  {
    id: 'PROJ-02',
    name: 'Student Residential Infrastructure Phase II',
    description:
      'Modern 200-bed student hostels with integrated mess and recreation facilities',
    campus: 'Main Campus',
    location: 'South Sector – Hostel Zone',
    isActive: true,
  },
  {
    id: 'PROJ-03',
    name: 'Campus Green Infrastructure & Solar Transition',
    description:
      'Rooftop solar installations, campus stormwater harvesting, and eco-paving',
    campus: 'City Campus',
    location: 'Zone B – Energy Center',
    isActive: true,
  },
  {
    id: 'PROJ-04',
    name: 'University Sports Complex & Stadium',
    description:
      'Multi-purpose indoor sports complex, athletic track, and pavilion',
    campus: 'Main Campus',
    location: 'East Sector – Sports Ground',
    isActive: true,
  },
];

export const initialSORTypes: CivilManagement.SORType[] = [
  {
    id: 'ST-01',
    code: 'SOR-BLD',
    name: 'Building & Civil Works',
    isActive: true,
  },
  {
    id: 'ST-02',
    code: 'SOR-ROD',
    name: 'Roads, Pavements & Bridges',
    isActive: true,
  },
  {
    id: 'ST-03',
    code: 'SOR-ELE',
    name: 'Internal & External Electrical Works',
    isActive: true,
  },
  {
    id: 'ST-04',
    code: 'SOR-PHE',
    name: 'Public Health Engineering & Plumbing',
    isActive: true,
  },
];

export const initialSORChapters: CivilManagement.SORChapter[] = [
  {
    id: 'SCH-01',
    sorTypeId: 'ST-01',
    sorTypeName: 'Building & Civil Works',
    chapterNo: '01',
    name: 'Earth Work, Site Clearance & Excavation',
    isActive: true,
  },
  {
    id: 'SCH-02',
    sorTypeId: 'ST-01',
    sorTypeName: 'Building & Civil Works',
    chapterNo: '02',
    name: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    isActive: true,
  },
  {
    id: 'SCH-03',
    sorTypeId: 'ST-01',
    sorTypeName: 'Building & Civil Works',
    chapterNo: '03',
    name: 'Brick Masonry, AAC Blocks & Stone Work',
    isActive: true,
  },
  {
    id: 'SCH-04',
    sorTypeId: 'ST-01',
    sorTypeName: 'Building & Civil Works',
    chapterNo: '04',
    name: 'Structural Steel Framing & Metal Fabrications',
    isActive: true,
  },
  {
    id: 'SCH-05',
    sorTypeId: 'ST-01',
    sorTypeName: 'Building & Civil Works',
    chapterNo: '05',
    name: 'Finishing Works, Plastering, Painting & Waterproofing',
    isActive: true,
  },
  {
    id: 'SCH-06',
    sorTypeId: 'ST-02',
    sorTypeName: 'Roads, Pavements & Bridges',
    chapterNo: '01',
    name: 'Subgrade Preparation & Wet Mix Macadam (WMM)',
    isActive: true,
  },
  {
    id: 'SCH-07',
    sorTypeId: 'ST-02',
    sorTypeName: 'Roads, Pavements & Bridges',
    chapterNo: '02',
    name: 'Bituminous Concrete & Asphalt Paving',
    isActive: true,
  },
];

export const initialSORSubjects: CivilManagement.SORSubject[] = [
  {
    id: 'SSU-01',
    sorChapterId: 'SCH-01',
    sorChapterName: 'Earth Work, Site Clearance & Excavation',
    sorTypeId: 'ST-01',
    name: 'Excavation in ordinary soil up to 1.5m depth',
    isActive: true,
  },
  {
    id: 'SSU-02',
    sorChapterId: 'SCH-02',
    sorChapterName: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    sorTypeId: 'ST-01',
    name: 'M25 Grade RCC in Columns, Beams & Slabs',
    isActive: true,
  },
  {
    id: 'SSU-03',
    sorChapterId: 'SCH-02',
    sorChapterName: 'Plain & Reinforced Cement Concrete (PCC/RCC)',
    sorTypeId: 'ST-01',
    name: 'M20 Grade Plain Cement Concrete in Foundation',
    isActive: true,
  },
  {
    id: 'SSU-04',
    sorChapterId: 'SCH-03',
    sorChapterName: 'Brick Masonry, AAC Blocks & Stone Work',
    sorTypeId: 'ST-01',
    name: 'Fly Ash Brickwork in 1:6 cement mortar',
    isActive: true,
  },
  {
    id: 'SSU-05',
    sorChapterId: 'SCH-05',
    sorChapterName: 'Finishing Works, Plastering, Painting & Waterproofing',
    sorTypeId: 'ST-01',
    name: '15mm Cement Plaster in 1:4 mix with neat finish',
    isActive: true,
  },
];

export const initialWorkCategories: CivilManagement.WorkCategoryMaster[] = [
  {
    id: 'WC-01',
    code: 'NCC',
    name: 'New Capital Construction',
    description:
      'Original construction of new buildings and major infrastructure',
    isActive: true,
  },
  {
    id: 'WC-02',
    code: 'MNT',
    name: 'Maintenance/Overhaul',
    description:
      'Periodic repairs, renovation, and overhaul of existing buildings',
    isActive: true,
  },
  {
    id: 'WC-03',
    code: 'REN',
    name: 'Renewal',
    description: 'Replacement and upgrade of degraded building components',
    isActive: true,
  },
  {
    id: 'WC-04',
    code: 'STR',
    name: 'Strengthening',
    description:
      'Structural retrofitting, seismic strengthening, and load capacity enhancement',
    isActive: true,
  },
  {
    id: 'WC-05',
    code: 'DEP',
    name: 'Deposit Work',
    description:
      'Works executed through external government agencies like PWD/PIU',
    isActive: true,
  },
  {
    id: 'WC-06',
    code: 'EMG',
    name: 'Emergency Work',
    description:
      'Immediate safety, monsoon damage or disaster restoration work',
    isActive: true,
  },
];

export const initialWorkDepartments: CivilManagement.WorkDepartmentMaster[] = [
  {
    id: 'WD-01',
    code: 'CIV',
    name: 'Civil Engineering Dept',
    parentCategoryId: 'WC-01',
    isActive: true,
  },
  {
    id: 'WD-02',
    code: 'EST',
    name: 'Estate & Campus Maintenance',
    parentCategoryId: 'WC-02',
    isActive: true,
  },
  {
    id: 'WD-03',
    code: 'STU',
    name: 'Student Welfare & Hostels',
    parentCategoryId: 'WC-01',
    isActive: true,
  },
  {
    id: 'WD-04',
    code: 'ELE',
    name: 'Electrical Engineering Wing',
    parentCategoryId: 'WC-02',
    isActive: true,
  },
  {
    id: 'WD-05',
    code: 'SPO',
    name: 'Sports Council & Facilities',
    parentCategoryId: 'WC-01',
    isActive: true,
  },
];

export const initialFundingSources: CivilManagement.FundingSourceMaster[] = [
  {
    id: 'FS-01',
    code: 'UGC',
    name: 'UGC Development Grant',
    sourceType: 'UGC',
    isActive: true,
  },
  {
    id: 'FS-02',
    code: 'SGC',
    name: 'State Govt Capital Grant',
    sourceType: 'State Govt',
    isActive: true,
  },
  {
    id: 'FS-03',
    code: 'IDF',
    name: 'Institute Development Fund (Internal)',
    sourceType: 'University',
    isActive: true,
  },
  {
    id: 'FS-04',
    code: 'RUSA',
    name: 'Rashtriya Uchchatar Shiksha Abhiyan (RUSA)',
    sourceType: 'Central Govt',
    isActive: true,
  },
  {
    id: 'FS-05',
    code: 'CSR',
    name: 'Industry CSR Infrastructure Contribution',
    sourceType: 'External',
    isActive: true,
  },
];

export const initialMandateDocuments: CivilManagement.MandateDocument[] = [
  {
    id: 'MD-01',
    name: 'Detailed Estimate & Preliminary Survey Report',
    description:
      'Detailed cost estimate with soil investigation and rate analysis',
    applicableCategories: [
      'WC-01',
      'WC-02',
      'WC-03',
      'WC-04',
      'WC-05',
      'WC-06',
    ],
    isMandatory: true,
    maxFileSizeMB: 10,
    allowedFormats: ['pdf'],
    isActive: true,
  },
  {
    id: 'MD-02',
    name: 'Land Title & Ownership Verification Certificate',
    description: 'Proof of unencumbered university land possession',
    applicableCategories: ['WC-01', 'WC-05'],
    isMandatory: true,
    maxFileSizeMB: 5,
    allowedFormats: ['pdf', 'jpg'],
    isActive: true,
  },
  {
    id: 'MD-03',
    name: 'Structural Design, Drawings & Stability Certificate',
    description:
      'Architectural and structural drawings signed by chartered engineer',
    applicableCategories: ['WC-01', 'WC-04'],
    isMandatory: true,
    maxFileSizeMB: 25,
    allowedFormats: ['pdf'],
    isActive: true,
  },
  {
    id: 'MD-04',
    name: 'Soil Investigation & Geotechnical Test Report',
    description: 'Bearing capacity test report from NABL accredited laboratory',
    applicableCategories: ['WC-01', 'WC-04'],
    isMandatory: true,
    maxFileSizeMB: 10,
    allowedFormats: ['pdf'],
    isActive: true,
  },
  {
    id: 'MD-05',
    name: 'Statutory Environmental & Fire NOC Clearance',
    description:
      'NOC from State Pollution Control Board and State Fire Department',
    applicableCategories: ['WC-01'],
    isMandatory: false,
    maxFileSizeMB: 5,
    allowedFormats: ['pdf'],
    isActive: true,
  },
  {
    id: 'MD-06',
    name: 'Scope of Work & Specification Document',
    description: 'Detailed technical specifications and execution timeline',
    applicableCategories: [
      'WC-01',
      'WC-02',
      'WC-03',
      'WC-04',
      'WC-05',
      'WC-06',
    ],
    isMandatory: true,
    maxFileSizeMB: 10,
    allowedFormats: ['pdf'],
    isActive: true,
  },
];

export const initialMBStatuses: CivilManagement.MBStatusMaster[] = [
  {
    id: 'MBS-01',
    code: 'REC',
    name: 'Draft Recorded by JE',
    description: 'Recorded in digital measurement book by Junior Engineer',
    sequence: 1,
    isActive: true,
  },
  {
    id: 'MBS-02',
    code: 'CHK',
    name: 'Test Checked by AE',
    description: 'Minimum 50% test check carried out by Assistant Engineer',
    sequence: 2,
    isActive: true,
  },
  {
    id: 'MBS-03',
    code: 'SCR',
    name: 'Scrutinized by EE',
    description:
      'Scrutinized and accepted by Executive Engineer (10% test check)',
    sequence: 3,
    isActive: true,
  },
  {
    id: 'MBS-04',
    code: 'BIL',
    name: 'Linked to Running Account (RA) Bill',
    description: 'Locked and attached to contractor RA Bill for payment',
    sequence: 4,
    isActive: true,
  },
  {
    id: 'MBS-05',
    code: 'FIN',
    name: 'Finalized & Closed',
    description: 'Measurement book closed after final bill settlement',
    sequence: 5,
    isActive: true,
  },
];

export const initialStatusMasters: CivilManagement.StatusMaster[] = [
  {
    id: 'SM-01',
    module: 'work',
    code: 'REQ',
    label: 'Requirement Generated',
    colorHex: '#6b7280',
    sequence: 1,
    isActive: true,
  },
  {
    id: 'SM-02',
    module: 'work',
    code: 'REG',
    label: 'Work Registered',
    colorHex: '#3b82f6',
    sequence: 2,
    isActive: true,
  },
  {
    id: 'SM-03',
    module: 'work',
    code: 'AA',
    label: 'Administrative Sanction Granted',
    colorHex: '#8b5cf6',
    sequence: 3,
    isActive: true,
  },
  {
    id: 'SM-04',
    module: 'work',
    code: 'TS',
    label: 'Technical Sanction Granted',
    colorHex: '#0ea5e9',
    sequence: 4,
    isActive: true,
  },
  {
    id: 'SM-05',
    module: 'work',
    code: 'BL',
    label: 'Budget Allocated & Locked',
    colorHex: '#f59e0b',
    sequence: 5,
    isActive: true,
  },
  {
    id: 'SM-06',
    module: 'work',
    code: 'TEN',
    label: 'Tender Issued',
    colorHex: '#ec4899',
    sequence: 6,
    isActive: true,
  },
  {
    id: 'SM-07',
    module: 'work',
    code: 'WO',
    label: 'Work Order Issued',
    colorHex: '#10b981',
    sequence: 7,
    isActive: true,
  },
  {
    id: 'SM-08',
    module: 'work',
    code: 'WIP',
    label: 'In Progress (Execution)',
    colorHex: '#14b8a6',
    sequence: 8,
    isActive: true,
  },
  {
    id: 'SM-09',
    module: 'work',
    code: 'CC',
    label: 'Completed & CC Issued',
    colorHex: '#22c55e',
    sequence: 9,
    isActive: true,
  },
  {
    id: 'SM-10',
    module: 'work',
    code: 'DLP',
    label: 'Defect Liability Period (DLP)',
    colorHex: '#f97316',
    sequence: 10,
    isActive: true,
  },
  {
    id: 'SM-11',
    module: 'work',
    code: 'CLS',
    label: 'Closed',
    colorHex: '#475569',
    sequence: 11,
    isActive: true,
  },
];

export const initialWorkSuspensions: CivilManagement.WorkSuspensionForeclosure[] =
  [
    {
      id: 'WS-01',
      workId: '4',
      workName: 'Examination Hall Structural Strengthening',
      workOrderId: '4',
      workOrderNo: 'WO/CW/2025-26/004',
      contractorName: 'Sharma Constructions Pvt Ltd',
      actionType: 'Suspension',
      clauseReference: 'Clause 15 (Suspension of Work)',
      orderNo: 'ORD/SUSP/2025/012',
      orderDate: '2025-08-10',
      effectiveDate: '2025-08-12',
      reason: 'Design Revision',
      reasonDescription:
        'Structural consultant proposed seismic retrofitting design changes following geotechnical soil re-test findings.',
      sitePreservationExpenses: 45000,
      orderedBy: 'Executive Engineer (Civil)',
      status: 'Active Suspension',
      remarks:
        'Contractor instructed to secure foundation excavation and ensure water dewatering.',
    },
    {
      id: 'WS-02',
      workId: '5',
      workName: 'Staff Quarters Type IV (Block A & B)',
      workOrderId: '5',
      workOrderNo: 'WO/CW/2024-25/005',
      contractorName: 'Apex Buildcon Engineers',
      actionType: 'Foreclosure',
      clauseReference: 'Clause 13 (Foreclosure of Contract due to Abandonment)',
      orderNo: 'ORD/FORECLOSE/2025/003',
      orderDate: '2025-05-18',
      effectiveDate: '2025-05-20',
      reason: 'Fund Crunch',
      reasonDescription:
        'State Government grant funding withdrawn due to revised departmental master planning. Work foreclosed without penalty to contractor.',
      finalMeasurementDate: '2025-06-05',
      settlementAmount: 1850000,
      compensationPaid: 1850000,
      orderedBy: 'Superintending Engineer',
      status: 'Foreclosed',
      remarks:
        'Final bill prepared on actual measurements. Contractor agreed to amicable settlement under CPWD GCC Clause 13.',
    },
  ];
