// ─── Types ───────────────────────────────────────────────────────────────────

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description: string;
  maxDays: number;
  carryForward: boolean;
  halfDayAllowed: boolean;
  attachmentMandatory: boolean;
  requiresApproval: boolean;
  applicableFor: 'All' | 'Employee' | 'Student';
  status: 'Active' | 'Inactive';
}

export interface LeavePolicy {
  id: string;
  policyName: string;
  department: string;
  employeeType: string;
  minService: string;
  maxLeave: number;
  carryForwardRule: string;
  sandwichRule: boolean;
  holidayRule: string;
  status: 'Active' | 'Inactive';
}

export interface ApprovalHierarchy {
  id: string;
  role: string;
  firstApprover: string;
  secondApprover: string;
  finalApprover: string;
}

export interface LeaveApplication {
  id: string;
  appNo: string;
  applicant: string;
  role: 'Teacher' | 'Student';
  department: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  appliedDate: string;
  currentApprover: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Forwarded';
  reason: string;
  remarks?: string;
  enrollmentNo?: string;
  course?: string;
  semester?: string;
  attendancePct?: number;
}

export interface AttendanceRecord {
  id: string;
  employee: string;
  department: string;
  punchIn: string;
  punchOut: string;
  workingHours: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Late' | 'Holiday';
  mappedLeave?: string;
}

export interface BiometricRecord {
  id: string;
  employee: string;
  department: string;
  date: string;
  punchIn: string;
  punchOut: string;
  workingHours: string;
  status: 'OK' | 'Missing Punch' | 'Late Entry' | 'Early Exit';
}

export interface LtcRecord {
  id: string;
  employee: string;
  department: string;
  journeyType: string;
  travelDate: string;
  destination: string;
  purpose: string;
  familyMembers: number;
  claimAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: string;
  leaveBalance: {
    casual: number;
    medical: number;
    earned: number;
    halfPay: number;
    maternity?: number;
  };
}

export interface Student {
  id: string;
  name: string;
  enrollmentNo: string;
  course: string;
  semester: string;
  department: string;
  attendancePct: number;
  leaveBalance: {
    casual: number;
    medical: number;
    special: number;
  };
}

// ─── Leave Types ──────────────────────────────────────────────────────────────

export const leaveTypes: LeaveType[] = [
  {
    id: '1',
    code: 'CL',
    name: 'Casual Leave',
    description: 'Short-term personal leave for casual purposes',
    maxDays: 12,
    carryForward: false,
    halfDayAllowed: true,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'All',
    status: 'Active',
  },
  {
    id: '2',
    code: 'ML',
    name: 'Medical Leave',
    description: 'Leave for medical treatment or illness',
    maxDays: 20,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: true,
    requiresApproval: true,
    applicableFor: 'All',
    status: 'Active',
  },
  {
    id: '3',
    code: 'EL',
    name: 'Earned Leave',
    description: 'Accrued leave based on service period',
    maxDays: 30,
    carryForward: true,
    halfDayAllowed: true,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '4',
    code: 'HPL',
    name: 'Half Pay Leave',
    description: 'Leave with half salary deduction',
    maxDays: 20,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: true,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '5',
    code: 'MatL',
    name: 'Maternity Leave',
    description: 'Leave for maternity purposes',
    maxDays: 180,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: true,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '6',
    code: 'PatL',
    name: 'Paternity Leave',
    description: 'Leave for paternity purposes',
    maxDays: 15,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '7',
    code: 'SCL',
    name: 'Study Leave',
    description: 'Leave for higher studies or research',
    maxDays: 365,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: true,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '8',
    code: 'SL',
    name: 'Special Leave',
    description: 'Special occasions leave',
    maxDays: 5,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'Student',
    status: 'Active',
  },
  {
    id: '9',
    code: 'VL',
    name: 'Vacation Leave',
    description: 'Planned vacation leave during semester break',
    maxDays: 10,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: false,
    requiresApproval: false,
    applicableFor: 'Student',
    status: 'Active',
  },
  {
    id: '10',
    code: 'OD',
    name: 'On Duty',
    description: 'Official duty outside campus',
    maxDays: 15,
    carryForward: false,
    halfDayAllowed: true,
    attachmentMandatory: true,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '11',
    code: 'COL',
    name: 'Compensatory Off Leave',
    description: 'Leave in lieu of extra working hours',
    maxDays: 6,
    carryForward: false,
    halfDayAllowed: true,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'Employee',
    status: 'Active',
  },
  {
    id: '12',
    code: 'LOP',
    name: 'Loss of Pay',
    description: 'Leave without salary',
    maxDays: 30,
    carryForward: false,
    halfDayAllowed: false,
    attachmentMandatory: false,
    requiresApproval: true,
    applicableFor: 'All',
    status: 'Inactive',
  },
];

// ─── Leave Policies ───────────────────────────────────────────────────────────

