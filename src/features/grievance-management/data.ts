// Seed mock data for Grievance Management System

export interface GrievanceCategory {
  id: string;
  name: string;
  type: 'Student' | 'Employee' | 'Public';
  status: 'Active' | 'Inactive';
  visible: 'Yes' | 'No';
}

export interface CommitteeMemberDetail {
  name: string;
  department: string;
  designation: string;
  email: string;
  mobile: string;
}

export interface GrievanceCommittee {
  id: string;
  name: string;
  shortName: string;
  status: 'Active' | 'Inactive' | 'Dissolved';
  chairman: string[];
  instituteMembers: string[];
  exOfficio: string[];
  scStRep: string[];
  memberSecretary: string[];
  nonInstitute: CommitteeMemberDetail[];
  effectiveDate: string;
  approvedOn: string;
  approvedTill: string;
  document?: string;
}

export interface CategoryUserMapping {
  id: string;
  category: string;
  userId: string;
  status: 'Active' | 'Inactive';
}

export interface GrievanceUserMapping {
  id: string;
  grievanceId: string;
  userId: string;
  status: 'Active' | 'Inactive';
}

export interface GrievanceNote {
  id: string;
  meetingId: string;
  notes: string;
  visibleToAll: 'Yes' | 'No';
  author: string;
  response?: string;
  responseStatus: 'New' | 'Read' | 'Accepted' | 'Rejected';
}

export interface Grievance {
  id: string;
  memberType: 'Student' | 'Employee' | 'Public';
  member: string; // Name or Complainant ID
  email: string;
  contactNo?: string;
  address?: string; // For Public
  category: string; // Category Name
  level: 'Routine' | 'Mild' | 'Severe';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  proposedSolution: string;
  wantUpload: 'Yes' | 'No';
  document?: string;
  declaration: boolean;
  status: 'Reported' | 'Pending' | 'Resolved' | 'Cancelled';
  reportedDate: string;
  resolution?: string;
  resolutionDate?: string;
  notes: GrievanceNote[];
}

export interface MeetingGuest {
  name: string;
  email: string;
  mobile: string;
}

export interface GrievanceMeeting {
  id: string;
  grievanceId: string;
  meetingType: string;
  agenda: string;
  meetingTime: string;
  venue: string;
  guests: MeetingGuest[];
  status: 'Scheduled' | 'Conducted' | 'Cancelled';
  cancellationReason?: string;
  minutes?: string;
  minutesDoc?: string;
}

// Initial Data Sets
export const INITIAL_CATEGORIES: GrievanceCategory[] = [
  {
    id: 'CAT-001',
    name: 'Academic & Examination Issues',
    type: 'Student',
    status: 'Active',
    visible: 'Yes',
  },
  {
    id: 'CAT-002',
    name: 'Hostel & Mess Amenities',
    type: 'Student',
    status: 'Active',
    visible: 'Yes',
  },
  {
    id: 'CAT-003',
    name: 'Salary & PF Discrepancies',
    type: 'Employee',
    status: 'Active',
    visible: 'Yes',
  },
  {
    id: 'CAT-004',
    name: 'Harassment & Safety Concerns',
    type: 'Employee',
    status: 'Active',
    visible: 'Yes',
  },
  {
    id: 'CAT-005',
    name: 'Campus Access & Safety',
    type: 'Public',
    status: 'Active',
    visible: 'Yes',
  },
];

export const INITIAL_COMMITTEES: GrievanceCommittee[] = [
  {
    id: 'COM-001',
    name: 'Student Welfare & Discipline Committee',
    shortName: 'SWDC',
    status: 'Active',
    chairman: ['Dr. Rajeshwari Sen'],
    instituteMembers: ['Prof. Alok Mehta', 'Dr. Sumita Rao'],
    exOfficio: ['Shri Suresh Nair (Registrar)'],
    scStRep: ['Prof. K. Chandran'],
    memberSecretary: ['Shri R. K. Saxena'],
    nonInstitute: [
      {
        name: 'Smt. Anjali Bose',
        department: 'Social Work',
        designation: 'External Member',
        email: 'anjali.bose@ngo.org',
        mobile: '9876543201',
      },
    ],
    effectiveDate: '2026-01-01',
    approvedOn: '2025-12-20',
    approvedTill: '2026-12-31',
    document: 'swdc_setup_signed.pdf',
  },
  {
    id: 'COM-002',
    name: 'Internal Employee Redressal Cell',
    shortName: 'IERC',
    status: 'Active',
    chairman: ['Prof. Vinay Kumar'],
    instituteMembers: ['Dr. Preeti Gupta'],
    exOfficio: ['Dr. M. K. Rawat'],
    scStRep: ['Shri Lalit Kumar'],
    memberSecretary: ['Smt. Rashmi Sinha'],
    nonInstitute: [],
    effectiveDate: '2026-01-15',
    approvedOn: '2026-01-10',
    approvedTill: '2027-01-14',
  },
];

