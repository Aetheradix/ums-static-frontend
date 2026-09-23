/**
 * Single canonical seed + shape for Completion-Certificate (CC) requests.
 *
 * Both the vendor page (RequestCC) that CREATES requests and the admin page
 * (CompletionCertificate) that INSPECTS & certifies them read/write the same
 * `civil_cc_requests` key. Previously each page carried its own incompatible
 * seed (thin flat records vs. rich dossier records) and RequestCC defaulted to
 * `[]`, so whichever page mounted first decided the shape — and a flat
 * vendor-created record with no `snags`/`qualityChecks` arrays crashed the
 * admin grid (`r.snags.length`). Centralizing the seed + shape here keeps both
 * sides in lock-step (Gap #6).
 */

export interface SnagItem {
  id: string;
  description: string;
  location: string;
  severity: 'Critical' | 'Major' | 'Minor';
  rectified: boolean;
  verifiedByAE: boolean;
}

export interface InspectionMember {
  designation: string;
  name: string;
  department: string;
  signed: boolean;
}

export interface QualityCheckItem {
  testName: string;
  standard: string;
  result: 'Pass' | 'Fail' | 'Pending';
  certificateRef: string;
}

export interface CCRequestItem {
  id: string;
  workId: string;
  workNo: string;
  workName: string;
  status: 'Pending' | 'Joint Inspected' | 'Certificate Issued' | string;
  actualCompletionDate: string;
  certificateNo: string;
  issueDate: string;
  adminRemarks: string;
  dlpDurationMonths: number;
  userDepartment: string;
  estateOfficer: string;
  committeeMembers: InspectionMember[];
  snags: SnagItem[];
  qualityChecks: QualityCheckItem[];
  // Optional fields carried by vendor-created requests (RequestCC). The admin
  // dossier ignores them, but they let the vendor's "View Request" panel show
  // its own submission details.
  contractorName?: string;
  requestDate?: string;
  finalBillNo?: string;
  seRemarks?: string;
}

export const initialCCRequests: CCRequestItem[] = [
  {
    id: 'cc_1',
    workId: '1',
    workNo: 'CW-2025-001',
    workName: 'New Academic Block – Science Wing',
    status: 'Pending',
    actualCompletionDate: '2026-06-15',
    certificateNo: '',
    issueDate: '',
    adminRemarks: '',
    dlpDurationMonths: 12,
    userDepartment: 'Faculty of Science & Technology',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Amit Patel',
        department: 'Sub-Division 1',
        signed: true,
      },
      {
        designation: 'Structural Consultant',
        name: 'Dr. P. N. Rao',
        department: 'External Consultant',
        signed: true,
      },
      {
        designation: 'Project Architect',
        name: 'Ar. Sunita Mehta',
        department: 'Design Studio Bhopal',
        signed: true,
      },
      {
        designation: 'Third Party Inspector (TPI)',
        name: 'Er. Vikas Saxena',
        department: 'RITES Limited',
        signed: true,
      },
      {
        designation: 'User Department Representative',
        name: 'Prof. A. C. Joshi',
        department: 'Dean, Science Faculty',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-01',
        description:
          'Touchup painting required near 2nd floor staircase landing',
        location: 'Block A, 2nd Floor',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
      {
        id: 'SN-02',
        description: 'Window latch adjustment in Chemistry Lab 204',
        location: 'Lab 204',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
    ],
    qualityChecks: [
      {
        testName: '28-Day Concrete Cube Compressive Strength (M25/M30)',
        standard: 'IS 456 & IS 516',
        result: 'Pass',
        certificateRef: 'IITB/CIVIL/2026/C-881',
      },
      {
        testName: 'Structural Steel Tensile & Bend Test',
        standard: 'IS 1786 (Fe 500D)',
        result: 'Pass',
        certificateRef: 'MANIT/MTL/2025/S-102',
      },
      {
        testName: 'Roof Waterproofing Ponding Test (72 Hours)',
        standard: 'CPWD Spec 22.1',
        result: 'Pass',
        certificateRef: 'RITES/QA/2026/WP-09',
      },
      {
        testName: 'Plumbing & Drainage Hydraulic Pressure Test',
        standard: 'IS 2065',
        result: 'Pass',
        certificateRef: 'UWD/PLUMB/2026/04',
      },
    ],
  },
  {
    id: 'cc_2',
    workId: '2',
    workNo: 'CW-2025-002',
    workName: 'Boys Hostel Block D – 200 Beds',
    status: 'Certificate Issued',
    actualCompletionDate: '2026-05-10',
    certificateNo: 'COMP/CW/2026/024',
    issueDate: '2026-05-12',
    adminRemarks:
      'Inspected and certified by Chief Engineer. Handover deed executed with Chief Warden.',
    dlpDurationMonths: 24,
    userDepartment: 'Hostel Administration & Chief Warden Office',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Amit Patel',
        department: 'Sub-Division 1',
        signed: true,
      },
      {
        designation: 'Third Party Inspector (TPI)',
        name: 'Er. M. K. Gupta',
        department: 'SGS India Pvt Ltd',
        signed: true,
      },
      {
        designation: 'Chief Warden',
        name: 'Prof. R. S. Rathore',
        department: 'University Hostels',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-03',
        description: 'Mess kitchen exhaust duct sealing',
        location: 'Ground Floor Dining',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
    ],
    qualityChecks: [
      {
        testName: '28-Day Concrete Cube Test',
        standard: 'IS 456:2000',
        result: 'Pass',
        certificateRef: 'MANIT/2026/CC-99',
      },
      {
        testName: 'Sanitary Fixtures Leakage Check',
        standard: 'CPWD Spec',
        result: 'Pass',
        certificateRef: 'UWD/SAN/2026/12',
      },
    ],
  },
  {
    id: 'cc_3',
    workId: '3',
    workNo: 'CW-2025-003',
    workName: 'Internal Campus Road Resurfacing',
    status: 'Pending',
    actualCompletionDate: '2026-07-01',
    certificateNo: '',
    issueDate: '',
    adminRemarks: '',
    dlpDurationMonths: 12,
    userDepartment: 'Estate & Campus Maintenance Section',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Priya Sen',
        department: 'Sub-Division 2',
        signed: true,
      },
      {
        designation: 'TPI Inspector',
        name: 'Er. S. Nair',
        department: 'WAPCOS Ltd',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-04',
        description:
          'Road berm leveling and curb stone painting along Gate 3 stretch',
        location: 'Gate 3 Avenue',
        severity: 'Critical',
        rectified: false,
        verifiedByAE: false,
      },
    ],
    qualityChecks: [
      {
        testName: 'Bitumen Density & Core Cutter Test',
        standard: 'MoRTH Sec 500',
        result: 'Pass',
        certificateRef: 'PWD/LAB/2026/R-401',
      },
      {
        testName: 'Pavement Unevenness / Roughness Index (IRI)',
        standard: 'IRC:SP:16',
        result: 'Pass',
        certificateRef: 'WAPCOS/QA/2026/02',
      },
    ],
  },
];