export const leavePolicies: LeavePolicy[] = [
  {
    id: '1',
    policyName: 'Faculty Leave Policy 2024',
    department: 'All Departments',
    employeeType: 'Faculty',
    minService: '6 months',
    maxLeave: 42,
    carryForwardRule: 'Up to 30 EL per year',
    sandwichRule: true,
    holidayRule: 'Holidays counted',
    status: 'Active',
  },
  {
    id: '2',
    policyName: 'Non-Teaching Staff Policy',
    department: 'Administration',
    employeeType: 'Non-Teaching',
    minService: '3 months',
    maxLeave: 35,
    carryForwardRule: 'Up to 15 EL per year',
    sandwichRule: true,
    holidayRule: 'Prefix/Suffix rule applies',
    status: 'Active',
  },
  {
    id: '3',
    policyName: 'Contract Staff Policy',
    department: 'All Departments',
    employeeType: 'Contract',
    minService: '1 month',
    maxLeave: 15,
    carryForwardRule: 'No carry forward',
    sandwichRule: false,
    holidayRule: 'Weekends counted',
    status: 'Active',
  },
  {
    id: '4',
    policyName: 'Student Leave Policy UG',
    department: 'All Departments',
    employeeType: 'UG Student',
    minService: 'N/A',
    maxLeave: 20,
    carryForwardRule: 'No carry forward',
    sandwichRule: false,
    holidayRule: 'Holidays excluded',
    status: 'Active',
  },
  {
    id: '5',
    policyName: 'Student Leave Policy PG',
    department: 'All Departments',
    employeeType: 'PG Student',
    minService: 'N/A',
    maxLeave: 25,
    carryForwardRule: 'No carry forward',
    sandwichRule: false,
    holidayRule: 'Holidays excluded',
    status: 'Active',
  },
  {
    id: '6',
    policyName: 'Research Scholar Policy',
    department: 'Research Division',
    employeeType: 'PhD Scholar',
    minService: '6 months',
    maxLeave: 30,
    carryForwardRule: 'Up to 10 days',
    sandwichRule: true,
    holidayRule: 'Weekends not counted',
    status: 'Active',
  },
];

// ─── Approval Hierarchy ───────────────────────────────────────────────────────

export const approvalHierarchies: ApprovalHierarchy[] = [
  {
    id: '1',
    role: 'Student',
    firstApprover: 'Class Teacher / Course Advisor',
    secondApprover: 'HOD',
    finalApprover: 'Dean / Registrar',
  },
  {
    id: '2',
    role: 'Assistant Professor',
    firstApprover: 'HOD',
    secondApprover: 'Dean',
    finalApprover: 'Registrar',
  },
  {
    id: '3',
    role: 'Associate Professor',
    firstApprover: 'HOD',
    secondApprover: 'Dean',
    finalApprover: 'Vice Chancellor',
  },
  {
    id: '4',
    role: 'Professor / HOD',
    firstApprover: 'Dean',
    secondApprover: 'Registrar',
    finalApprover: 'Vice Chancellor',
  },
  {
    id: '5',
    role: 'Administrative Staff',
    firstApprover: 'Section Head',
    secondApprover: 'Admin Officer',
    finalApprover: 'Registrar',
  },
  {
    id: '6',
    role: 'Lab Technician',
    firstApprover: 'HOD',
    secondApprover: 'Lab Supervisor',
    finalApprover: 'Registrar',
  },
];

// ─── Employees ────────────────────────────────────────────────────────────────