export const INITIAL_CATEGORY_USER_MAPPINGS: CategoryUserMapping[] = [
  {
    id: 'MAP-C-001',
    category: 'Academic & Examination Issues',
    userId: 'grievance_admin_student',
    status: 'Active',
  },
  {
    id: 'MAP-C-002',
    category: 'Salary & PF Discrepancies',
    userId: 'grievance_admin_staff',
    status: 'Active',
  },
];

export const INITIAL_GRIEVANCE_USER_MAPPINGS: GrievanceUserMapping[] = [
  {
    id: 'MAP-G-001',
    grievanceId: 'GRV-001',
    userId: 'grievance_user_01',
    status: 'Active',
  },
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'GRV-001',
    memberType: 'Student',
    member: 'Aditya Pratap Singh (STU2024CS0120)',
    email: 'aditya.singh@stu.ac.in',
    category: 'Academic & Examination Issues',
    level: 'Severe',
    priority: 'High',
    description:
      'Third-semester marksheet contains incorrect grades for Data Structures. Applied for revaluation but original sheet was not updated.',
    proposedSolution:
      'Correct the transcript score for CS-301 according to revaluation results.',
    wantUpload: 'Yes',
    document: 'reval_slip.pdf',
    declaration: true,
    status: 'Pending',
    reportedDate: '2026-06-10',
    notes: [
      {
        id: 'NOTE-001',
        meetingId: 'MEET-001',
        notes:
          'The examination cell has forwarded the corrected marks file. Waiting for system sync.',
        visibleToAll: 'Yes',
        author: 'Dr. Sumita Rao',
        responseStatus: 'New',
      },
    ],
  },
  {
    id: 'GRV-002',
    memberType: 'Employee',
    member: 'Dr. M. K. Rawat (EMP-0245)',
    email: 'mkrawat@stu.ac.in',
    category: 'Salary & PF Discrepancies',
    level: 'Routine',
    priority: 'Medium',
    description:
      'DA (Dearness Allowance) arrears for January 2026 have not been credited in the bank salary slip.',
    proposedSolution: 'Release the arrears in next payroll cycle.',
    wantUpload: 'No',
    declaration: true,
    status: 'Reported',
    reportedDate: '2026-06-20',
    notes: [],
  },
  {
    id: 'GRV-003',
    memberType: 'Public',
    member: 'Smt. Saroj Devi',
    email: 'sarojdevi@outlook.com',
    contactNo: '9988776655',
    address: 'Sector 3, Airport Road, Bhopal',
    category: 'Campus Access & Safety',
    level: 'Mild',
    priority: 'Low',
    description:
      'Street light outside the campus gate 2 has been broken for 2 weeks, making the street unsafe in evenings.',
    proposedSolution:
      'Repair the post lamp as it is powered by university grid.',
    wantUpload: 'No',
    declaration: true,
    status: 'Resolved',
    reportedDate: '2026-06-01',
    resolution:
      'Maintenance team replaced the lamp bulb and repaired the cable connection.',
    resolutionDate: '2026-06-05',
    notes: [],
  },
];

export const INITIAL_MEETINGS: GrievanceMeeting[] = [
  {
    id: 'MEET-001',
    grievanceId: 'GRV-001',
    meetingType: 'Committee Review',
    agenda:
      'Review Transcript discrepancies for STU2024CS0120 and verify exam database',
    meetingTime: '2026-06-28T14:30:00',
    venue: 'Academic Senate Hall, Admin Block',
    guests: [
      {
        name: 'Prof. S. Chakrabarty (COE)',
        email: 'coe@stu.ac.in',
        mobile: '9122334455',
      },
    ],
    status: 'Scheduled',
  },
];

// Available roles options
export const SIMULATED_ROLES = [
  { id: 'grievance_admin_staff', text: 'Grievance Admin (Staff/Employee)' },
  { id: 'grievance_admin_student', text: 'Grievance Admin (Student)' },
  { id: 'employee', text: 'Employee (Complainant)' },
  { id: 'student', text: 'Student (Complainant)' },
];

export const USERS_LIST = [
  { id: 'grievance_admin_staff', text: 'Staff Admin (grievance_admin_staff)' },
  {
    id: 'grievance_admin_student',
    text: 'Student Admin (grievance_admin_student)',
  },
  {
    id: 'grievance_category_user_01',
    text: 'Category Handler (grievance_category_user)',
  },
  { id: 'grievance_user_01', text: 'Grievance Handler (grievance_user)' },
];