export const employees: Employee[] = [
  {
    id: 'E001',
    name: 'Dr. Rajesh Kumar',
    employeeId: 'FAC001',
    designation: 'Professor & HOD',
    department: 'Computer Science',
    email: 'rajesh.kumar@univ.edu',
    phone: '9876543210',
    joiningDate: '2010-07-01',
    leaveBalance: { casual: 8, medical: 14, earned: 22, halfPay: 20 },
  },
  {
    id: 'E002',
    name: 'Dr. Priya Sharma',
    employeeId: 'FAC002',
    designation: 'Associate Professor',
    department: 'Mathematics',
    email: 'priya.sharma@univ.edu',
    phone: '9876543211',
    joiningDate: '2013-08-01',
    leaveBalance: {
      casual: 10,
      medical: 18,
      earned: 25,
      halfPay: 20,
      maternity: 180,
    },
  },
  {
    id: 'E003',
    name: 'Prof. Anil Verma',
    employeeId: 'FAC003',
    designation: 'Assistant Professor',
    department: 'Physics',
    email: 'anil.verma@univ.edu',
    phone: '9876543212',
    joiningDate: '2016-01-15',
    leaveBalance: { casual: 12, medical: 20, earned: 18, halfPay: 20 },
  },
  {
    id: 'E004',
    name: 'Dr. Sunita Rao',
    employeeId: 'FAC004',
    designation: 'Associate Professor',
    department: 'Chemistry',
    email: 'sunita.rao@univ.edu',
    phone: '9876543213',
    joiningDate: '2014-06-01',
    leaveBalance: { casual: 6, medical: 10, earned: 28, halfPay: 20 },
  },
  {
    id: 'E005',
    name: 'Prof. Mohan Das',
    employeeId: 'FAC005',
    designation: 'Assistant Professor',
    department: 'Electronics',
    email: 'mohan.das@univ.edu',
    phone: '9876543214',
    joiningDate: '2018-07-01',
    leaveBalance: { casual: 12, medical: 20, earned: 12, halfPay: 20 },
  },
  {
    id: 'E006',
    name: 'Dr. Kavitha Nair',
    employeeId: 'FAC006',
    designation: 'Professor',
    department: 'MBA',
    email: 'kavitha.nair@univ.edu',
    phone: '9876543215',
    joiningDate: '2009-04-01',
    leaveBalance: { casual: 5, medical: 8, earned: 30, halfPay: 20 },
  },
  {
    id: 'E007',
    name: 'Prof. Suresh Pillai',
    employeeId: 'FAC007',
    designation: 'Assistant Professor',
    department: 'Civil Engineering',
    email: 'suresh.pillai@univ.edu',
    phone: '9876543216',
    joiningDate: '2019-01-01',
    leaveBalance: { casual: 12, medical: 20, earned: 8, halfPay: 20 },
  },
  {
    id: 'E008',
    name: 'Dr. Anitha Menon',
    employeeId: 'FAC008',
    designation: 'Associate Professor',
    department: 'Biotechnology',
    email: 'anitha.menon@univ.edu',
    phone: '9876543217',
    joiningDate: '2015-07-01',
    leaveBalance: { casual: 9, medical: 15, earned: 20, halfPay: 20 },
  },
  {
    id: 'E009',
    name: 'Prof. Ravi Shankar',
    employeeId: 'FAC009',
    designation: 'Assistant Professor',
    department: 'Mechanical Engineering',
    email: 'ravi.shankar@univ.edu',
    phone: '9876543218',
    joiningDate: '2020-08-01',
    leaveBalance: { casual: 12, medical: 20, earned: 5, halfPay: 20 },
  },
  {
    id: 'E010',
    name: 'Dr. Deepa Krishnan',
    employeeId: 'FAC010',
    designation: 'Associate Professor',
    department: 'English',
    email: 'deepa.krishnan@univ.edu',
    phone: '9876543219',
    joiningDate: '2012-01-01',
    leaveBalance: { casual: 7, medical: 12, earned: 26, halfPay: 20 },
  },
  {
    id: 'E011',
    name: 'Prof. Vijay Reddy',
    employeeId: 'FAC011',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: 'vijay.reddy@univ.edu',
    phone: '9876543220',
    joiningDate: '2017-07-01',
    leaveBalance: { casual: 11, medical: 18, earned: 15, halfPay: 20 },
  },
  {
    id: 'E012',
    name: 'Dr. Lakshmi Iyer',
    employeeId: 'FAC012',
    designation: 'Professor',
    department: 'Physics',
    email: 'lakshmi.iyer@univ.edu',
    phone: '9876543221',
    joiningDate: '2008-04-01',
    leaveBalance: { casual: 4, medical: 6, earned: 30, halfPay: 20 },
  },
  {
    id: 'E013',
    name: 'Ramesh Kumar',
    employeeId: 'ADM001',
    designation: 'Administrative Officer',
    department: 'Administration',
    email: 'ramesh.kumar@univ.edu',
    phone: '9876543222',
    joiningDate: '2011-05-01',
    leaveBalance: { casual: 10, medical: 16, earned: 24, halfPay: 20 },
  },
  {
    id: 'E014',
    name: 'Geeta Singh',
    employeeId: 'ADM002',
    designation: 'Accounts Manager',
    department: 'Finance',
    email: 'geeta.singh@univ.edu',
    phone: '9876543223',
    joiningDate: '2013-09-01',
    leaveBalance: { casual: 9, medical: 14, earned: 22, halfPay: 20 },
  },
  {
    id: 'E015',
    name: 'Harish Chand',
    employeeId: 'ADM003',
    designation: 'Library In-Charge',
    department: 'Library',
    email: 'harish.chand@univ.edu',
    phone: '9876543224',
    joiningDate: '2015-03-01',
    leaveBalance: { casual: 11, medical: 18, earned: 17, halfPay: 20 },
  },
];

// ─── Students ─────────────────────────────────────────────────────────────────

export const students: Student[] = [
  {
    id: 'S001',
    name: 'Arjun Sharma',
    enrollmentNo: 'CS2021001',
    course: 'B.Tech Computer Science',
    semester: '6th Sem',
    department: 'Computer Science',
    attendancePct: 87,
    leaveBalance: { casual: 8, medical: 5, special: 2 },
  },
  {
    id: 'S002',
    name: 'Priya Singh',
    enrollmentNo: 'CS2021002',
    course: 'B.Tech Computer Science',
    semester: '6th Sem',
    department: 'Computer Science',
    attendancePct: 92,
    leaveBalance: { casual: 10, medical: 8, special: 3 },
  },
  {
    id: 'S003',
    name: 'Rohit Kumar',
    enrollmentNo: 'ME2022001',
    course: 'B.Tech Mechanical',
    semester: '4th Sem',
    department: 'Mechanical Engineering',
    attendancePct: 73,
    leaveBalance: { casual: 4, medical: 2, special: 1 },
  },
  {
    id: 'S004',
    name: 'Anjali Verma',
    enrollmentNo: 'MBA2023001',
    course: 'MBA',
    semester: '2nd Sem',
    department: 'MBA',
    attendancePct: 95,
    leaveBalance: { casual: 10, medical: 10, special: 3 },
  },
  {
    id: 'S005',
    name: 'Suresh Patel',
    enrollmentNo: 'EC2021001',
    course: 'B.Tech Electronics',
    semester: '6th Sem',
    department: 'Electronics',
    attendancePct: 68,
    leaveBalance: { casual: 3, medical: 1, special: 0 },
  },
  {
    id: 'S006',
    name: 'Meena Nair',
    enrollmentNo: 'BT2022001',
    course: 'B.Sc Biotechnology',
    semester: '4th Sem',
    department: 'Biotechnology',
    attendancePct: 88,
    leaveBalance: { casual: 8, medical: 6, special: 2 },
  },
  {
    id: 'S007',
    name: 'Kiran Joshi',
    enrollmentNo: 'MCA2022001',
    course: 'MCA',
    semester: '4th Sem',
    department: 'Computer Science',
    attendancePct: 82,
    leaveBalance: { casual: 7, medical: 5, special: 2 },
  },
  {
    id: 'S008',
    name: 'Deepak Rao',
    enrollmentNo: 'CE2021001',
    course: 'B.Tech Civil',
    semester: '6th Sem',
    department: 'Civil Engineering',
    attendancePct: 79,
    leaveBalance: { casual: 6, medical: 4, special: 1 },
  },
  {
    id: 'S009',
    name: 'Lakshmi Devi',
    enrollmentNo: 'CH2022001',
    course: 'B.Sc Chemistry',
    semester: '4th Sem',
    department: 'Chemistry',
    attendancePct: 91,
    leaveBalance: { casual: 10, medical: 8, special: 3 },
  },
  {
    id: 'S010',
    name: 'Vivek Tiwari',
    enrollmentNo: 'PH2023001',
    course: 'B.Sc Physics',
    semester: '2nd Sem',
    department: 'Physics',
    attendancePct: 76,
    leaveBalance: { casual: 6, medical: 4, special: 1 },
  },
  {
    id: 'S011',
    name: 'Sonia Gupta',
    enrollmentNo: 'MA2021001',
    course: 'B.Sc Mathematics',
    semester: '6th Sem',
    department: 'Mathematics',
    attendancePct: 94,
    leaveBalance: { casual: 10, medical: 9, special: 3 },
  },
  {
    id: 'S012',
    name: 'Amit Mishra',
    enrollmentNo: 'CS2022001',
    course: 'B.Tech Computer Science',
    semester: '4th Sem',
    department: 'Computer Science',
    attendancePct: 83,
    leaveBalance: { casual: 8, medical: 6, special: 2 },
  },
  {
    id: 'S013',
    name: 'Rekha Pillai',
    enrollmentNo: 'EN2021001',
    course: 'B.A. English',
    semester: '6th Sem',
    department: 'English',
    attendancePct: 89,
    leaveBalance: { casual: 9, medical: 7, special: 2 },
  },
  {
    id: 'S014',
    name: 'Naveen Reddy',
    enrollmentNo: 'ME2023001',
    course: 'B.Tech Mechanical',
    semester: '2nd Sem',
    department: 'Mechanical Engineering',
    attendancePct: 71,
    leaveBalance: { casual: 5, medical: 3, special: 1 },
  },
  {
    id: 'S015',
    name: 'Pooja Menon',
    enrollmentNo: 'MBA2022001',
    course: 'MBA',
    semester: '4th Sem',
    department: 'MBA',
    attendancePct: 96,
    leaveBalance: { casual: 10, medical: 10, special: 3 },
  },
];

// ─── Leave Applications ────────────────────────────────────────────────────────

export const leaveApplications: LeaveApplication[] = [
  {
    id: 'A001',
    appNo: 'LMS-2024-0001',
    applicant: 'Arjun Sharma',
    role: 'Student',
    department: 'Computer Science',
    leaveType: 'Casual Leave',
    fromDate: '2024-06-10',
    toDate: '2024-06-12',
    days: 3,
    appliedDate: '2024-06-08',
    currentApprover: 'Prof. Vijay Reddy',
    status: 'Pending',
    reason: 'Family function at home',
    enrollmentNo: 'CS2021001',
    course: 'B.Tech Computer Science',
    semester: '6th Sem',
    attendancePct: 87,
  },
  {
    id: 'A002',
    appNo: 'LMS-2024-0002',
    applicant: 'Prof. Anil Verma',
    role: 'Teacher',
    department: 'Physics',
    leaveType: 'Medical Leave',
    fromDate: '2024-06-05',
    toDate: '2024-06-09',
    days: 5,
    appliedDate: '2024-06-04',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Approved',
    reason: 'Hospitalization for appendix surgery',
    remarks: 'Approved. Get well soon.',
  },
  {
    id: 'A003',
    appNo: 'LMS-2024-0003',
    applicant: 'Priya Singh',
    role: 'Student',
    department: 'Computer Science',
    leaveType: 'Medical Leave',
    fromDate: '2024-06-15',
    toDate: '2024-06-17',
    days: 3,
    appliedDate: '2024-06-14',
    currentApprover: 'Prof. Vijay Reddy',
    status: 'Approved',
    reason: 'Dengue fever treatment',
    enrollmentNo: 'CS2021002',
    course: 'B.Tech Computer Science',
    semester: '6th Sem',
    attendancePct: 92,
  },
  {
    id: 'A004',
    appNo: 'LMS-2024-0004',
    applicant: 'Prof. Vijay Reddy',
    role: 'Teacher',
    department: 'Computer Science',
    leaveType: 'Casual Leave',
    fromDate: '2024-06-20',
    toDate: '2024-06-21',
    days: 2,
    appliedDate: '2024-06-18',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Pending',
    reason: 'Personal work',
  },
  {
    id: 'A005',
    appNo: 'LMS-2024-0005',
    applicant: 'Rohit Kumar',
    role: 'Student',
    department: 'Mechanical Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2024-06-25',
    toDate: '2024-06-26',
    days: 2,
    appliedDate: '2024-06-22',
    currentApprover: 'Prof. Suresh Pillai',
    status: 'Rejected',
    reason: 'Cricket tournament',
    remarks: 'Attendance is already low (73%). Cannot approve.',
    enrollmentNo: 'ME2022001',
    course: 'B.Tech Mechanical',
    semester: '4th Sem',
    attendancePct: 73,
  },
  {
    id: 'A006',
    appNo: 'LMS-2024-0006',
    applicant: 'Dr. Priya Sharma',
    role: 'Teacher',
    department: 'Mathematics',
    leaveType: 'Maternity Leave',
    fromDate: '2024-07-01',
    toDate: '2024-12-31',
    days: 180,
    appliedDate: '2024-06-20',
    currentApprover: 'Registrar',
    status: 'Approved',
    reason: 'Maternity leave as per policy',
  },
  {
    id: 'A007',
    appNo: 'LMS-2024-0007',
    applicant: 'Suresh Patel',
    role: 'Student',
    department: 'Electronics',
    leaveType: 'Medical Leave',
    fromDate: '2024-06-18',
    toDate: '2024-06-22',
    days: 5,
    appliedDate: '2024-06-17',
    currentApprover: 'Prof. Mohan Das',
    status: 'Pending',
    reason: 'Typhoid fever',
    enrollmentNo: 'EC2021001',
    course: 'B.Tech Electronics',
    semester: '6th Sem',
    attendancePct: 68,
  },
  {
    id: 'A008',
    appNo: 'LMS-2024-0008',
    applicant: 'Prof. Mohan Das',
    role: 'Teacher',
    department: 'Electronics',
    leaveType: 'Earned Leave',
    fromDate: '2024-07-10',
    toDate: '2024-07-17',
    days: 8,
    appliedDate: '2024-07-01',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Forwarded',
    reason: 'Family trip during summer vacation',
  },
  {
    id: 'A009',
    appNo: 'LMS-2024-0009',
    applicant: 'Meena Nair',
    role: 'Student',
    department: 'Biotechnology',
    leaveType: 'Special Leave',
    fromDate: '2024-06-28',
    toDate: '2024-06-29',
    days: 2,
    appliedDate: '2024-06-26',
    currentApprover: 'Dr. Anitha Menon',
    status: 'Approved',
    reason: 'National level science competition',
    enrollmentNo: 'BT2022001',
    course: 'B.Sc Biotechnology',
    semester: '4th Sem',
    attendancePct: 88,
  },
  {
    id: 'A010',
    appNo: 'LMS-2024-0010',
    applicant: 'Dr. Kavitha Nair',
    role: 'Teacher',
    department: 'MBA',
    leaveType: 'On Duty',
    fromDate: '2024-07-05',
    toDate: '2024-07-07',
    days: 3,
    appliedDate: '2024-07-03',
    currentApprover: 'Registrar',
    status: 'Approved',
    reason: 'Conference at IIM Bangalore',
  },
  {
    id: 'A011',
    appNo: 'LMS-2024-0011',
    applicant: 'Kiran Joshi',
    role: 'Student',
    department: 'Computer Science',
    leaveType: 'Casual Leave',
    fromDate: '2024-07-08',
    toDate: '2024-07-09',
    days: 2,
    appliedDate: '2024-07-06',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Pending',
    reason: "Brother's wedding",
    enrollmentNo: 'MCA2022001',
    course: 'MCA',
    semester: '4th Sem',
    attendancePct: 82,
  },
  {
    id: 'A012',
    appNo: 'LMS-2024-0012',
    applicant: 'Prof. Suresh Pillai',
    role: 'Teacher',
    department: 'Civil Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2024-07-15',
    toDate: '2024-07-16',
    days: 2,
    appliedDate: '2024-07-12',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Approved',
    reason: 'Personal work',
  },
  {
    id: 'A013',
    appNo: 'LMS-2024-0013',
    applicant: 'Deepak Rao',
    role: 'Student',
    department: 'Civil Engineering',
    leaveType: 'Medical Leave',
    fromDate: '2024-07-20',
    toDate: '2024-07-24',
    days: 5,
    appliedDate: '2024-07-18',
    currentApprover: 'Prof. Suresh Pillai',
    status: 'Approved',
    reason: 'Road accident injuries',
    enrollmentNo: 'CE2021001',
    course: 'B.Tech Civil',
    semester: '6th Sem',
    attendancePct: 79,
  },
  {
    id: 'A014',
    appNo: 'LMS-2024-0014',
    applicant: 'Dr. Sunita Rao',
    role: 'Teacher',
    department: 'Chemistry',
    leaveType: 'Earned Leave',
    fromDate: '2024-08-01',
    toDate: '2024-08-07',
    days: 7,
    appliedDate: '2024-07-25',
    currentApprover: 'Dean',
    status: 'Pending',
    reason: 'Visiting family in Hyderabad',
  },
  {
    id: 'A015',
    appNo: 'LMS-2024-0015',
    applicant: 'Lakshmi Devi',
    role: 'Student',
    department: 'Chemistry',
    leaveType: 'Casual Leave',
    fromDate: '2024-08-05',
    toDate: '2024-08-06',
    days: 2,
    appliedDate: '2024-08-03',
    currentApprover: 'Dr. Sunita Rao',
    status: 'Pending',
    reason: 'Cultural festival participation',
    enrollmentNo: 'CH2022001',
    course: 'B.Sc Chemistry',
    semester: '4th Sem',
    attendancePct: 91,
  },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

export const todayAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employee: 'Dr. Rajesh Kumar',
    department: 'Computer Science',
    punchIn: '08:52',
    punchOut: '17:10',
    workingHours: '8h 18m',
    status: 'Present',
  },
  {
    id: '2',
    employee: 'Dr. Priya Sharma',
    department: 'Mathematics',
    punchIn: '--',
    punchOut: '--',
    workingHours: '--',
    status: 'Leave',
    mappedLeave: 'Maternity Leave',
  },
  {
    id: '3',
    employee: 'Prof. Anil Verma',
    department: 'Physics',
    punchIn: '09:15',
    punchOut: '17:00',
    workingHours: '7h 45m',
    status: 'Present',
  },
  {
    id: '4',
    employee: 'Dr. Sunita Rao',
    department: 'Chemistry',
    punchIn: '--',
    punchOut: '--',
    workingHours: '--',
    status: 'Absent',
  },
  {
    id: '5',
    employee: 'Prof. Mohan Das',
    department: 'Electronics',
    punchIn: '09:45',
    punchOut: '16:30',
    workingHours: '6h 45m',
    status: 'Late',
  },
  {
    id: '6',
    employee: 'Dr. Kavitha Nair',
    department: 'MBA',
    punchIn: '08:30',
    punchOut: '17:30',
    workingHours: '9h 00m',
    status: 'Present',
  },
  {
    id: '7',
    employee: 'Prof. Suresh Pillai',
    department: 'Civil Engineering',
    punchIn: '09:00',
    punchOut: '17:15',
    workingHours: '8h 15m',
    status: 'Present',
  },
  {
    id: '8',
    employee: 'Dr. Anitha Menon',
    department: 'Biotechnology',
    punchIn: '--',
    punchOut: '--',
    workingHours: '--',
    status: 'Leave',
    mappedLeave: 'Earned Leave',
  },
  {
    id: '9',
    employee: 'Prof. Ravi Shankar',
    department: 'Mechanical Engineering',
    punchIn: '08:55',
    punchOut: '17:05',
    workingHours: '8h 10m',
    status: 'Present',
  },
  {
    id: '10',
    employee: 'Dr. Deepa Krishnan',
    department: 'English',
    punchIn: '10:20',
    punchOut: '16:45',
    workingHours: '6h 25m',
    status: 'Late',
  },
  {
    id: '11',
    employee: 'Prof. Vijay Reddy',
    department: 'Computer Science',
    punchIn: '09:00',
    punchOut: '--',
    workingHours: 'Pending',
    status: 'Present',
  },
  {
    id: '12',
    employee: 'Dr. Lakshmi Iyer',
    department: 'Physics',
    punchIn: '08:45',
    punchOut: '17:20',
    workingHours: '8h 35m',
    status: 'Present',
  },
  {
    id: '13',
    employee: 'Ramesh Kumar',
    department: 'Administration',
    punchIn: '09:00',
    punchOut: '17:00',
    workingHours: '8h 00m',
    status: 'Present',
  },
  {
    id: '14',
    employee: 'Geeta Singh',
    department: 'Finance',
    punchIn: '--',
    punchOut: '--',
    workingHours: '--',
    status: 'Absent',
  },
  {
    id: '15',
    employee: 'Harish Chand',
    department: 'Library',
    punchIn: '08:50',
    punchOut: '17:10',
    workingHours: '8h 20m',
    status: 'Present',
  },
];

// ─── Biometric Records ────────────────────────────────────────────────────────

export const biometricRecords: BiometricRecord[] = [
  {
    id: '1',
    employee: 'Dr. Rajesh Kumar',
    department: 'Computer Science',
    date: '2024-06-26',
    punchIn: '08:52',
    punchOut: '17:10',
    workingHours: '8h 18m',
    status: 'OK',
  },
  {
    id: '2',
    employee: 'Prof. Anil Verma',
    department: 'Physics',
    date: '2024-06-26',
    punchIn: '09:15',
    punchOut: '17:00',
    workingHours: '7h 45m',
    status: 'OK',
  },
  {
    id: '3',
    employee: 'Prof. Mohan Das',
    department: 'Electronics',
    date: '2024-06-26',
    punchIn: '09:45',
    punchOut: '--',
    workingHours: '--',
    status: 'Missing Punch',
  },
  {
    id: '4',
    employee: 'Dr. Kavitha Nair',
    department: 'MBA',
    date: '2024-06-26',
    punchIn: '08:30',
    punchOut: '17:30',
    workingHours: '9h 00m',
    status: 'OK',
  },
  {
    id: '5',
    employee: 'Prof. Suresh Pillai',
    department: 'Civil Engineering',
    date: '2024-06-26',
    punchIn: '09:00',
    punchOut: '17:15',
    workingHours: '8h 15m',
    status: 'OK',
  },
  {
    id: '6',
    employee: 'Prof. Ravi Shankar',
    department: 'Mechanical Engineering',
    date: '2024-06-26',
    punchIn: '08:55',
    punchOut: '17:05',
    workingHours: '8h 10m',
    status: 'OK',
  },
  {
    id: '7',
    employee: 'Dr. Deepa Krishnan',
    department: 'English',
    date: '2024-06-26',
    punchIn: '10:20',
    punchOut: '16:45',
    workingHours: '6h 25m',
    status: 'Late Entry',
  },
  {
    id: '8',
    employee: 'Prof. Vijay Reddy',
    department: 'Computer Science',
    date: '2024-06-26',
    punchIn: '09:00',
    punchOut: '--',
    workingHours: '--',
    status: 'Missing Punch',
  },
  {
    id: '9',
    employee: 'Dr. Lakshmi Iyer',
    department: 'Physics',
    date: '2024-06-26',
    punchIn: '08:45',
    punchOut: '17:20',
    workingHours: '8h 35m',
    status: 'OK',
  },
  {
    id: '10',
    employee: 'Ramesh Kumar',
    department: 'Administration',
    date: '2024-06-26',
    punchIn: '09:00',
    punchOut: '17:00',
    workingHours: '8h 00m',
    status: 'OK',
  },
];

// ─── LTC Records ──────────────────────────────────────────────────────────────

export const ltcRecords: LtcRecord[] = [
  {
    id: '1',
    employee: 'Dr. Rajesh Kumar',
    department: 'Computer Science',
    journeyType: 'Domestic',
    travelDate: '2024-05-15',
    destination: 'Mumbai → Delhi',
    purpose: 'Conference',
    familyMembers: 3,
    claimAmount: 45000,
    status: 'Approved',
    approver: 'Registrar',
  },
  {
    id: '2',
    employee: 'Prof. Anil Verma',
    department: 'Physics',
    journeyType: 'Domestic',
    travelDate: '2024-04-10',
    destination: 'Bangalore → Chennai',
    purpose: 'Research Visit',
    familyMembers: 0,
    claimAmount: 12000,
    status: 'Pending',
    approver: 'Dean',
  },
  {
    id: '3',
    employee: 'Dr. Kavitha Nair',
    department: 'MBA',
    journeyType: 'Domestic',
    travelDate: '2024-03-20',
    destination: 'Delhi → Jaipur',
    purpose: 'Educational Tour',
    familyMembers: 2,
    claimAmount: 28000,
    status: 'Approved',
    approver: 'Registrar',
  },
  {
    id: '4',
    employee: 'Dr. Sunita Rao',
    department: 'Chemistry',
    journeyType: 'International',
    travelDate: '2024-02-14',
    destination: 'India → Singapore',
    purpose: 'International Conference',
    familyMembers: 0,
    claimAmount: 125000,
    status: 'Rejected',
    approver: 'Vice Chancellor',
  },
  {
    id: '5',
    employee: 'Prof. Suresh Pillai',
    department: 'Civil Engineering',
    journeyType: 'Domestic',
    travelDate: '2024-06-01',
    destination: 'Hyderabad → Mysore',
    purpose: 'Site Visit',
    familyMembers: 1,
    claimAmount: 18000,
    status: 'Pending',
    approver: 'Dean',
  },
  {
    id: '6',
    employee: 'Dr. Anitha Menon',
    department: 'Biotechnology',
    journeyType: 'Domestic',
    travelDate: '2024-01-25',
    destination: 'Pune → Goa',
    purpose: 'Workshop',
    familyMembers: 4,
    claimAmount: 35000,
    status: 'Approved',
    approver: 'Registrar',
  },
];

// ─── Departments ──────────────────────────────────────────────────────────────

export const departments = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electronics',
  'MBA',
  'Civil Engineering',
  'Biotechnology',
  'Mechanical Engineering',
  'English',
  'Library',
  'Administration',
  'Finance',
  'Research Division',
  'Physical Education',
  'Fine Arts',
];

// ─── Courses ──────────────────────────────────────────────────────────────────

export const courses = [
  'B.Tech Computer Science',
  'B.Tech Mechanical',
  'B.Tech Electronics',
  'B.Tech Civil Engineering',
  'B.Sc Physics',
  'B.Sc Chemistry',
  'B.Sc Biotechnology',
  'B.Sc Mathematics',
  'B.A. English',
  'MBA',
  'MCA',
  'M.Tech AI & ML',
  'M.Sc Physics',
  'M.Sc Chemistry',
  'Ph.D Computer Science',
  'Ph.D Physics',
  'BCA',
  'B.Com',
  'M.Com',
  'B.Arch',
];

// ─── Monthly Leave Trend (for charts) ────────────────────────────────────────

export const monthlyLeaveTrend = [
  { month: 'Jan', employee: 28, student: 45 },
  { month: 'Feb', employee: 22, student: 38 },
  { month: 'Mar', employee: 35, student: 62 },
  { month: 'Apr', employee: 30, student: 55 },
  { month: 'May', employee: 18, student: 30 },
  { month: 'Jun', employee: 25, student: 48 },
  { month: 'Jul', employee: 40, student: 70 },
  { month: 'Aug', employee: 32, student: 58 },
  { month: 'Sep', employee: 20, student: 35 },
  { month: 'Oct', employee: 15, student: 28 },
  { month: 'Nov', employee: 12, student: 22 },
  { month: 'Dec', employee: 38, student: 65 },
];

export const departmentWiseLeave = [
  { dept: 'CS', count: 42, color: '#3b82f6' },
  { dept: 'Mech', count: 38, color: '#8b5cf6' },
  { dept: 'Physics', count: 25, color: '#f59e0b' },
  { dept: 'MBA', count: 20, color: '#10b981' },
  { dept: 'Chemistry', count: 18, color: '#ef4444' },
  { dept: 'Electronics', count: 30, color: '#06b6d4' },
  { dept: 'Civil', count: 22, color: '#84cc16' },
  { dept: 'BioTech', count: 15, color: '#f97316' },
];

export const leaveTypeDistribution = [
  { type: 'Casual Leave', count: 156, color: '#3b82f6', pct: 38 },
  { type: 'Medical Leave', count: 98, color: '#ef4444', pct: 24 },
  { type: 'Earned Leave', count: 72, color: '#10b981', pct: 18 },
  { type: 'On Duty', count: 45, color: '#f59e0b', pct: 11 },
  { type: 'Others', count: 37, color: '#8b5cf6', pct: 9 },
];

// ─── Academic Calendar ────────────────────────────────────────────────────────

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  type: 'working' | 'holiday' | 'vacation' | 'exam';
  label?: string;
}

export const academicCalendarDays: CalendarDay[] = [
  { date: '2024-06-01', type: 'holiday', label: 'Saturday' },
  { date: '2024-06-02', type: 'holiday', label: 'Sunday' },
  { date: '2024-06-05', type: 'holiday', label: 'Environment Day' },
  { date: '2024-06-08', type: 'holiday', label: 'Saturday' },
  { date: '2024-06-09', type: 'holiday', label: 'Sunday' },
  { date: '2024-06-15', type: 'holiday', label: 'Saturday' },
  { date: '2024-06-16', type: 'holiday', label: 'Sunday' },
  { date: '2024-06-22', type: 'holiday', label: 'Saturday' },
  { date: '2024-06-23', type: 'holiday', label: 'Sunday' },
  { date: '2024-06-28', type: 'exam', label: 'Internal Exam' },
  { date: '2024-06-29', type: 'holiday', label: 'Saturday' },
  { date: '2024-06-30', type: 'holiday', label: 'Sunday' },
];
