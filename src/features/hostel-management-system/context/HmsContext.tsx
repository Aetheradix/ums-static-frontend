import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// ───────────────────────────────────────────────────────────────────────────
// Portal roles & mock identities
// ───────────────────────────────────────────────────────────────────────────

export type PortalRole = 'admin' | 'warden' | 'student';

/** The warden signed in for this prototype runs Boys Hostel - Block A. */
export const MOCK_WARDEN_HOSTEL_ID = 'H1';
export const MOCK_WARDEN_NAME = 'Rajesh Kumar';

/** The student signed in for this prototype. */
export const MOCK_STUDENT_ID = 'S101';
export const MOCK_STUDENT_NAME = 'Rahul Verma';

/**
 * Bump when `HmsData` changes shape — a snapshot stored under an older
 * version is dropped rather than half-merged.
 */
const DATA_VERSION = '4';
const DATA_KEY = 'hmsData';
const VERSION_KEY = 'hmsDataVersion';

// ───────────────────────────────────────────────────────────────────────────
// Room types
// ───────────────────────────────────────────────────────────────────────────

export type RoomType =
  | 'Single Seater'
  | 'Double Seater'
  | 'Triple Seater'
  | 'Dormitory';

/** Beds each room type holds — dormitory is fixed at 8. */
export const ROOM_TYPE_BEDS: Record<RoomType, number> = {
  'Single Seater': 1,
  'Double Seater': 2,
  'Triple Seater': 3,
  Dormitory: 8,
};

export const ROOM_TYPES = Object.keys(ROOM_TYPE_BEDS) as RoomType[];

/** Annual hostel fee per room type — fewer beds to a room costs more. */
export const ROOM_TYPE_FEE: Record<RoomType, number> = {
  'Single Seater': 48000,
  'Double Seater': 36000,
  'Triple Seater': 28000,
  Dormitory: 18000,
};

export const formatFee = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

/** `Triple Seater (3 beds · ₹28,000/year)` — the label every room-type picker shows. */
export const roomTypeLabel = (t: RoomType) =>
  `${t} (${ROOM_TYPE_BEDS[t]} ${ROOM_TYPE_BEDS[t] === 1 ? 'bed' : 'beds'} · ${formatFee(
    ROOM_TYPE_FEE[t]
  )}/year)`;

export const ROOM_TYPE_OPTIONS = ROOM_TYPES.map(t => ({
  id: t,
  text: roomTypeLabel(t),
}));

// ───────────────────────────────────────────────────────────────────────────
// Masters
// ───────────────────────────────────────────────────────────────────────────

export interface District {
  id: string;
  name: string;
  state: string;
}

export interface Block {
  id: string;
  name: string;
  districtId: string;
}

export interface Designation {
  id: string;
  name: string;
}

export interface FacilityOption {
  id: string;
  name: string;
  /** Material Symbols ligature shown on the facility chip. */
  icon: string;
}

export interface WarningType {
  id: string;
  name: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface GrievanceCategory {
  id: string;
  name: string;
  department: string;
}

export interface ActivityType {
  id: string;
  name: string;
  category: string;
}

// ───────────────────────────────────────────────────────────────────────────
// Core entities
// ───────────────────────────────────────────────────────────────────────────

export interface Hostel {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  type: 'Boys' | 'Girls';
  districtId: string;
  blockId: string;
  address: string;
  /** Sanctioned seats, as declared at registration. */
  capacity: number;
  /** Occupancy declared at registration (before allocations are recorded). */
  occupancy: number;
  wardenName: string;
  wardenMobile: string;
  wardenEmail: string;
  wardenDesignationId: string;
  wardenJoiningDate: string;
  /** Facilities the warden has configured for this hostel. */
  facilityIds: string[];
  /** Credentials issued at registration; the warden signs in with these. */
  loginId: string;
  password: string;
  registeredOn: string;
  status: 'Active' | 'Inactive';
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  roomType: RoomType;
  floor: string;
  wing: string;
  beds: number;
  status: 'Available' | 'Under Maintenance';
}

export interface StudentDirectoryEntry {
  rollNumber: string;
  enrollmentNumber: string;
  mobileNumber: string;
  studentName: string;
  photo: string;
  programme: string;
  branch: string;
  gender: string;
  category: string;
  email: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  parentEmail: string;
  permanentAddress: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  applicationNo: string;
  submittedOn: string;

  rollNumber: string;
  enrollmentNumber: string;
  studentName: string;
  photo: string;
  programme: string;
  branch: string;
  gender: string;
  category: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;

  fatherName: string;
  motherName: string;
  parentMobile: string;
  parentEmail: string;
  permanentAddress: string;

  guardianName: string;
  guardianRelation: string;
  guardianContact: string;
  guardianAddress: string;

  preferredHostelId: string;
  preferredRoomType: string;

  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;

  bloodGroup: string;
  medicalConditions: string;
  allergies: string;
  medication: string;
  healthCertificate: string;
  guardianConsent: boolean;
  declaration: boolean;

  status: ApplicationStatus;
  remarks: string;
  decisionDate: string;
  decidedBy: string;

  /** ERP credentials issued once the warden approves. */
  erpLoginId: string;
  erpPassword: string;
}

export interface Allocation {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  roomId: string;
  roomType: RoomType;
  allottedOn: string;
  allottedBy: string;
  status: 'Active' | 'Vacated';
}

// ───────────────────────────────────────────────────────────────────────────
// Day-to-day records
// ───────────────────────────────────────────────────────────────────────────

export interface InOutEntry {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  durationType: 'Short' | 'Long';
  purpose: string;
  destination: string;
  outDate: string;
  outTime: string;
  expectedReturnDate: string;
  expectedReturnTime: string;
  inDate: string;
  inTime: string;
  status: 'Out' | 'Returned' | 'Overdue';
  recordedBy: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  leaveType: 'Leave' | 'Outpass';
  fromDate: string;
  toDate: string;
  destination: string;
  reason: string;
  parentMobile: string;
  parentEmail: string;
  /** Parent consent OTP verified before the request reaches the warden. */
  otpVerified: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  actionBy: string;
  actionDate: string;
  remarks: string;
}

export interface Warning {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  warningTypeId: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  issuedBy: string;
  issuedOn: string;
  fineAmount: number;
  acknowledged: boolean;
}

export interface MessMenuEntry {
  id: string;
  hostelId: string;
  day: string;
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  items: string;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  feedbackDate: string;
  meal: string;
  rating: number;
  quality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  comments: string;
  /** Photo of the meal attached by the student; shown in the warden's grid. */
  photo: string;
  wardenResponse: string;
  status: 'New' | 'Reviewed' | 'Actioned';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  paymentType: 'Hostel Fee' | 'Mess Fee' | 'Caution Money' | 'Fine' | 'Other';
  period: string;
  amount: number;
  mode: 'Online' | 'UPI' | 'Cash' | 'Challan';
  transactionId: string;
  paymentDate: string;
  receiptNo: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface Visitor {
  id: string;
  hostelId: string;
  studentId: string;
  studentName: string;
  visitorName: string;
  relation: string;
  purpose: string;
  contactNumber: string;
  idProofType: string;
  idProofNumber: string;
  visitDate: string;
  timeIn: string;
  timeOut: string;
  remarks: string;
}

export interface Activity {
  id: string;
  hostelId: string;
  title: string;
  activityTypeId: string;
  description: string;
  venue: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  coordinator: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
  participants: string[];
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  date: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'Night Out';
  markedBy: string;
  remarks: string;
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  currentRoomId: string;
  requestedRoomType: string;
  /** Room number the student asked for, when they picked one. */
  requestedRoomId?: string;
  reason: string;
  requestedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  actionBy: string;
  actionDate: string;
  remarks: string;
}

export interface Grievance {
  id: string;
  grievanceNo: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  categoryId: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  raisedOn: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  actionTaken: string;
  actionBy: string;
  actionDate: string;
}

// ───────────────────────────────────────────────────────────────────────────

export interface HmsData {
  districts: District[];
  blocks: Block[];
  designations: Designation[];
  facilityOptions: FacilityOption[];
  warningTypes: WarningType[];
  grievanceCategories: GrievanceCategory[];
  activityTypes: ActivityType[];

  hostels: Hostel[];
  rooms: Room[];
  studentDirectory: StudentDirectoryEntry[];
  applications: Application[];
  allocations: Allocation[];

  inOutEntries: InOutEntry[];
  leaveRequests: LeaveRequest[];
  warnings: Warning[];
  messMenu: MessMenuEntry[];
  messFeedback: MessFeedback[];
  payments: Payment[];
  visitors: Visitor[];
  activities: Activity[];
  attendance: Attendance[];
  roomChangeRequests: RoomChangeRequest[];
  grievances: Grievance[];
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

/** `2026-09-02` — the ISO date every screen in this module stores. */
export const today = () => new Date().toISOString().split('T')[0];

/** `18:45` — wall-clock time in the 24-hour form the gate register uses. */
export const now = () => new Date().toTimeString().slice(0, 5);

export const uid = (prefix: string) =>
  `${prefix}${Date.now().toString(36).toUpperCase()}`;

/** Credentials handed to a hostel the moment its registration is saved. */
export const buildHostelCredentials = (code: string, sequence: number) => {
  const safe = (code || 'HST').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return {
    loginId: `HMS-${safe || 'HST'}-${String(sequence).padStart(3, '0')}`,
    password: `${safe.charAt(0)}${safe.slice(1).toLowerCase()}@${new Date().getFullYear()}`,
  };
};

/** ERP credentials issued to a student once the warden approves. */
export const buildStudentCredentials = (name: string, sequence: number) => {
  const first = (name || 'Student').trim().split(/\s+/)[0];
  return {
    erpLoginId: `S${sequence}`,
    erpPassword: `${first.charAt(0).toUpperCase()}${first.slice(1).toLowerCase()}@${sequence}`,
  };
};

/**
 * The next free `S###` sequence.
 *
 * Student ids are shared between applicants approved here and residents that
 * already hold an allotment, so both have to be scanned — issuing an id that
 * an existing resident holds would silently attach the new student to that
 * resident's room.
 */
export const nextStudentSequence = (data: HmsData): number => {
  const used = new Set<string>();
  data.applications.forEach(a => a.erpLoginId && used.add(a.erpLoginId));
  data.allocations.forEach(a => a.studentId && used.add(a.studentId));

  let sequence = 101;
  while (used.has(`S${sequence}`)) sequence += 1;
  return sequence;
};

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const MEALS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const;

// ───────────────────────────────────────────────────────────────────────────
// Seed data
// ───────────────────────────────────────────────────────────────────────────

/**
 * A compact roster the seed expands into directory entries, applications and
 * allotments. Keeping it as tuples means every grid has realistic volume
 * without thousands of lines of literal objects.
 *
 * [roll, name, gender, programme, branch, category, blood, father, mother, city]
 */
const ROSTER: [
  string,
  string,
  'Male' | 'Female',
  string,
  string,
  string,
  string,
  string,
  string,
  string,
][] = [
  [
    'JEE2026001',
    'Rahul Verma',
    'Male',
    'B.Tech',
    'Computer Science & Engineering',
    'General',
    'B+',
    'Mahesh Verma',
    'Sunita Verma',
    'Indore',
  ],
  [
    'JEE2026002',
    'Priya Sharma',
    'Female',
    'B.Tech',
    'Electronics & Communication',
    'OBC',
    'O+',
    'Ramesh Sharma',
    'Kavita Sharma',
    'Ujjain',
  ],
  [
    'JEE2026003',
    'Amit Patel',
    'Male',
    'B.Tech',
    'Mechanical Engineering',
    'SC',
    'A+',
    'Dinesh Patel',
    'Rekha Patel',
    'Dhar',
  ],
  [
    'DAVV2026004',
    'Neha Joshi',
    'Female',
    'MBA',
    'Marketing',
    'General',
    'AB+',
    'Prakash Joshi',
    'Anita Joshi',
    'Indore',
  ],
  [
    'DAVV2026005',
    'Sandeep Yadav',
    'Male',
    'MCA',
    'Computer Applications',
    'OBC',
    'B-',
    'Rajendra Yadav',
    'Sushma Yadav',
    'Khargone',
  ],
  [
    'JEE2026006',
    'Karan Mehta',
    'Male',
    'B.Tech',
    'Civil Engineering',
    'General',
    'O-',
    'Suresh Mehta',
    'Nisha Mehta',
    'Indore',
  ],
  [
    'JEE2026007',
    'Vikas Nair',
    'Male',
    'B.Tech',
    'Information Technology',
    'General',
    'A-',
    'Mohan Nair',
    'Lata Nair',
    'Dewas',
  ],
  [
    'JEE2026008',
    'Rohit Chouhan',
    'Male',
    'B.Tech',
    'Electrical Engineering',
    'ST',
    'B+',
    'Devi Singh Chouhan',
    'Meera Chouhan',
    'Jhabua',
  ],
  [
    'JEE2026009',
    'Ankit Gupta',
    'Male',
    'B.Sc',
    'Physics',
    'General',
    'AB-',
    'Naresh Gupta',
    'Shobha Gupta',
    'Ratlam',
  ],
  [
    'JEE2026010',
    'Deepak Solanki',
    'Male',
    'B.Tech',
    'Computer Science & Engineering',
    'OBC',
    'O+',
    'Kishor Solanki',
    'Manju Solanki',
    'Mhow',
  ],
  [
    'JEE2026011',
    'Sahil Khan',
    'Male',
    'BCA',
    'Computer Applications',
    'General',
    'B+',
    'Imran Khan',
    'Farah Khan',
    'Burhanpur',
  ],
  [
    'JEE2026012',
    'Manish Rathore',
    'Male',
    'B.Com',
    'Accounting & Finance',
    'OBC',
    'A+',
    'Bhanwar Rathore',
    'Kamla Rathore',
    'Sanawad',
  ],
  [
    'JEE2026013',
    'Sneha Agrawal',
    'Female',
    'B.Tech',
    'Computer Science & Engineering',
    'General',
    'O+',
    'Vinod Agrawal',
    'Poonam Agrawal',
    'Indore',
  ],
  [
    'JEE2026014',
    'Ritu Pawar',
    'Female',
    'B.Sc',
    'Biotechnology',
    'OBC',
    'A+',
    'Ashok Pawar',
    'Sarita Pawar',
    'Dewas',
  ],
  [
    'JEE2026015',
    'Divya Rane',
    'Female',
    'BBA',
    'Business Administration',
    'SC',
    'B+',
    'Sunil Rane',
    'Vaishali Rane',
    'Khandwa',
  ],
  [
    'JEE2026016',
    'Pooja Bhargava',
    'Female',
    'MBA',
    'Human Resources',
    'General',
    'AB+',
    'Rakesh Bhargava',
    'Seema Bhargava',
    'Ujjain',
  ],
  [
    'JEE2026017',
    'Anjali Tiwari',
    'Female',
    'B.Tech',
    'Electronics & Communication',
    'General',
    'O-',
    'Girish Tiwari',
    'Renu Tiwari',
    'Indore',
  ],
  [
    'JEE2026018',
    'Kavya Deshmukh',
    'Female',
    'M.Sc',
    'Chemistry',
    'OBC',
    'A-',
    'Prakash Deshmukh',
    'Sunanda Deshmukh',
    'Mhow',
  ],
  [
    'JEE2026019',
    'Tarun Malviya',
    'Male',
    'B.Tech',
    'Mechanical Engineering',
    'OBC',
    'B+',
    'Hariom Malviya',
    'Geeta Malviya',
    'Barwani',
  ],
  [
    'JEE2026020',
    'Imran Sheikh',
    'Male',
    'B.Tech',
    'Civil Engineering',
    'General',
    'O+',
    'Yusuf Sheikh',
    'Nasreen Sheikh',
    'Indore',
  ],
  [
    'JEE2026021',
    'Meena Chauhan',
    'Female',
    'B.Ed',
    'Education',
    'ST',
    'A+',
    'Ram Singh Chauhan',
    'Pushpa Chauhan',
    'Alirajpur',
  ],
  [
    'JEE2026022',
    'Nikhil Jain',
    'Male',
    'MCA',
    'Computer Applications',
    'General',
    'AB+',
    'Sanjay Jain',
    'Rachna Jain',
    'Ratlam',
  ],
];

const BRANCH_CODE: Record<string, string> = {
  'Computer Science & Engineering': 'CS',
  'Electronics & Communication': 'EC',
  'Mechanical Engineering': 'ME',
  'Civil Engineering': 'CE',
  'Electrical Engineering': 'EE',
  'Information Technology': 'IT',
  'Computer Applications': 'CA',
  Marketing: 'MKT',
  'Human Resources': 'HR',
  'Business Administration': 'BBA',
  'Accounting & Finance': 'COM',
  Physics: 'PHY',
  Chemistry: 'CHM',
  Biotechnology: 'BT',
  Education: 'EDU',
};

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '.');

const seedDirectory = (): StudentDirectoryEntry[] =>
  ROSTER.map(
    (
      [roll, name, gender, programme, branch, category, , father, mother, city],
      i
    ) => ({
      rollNumber: roll,
      enrollmentNumber: `DAVV/${BRANCH_CODE[branch] ?? 'GEN'}/2026/${String(i + 1).padStart(3, '0')}`,
      mobileNumber: `98260001${String(i + 1).padStart(2, '0')}`,
      studentName: name,
      photo: '',
      programme,
      branch,
      gender,
      category,
      email: `${slug(name)}@student.davv.ac.in`,
      dateOfBirth: `200${4 + (i % 3)}-0${(i % 9) + 1}-1${i % 9}`,
      fatherName: father,
      motherName: mother,
      parentMobile: `98260009${String(i + 1).padStart(2, '0')}`,
      parentEmail: `${slug(father)}@gmail.com`,
      permanentAddress: `${10 + i}, ${city} Ward, ${city}, Madhya Pradesh`,
    })
  );

/** Girls go to H2, everyone else to H1 — matching the two seeded hostels. */
const hostelFor = (gender: string) => (gender === 'Female' ? 'H2' : 'H1');

const PREFERENCES: RoomType[] = [
  'Triple Seater',
  'Double Seater',
  'Single Seater',
  'Triple Seater',
  'Dormitory',
  'Double Seater',
];

/**
 * The first `approvedCount` of the roster are approved residents, the next few
 * sit in the warden's pending queue, and two are rejected — so every bucket on
 * the Admission Requests screen has rows.
 */
const APPROVED_COUNT = 6;
const PENDING_COUNT = 4;

const seedApplications = (): Application[] => {
  const directory = seedDirectory();
  // Statuses are assigned within each hostel's own queue, so both the boys'
  // and the girls' warden see approved, pending and rejected rows.
  const seenPerHostel = new Map<string, number>();

  return directory.map((d, i) => {
    const hostelId = hostelFor(d.gender);
    const rank = seenPerHostel.get(hostelId) ?? 0;
    seenPerHostel.set(hostelId, rank + 1);

    const approved = rank < APPROVED_COUNT;
    const pending = !approved && rank < APPROVED_COUNT + PENDING_COUNT;
    const status: ApplicationStatus = approved
      ? 'Approved'
      : pending
        ? 'Pending'
        : 'Rejected';
    const day = String((i % 27) + 1).padStart(2, '0');
    const roster = ROSTER[i];

    return {
      id: `AP${i + 1}`,
      applicationNo: `HMS/2026/${String(i + 1).padStart(4, '0')}`,
      submittedOn: `2026-06-${day}`,
      rollNumber: d.rollNumber,
      enrollmentNumber: d.enrollmentNumber,
      studentName: d.studentName,
      photo: '',
      programme: d.programme,
      branch: d.branch,
      gender: d.gender,
      category: d.category,
      email: d.email,
      mobileNumber: d.mobileNumber,
      dateOfBirth: d.dateOfBirth,
      fatherName: d.fatherName,
      motherName: d.motherName,
      parentMobile: d.parentMobile,
      parentEmail: d.parentEmail,
      permanentAddress: d.permanentAddress,
      guardianName: i % 3 === 0 ? d.fatherName : `${d.motherName}`,
      guardianRelation: i % 3 === 0 ? 'Father' : 'Mother',
      guardianContact: d.parentMobile,
      guardianAddress: d.permanentAddress,
      preferredHostelId: hostelId,
      preferredRoomType: PREFERENCES[i % PREFERENCES.length],
      emergencyName: d.fatherName,
      emergencyRelation: 'Father',
      emergencyContact: d.parentMobile,
      bloodGroup: roster[6],
      medicalConditions: i % 5 === 0 ? 'Asthma (mild)' : 'None',
      allergies: i % 4 === 0 ? 'Dust' : i % 7 === 0 ? 'Penicillin' : 'None',
      medication: i % 5 === 0 ? 'Inhaler as needed' : 'None',
      healthCertificate: `health-${slug(d.studentName)}.pdf`,
      guardianConsent: true,
      declaration: true,
      status,
      remarks: approved
        ? 'Documents verified. Room allotted.'
        : status === 'Rejected'
          ? 'Permanent address is within 15 km of the campus — day scholar.'
          : '',
      decisionDate: approved
        ? `2026-06-${day}`
        : status === 'Rejected'
          ? '2026-06-28'
          : '',
      decidedBy: status === 'Pending' ? '' : 'Rajesh Kumar',
      erpLoginId: approved ? `S${101 + i}` : '',
      erpPassword: approved ? `${d.studentName.split(' ')[0]}@${101 + i}` : '',
    };
  });
};

/**
 * Approved applicants are packed into rooms of their preferred type. The last
 * few are deliberately left unallotted so the Room Allotment screen always has
 * students waiting in its queue.
 */
const AWAITING_ALLOTMENT = 3;

const seedAllocations = (rooms: Room[]): Allocation[] => {
  const approvedAll = seedApplications().filter(a => a.status === 'Approved');
  const approved = approvedAll.slice(
    0,
    Math.max(approvedAll.length - AWAITING_ALLOTMENT, 0)
  );
  const usedBeds = new Map<string, number>();
  const allocations: Allocation[] = [];

  approved.forEach((application, i) => {
    const hostelRooms = rooms.filter(
      r =>
        r.hostelId === application.preferredHostelId &&
        r.roomType === application.preferredRoomType
    );
    const room =
      hostelRooms.find(r => (usedBeds.get(r.id) ?? 0) < r.beds) ??
      rooms.find(
        r =>
          r.hostelId === application.preferredHostelId &&
          (usedBeds.get(r.id) ?? 0) < r.beds
      );
    if (!room) return;

    usedBeds.set(room.id, (usedBeds.get(room.id) ?? 0) + 1);
    allocations.push({
      id: `AL${i + 1}`,
      applicationId: application.id,
      studentId: application.erpLoginId,
      studentName: application.studentName,
      hostelId: room.hostelId,
      roomId: room.id,
      roomType: room.roomType,
      allottedOn: application.decisionDate || '2026-06-20',
      allottedBy: 'Rajesh Kumar',
      status: 'Active',
    });
  });

  return allocations;
};

const seedRooms = (): Room[] => {
  const rooms: Room[] = [];
  const push = (
    hostelId: string,
    roomType: RoomType,
    numbers: string[],
    floor: string,
    wing: string
  ) =>
    numbers.forEach(roomNumber =>
      rooms.push({
        id: `R-${hostelId}-${roomNumber}`,
        hostelId,
        roomNumber,
        roomType,
        floor,
        wing,
        beds: ROOM_TYPE_BEDS[roomType],
        status: 'Available',
      })
    );

  push(
    'H1',
    'Single Seater',
    ['A-101', 'A-102', 'A-103'],
    'Ground Floor',
    'A Wing'
  );
  push(
    'H1',
    'Double Seater',
    ['A-201', 'A-202', 'A-203', 'A-204'],
    'First Floor',
    'A Wing'
  );
  push(
    'H1',
    'Triple Seater',
    ['B-301', 'B-302', 'B-303'],
    'Second Floor',
    'B Wing'
  );
  push('H1', 'Dormitory', ['D-001', 'D-002'], 'Ground Floor', 'D Block');

  push('H2', 'Single Seater', ['R-101', 'R-102'], 'Ground Floor', 'Rose Wing');
  push(
    'H2',
    'Double Seater',
    ['R-201', 'R-202', 'R-203'],
    'First Floor',
    'Rose Wing'
  );
  push('H2', 'Triple Seater', ['R-301', 'R-302'], 'Second Floor', 'Lily Wing');

  return rooms;
};

const seed = (): HmsData => ({
  districts: [
    { id: 'D1', name: 'Indore', state: 'Madhya Pradesh' },
    { id: 'D2', name: 'Ujjain', state: 'Madhya Pradesh' },
    { id: 'D3', name: 'Dhar', state: 'Madhya Pradesh' },
    { id: 'D4', name: 'Dewas', state: 'Madhya Pradesh' },
    { id: 'D5', name: 'Khargone', state: 'Madhya Pradesh' },
  ],
  blocks: [
    { id: 'B1', name: 'Indore Urban', districtId: 'D1' },
    { id: 'B2', name: 'Mhow', districtId: 'D1' },
    { id: 'B3', name: 'Depalpur', districtId: 'D1' },
    { id: 'B4', name: 'Sanwer', districtId: 'D1' },
    { id: 'B5', name: 'Ujjain Urban', districtId: 'D2' },
    { id: 'B6', name: 'Badnagar', districtId: 'D2' },
    { id: 'B7', name: 'Dhar Urban', districtId: 'D3' },
  ],
  designations: [
    { id: 'DG1', name: 'Chief Warden' },
    { id: 'DG2', name: 'Warden' },
    { id: 'DG3', name: 'Assistant Warden' },
    { id: 'DG4', name: 'Hostel Superintendent' },
    { id: 'DG5', name: 'Caretaker' },
  ],
  facilityOptions: [
    { id: 'F1', name: 'CCTV Surveillance', icon: 'videocam' },
    { id: 'F2', name: 'Wi-Fi', icon: 'wifi' },
    { id: 'F3', name: 'Security Guards', icon: 'local_police' },
    { id: 'F4', name: 'Water Cooler / RO', icon: 'water_drop' },
    { id: 'F5', name: 'Laundry', icon: 'local_laundry_service' },
    { id: 'F6', name: 'Mess', icon: 'restaurant' },
    { id: 'F7', name: 'Reading Room', icon: 'menu_book' },
    { id: 'F8', name: 'Gym', icon: 'fitness_center' },
    { id: 'F9', name: 'Power Backup', icon: 'bolt' },
    { id: 'F10', name: 'Medical Room', icon: 'medical_services' },
    { id: 'F11', name: 'Indoor Games', icon: 'sports_esports' },
    { id: 'F12', name: 'Solar Water Heater', icon: 'solar_power' },
  ],
  warningTypes: [
    { id: 'WT1', name: 'Late Entry', severity: 'Low' },
    { id: 'WT2', name: 'Misbehaviour with Staff', severity: 'High' },
    { id: 'WT3', name: 'Ragging', severity: 'High' },
    { id: 'WT4', name: 'Damage to Hostel Property', severity: 'Medium' },
    { id: 'WT5', name: 'Unauthorised Absence', severity: 'Medium' },
    { id: 'WT6', name: 'Noise / Nuisance', severity: 'Low' },
  ],
  grievanceCategories: [
    { id: 'GC1', name: 'Mess & Food Quality', department: 'Mess Committee' },
    { id: 'GC2', name: 'Water Supply', department: 'Maintenance' },
    { id: 'GC3', name: 'Electricity', department: 'Maintenance' },
    { id: 'GC4', name: 'Cleanliness & Sanitation', department: 'Housekeeping' },
    { id: 'GC5', name: 'Security & Safety', department: 'Security' },
    { id: 'GC6', name: 'Internet / Wi-Fi', department: 'IT Cell' },
    { id: 'GC7', name: 'Roommate / Behavioural', department: 'Warden Office' },
  ],
  activityTypes: [
    { id: 'AT1', name: 'Inter-Hostel Sports', category: 'Sports' },
    { id: 'AT2', name: 'Cultural Evening', category: 'Cultural' },
    { id: 'AT3', name: 'Seminar / Workshop', category: 'Academic' },
    { id: 'AT4', name: 'Yoga & Wellness', category: 'Wellness' },
    { id: 'AT5', name: 'Social Outreach', category: 'Social' },
  ],

  hostels: [
    {
      id: 'H1',
      code: 'BHA',
      nameEn: 'Boys Hostel - Block A',
      nameHi: 'बालक छात्रावास - ब्लॉक ए',
      type: 'Boys',
      districtId: 'D1',
      blockId: 'B1',
      address: 'Takshashila Campus, Khandwa Road, Indore - 452001',
      capacity: 40,
      occupancy: 12,
      wardenName: 'Rajesh Kumar',
      wardenMobile: '9425011201',
      wardenEmail: 'rajesh.kumar@davv.ac.in',
      wardenDesignationId: 'DG1',
      wardenJoiningDate: '2021-07-01',
      facilityIds: ['F1', 'F2', 'F3', 'F4', 'F6', 'F9'],
      loginId: 'HMS-BHA-001',
      password: 'Bha@2026',
      registeredOn: '2026-04-10',
      status: 'Active',
    },
    {
      id: 'H2',
      code: 'GHR',
      nameEn: 'Girls Hostel - Rose Wing',
      nameHi: 'बालिका छात्रावास - रोज़ विंग',
      type: 'Girls',
      districtId: 'D1',
      blockId: 'B2',
      address: 'Takshashila Campus, Khandwa Road, Indore - 452001',
      capacity: 30,
      occupancy: 8,
      wardenName: 'Sunita Sharma',
      wardenMobile: '9425011202',
      wardenEmail: 'sunita.sharma@davv.ac.in',
      wardenDesignationId: 'DG1',
      wardenJoiningDate: '2022-06-15',
      facilityIds: ['F1', 'F2', 'F3', 'F5', 'F6', 'F10'],
      loginId: 'HMS-GHR-002',
      password: 'Ghr@2026',
      registeredOn: '2026-04-10',
      status: 'Active',
    },
    {
      id: 'H3',
      code: 'PGB',
      nameEn: 'PG Boys Hostel - Nalanda',
      nameHi: 'पीजी बालक छात्रावास - नालंदा',
      type: 'Boys',
      districtId: 'D1',
      blockId: 'B3',
      address: 'Nalanda Campus Residency, Indore - 452017',
      capacity: 24,
      occupancy: 0,
      wardenName: 'Dr. Vikram Rathore',
      wardenMobile: '9425011203',
      wardenEmail: 'vikram.rathore@davv.ac.in',
      wardenDesignationId: 'DG2',
      wardenJoiningDate: '2023-01-09',
      facilityIds: ['F2', 'F4', 'F6'],
      loginId: 'HMS-PGB-003',
      password: 'Pgb@2026',
      registeredOn: '2026-04-12',
      status: 'Active',
    },
  ],

  rooms: seedRooms(),

  studentDirectory: seedDirectory(),

  applications: seedApplications(),

  allocations: seedAllocations(seedRooms()),

  inOutEntries: [
    {
      id: 'IO1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      durationType: 'Short',
      purpose: 'Stationery purchase',
      destination: 'Bhanwarkuan Market',
      outDate: '2026-08-28',
      outTime: '17:10',
      expectedReturnDate: '2026-08-28',
      expectedReturnTime: '19:30',
      inDate: '2026-08-28',
      inTime: '19:05',
      status: 'Returned',
      recordedBy: 'Rahul Verma',
    },
    {
      id: 'IO2',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      durationType: 'Long',
      purpose: 'Home visit - festival',
      destination: 'Vijay Nagar, Indore',
      outDate: '2026-08-30',
      outTime: '08:00',
      expectedReturnDate: '2026-09-03',
      expectedReturnTime: '20:00',
      inDate: '',
      inTime: '',
      status: 'Out',
      recordedBy: 'Rahul Verma',
    },
    {
      id: 'IO3',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      durationType: 'Short',
      purpose: 'Central Library',
      destination: 'University Library',
      outDate: '2026-09-01',
      outTime: '09:15',
      expectedReturnDate: '2026-09-01',
      expectedReturnTime: '13:00',
      inDate: '',
      inTime: '',
      status: 'Overdue',
      recordedBy: 'Karan Mehta',
    },
  ],

  leaveRequests: [
    {
      id: 'LV1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      leaveType: 'Leave',
      fromDate: '2026-08-30',
      toDate: '2026-09-03',
      destination: 'Vijay Nagar, Indore',
      reason: 'Family function at home',
      parentMobile: '9826000901',
      parentEmail: 'mahesh.verma@gmail.com',
      otpVerified: true,
      status: 'Approved',
      actionBy: 'Rajesh Kumar',
      actionDate: '2026-08-29',
      remarks: 'Approved. Report back by 20:00 on 03 Sep.',
    },
    {
      id: 'LV2',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      leaveType: 'Outpass',
      fromDate: '2026-09-02',
      toDate: '2026-09-02',
      destination: 'City Hospital',
      reason: 'Dental appointment',
      parentMobile: '9826000912',
      parentEmail: 'mehta.family@gmail.com',
      otpVerified: true,
      status: 'Pending',
      actionBy: '',
      actionDate: '',
      remarks: '',
    },
  ],

  warnings: [
    {
      id: 'WN1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      warningTypeId: 'WT1',
      severity: 'Low',
      description:
        'Entered the hostel at 23:40, past the 22:30 curfew, without prior intimation.',
      issuedBy: 'Rajesh Kumar',
      issuedOn: '2026-08-20',
      fineAmount: 200,
      acknowledged: true,
    },
    {
      id: 'WN2',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      warningTypeId: 'WT6',
      severity: 'Low',
      description:
        'Loud music in room B-301 after quiet hours; two residents complained.',
      issuedBy: 'Rajesh Kumar',
      issuedOn: '2026-08-26',
      fineAmount: 0,
      acknowledged: false,
    },
  ],

  messMenu: [
    {
      id: 'MM1',
      hostelId: 'H1',
      day: 'Monday',
      meal: 'Breakfast',
      items: 'Poha, Jalebi, Tea, Banana',
    },
    {
      id: 'MM2',
      hostelId: 'H1',
      day: 'Monday',
      meal: 'Lunch',
      items: 'Roti, Dal Fry, Aloo Gobhi, Rice, Salad',
    },
    {
      id: 'MM3',
      hostelId: 'H1',
      day: 'Monday',
      meal: 'Snacks',
      items: 'Samosa, Green Chutney, Tea',
    },
    {
      id: 'MM4',
      hostelId: 'H1',
      day: 'Monday',
      meal: 'Dinner',
      items: 'Roti, Rajma, Jeera Rice, Curd',
    },
    {
      id: 'MM5',
      hostelId: 'H1',
      day: 'Tuesday',
      meal: 'Breakfast',
      items: 'Idli, Sambar, Coconut Chutney, Tea',
    },
    {
      id: 'MM6',
      hostelId: 'H1',
      day: 'Tuesday',
      meal: 'Lunch',
      items: 'Roti, Chana Masala, Bhindi, Rice, Papad',
    },
    {
      id: 'MM7',
      hostelId: 'H1',
      day: 'Tuesday',
      meal: 'Snacks',
      items: 'Bread Pakora, Sauce, Coffee',
    },
    {
      id: 'MM8',
      hostelId: 'H1',
      day: 'Tuesday',
      meal: 'Dinner',
      items: 'Roti, Paneer Butter Masala, Rice, Gulab Jamun',
    },
    {
      id: 'MM9',
      hostelId: 'H1',
      day: 'Wednesday',
      meal: 'Breakfast',
      items: 'Aloo Paratha, Curd, Pickle, Tea',
    },
    {
      id: 'MM10',
      hostelId: 'H1',
      day: 'Wednesday',
      meal: 'Lunch',
      items: 'Roti, Kadhi, Mix Veg, Rice, Salad',
    },
    {
      id: 'MM11',
      hostelId: 'H1',
      day: 'Wednesday',
      meal: 'Dinner',
      items: 'Roti, Dal Makhani, Rice, Halwa',
    },
  ],

  messFeedback: [
    {
      id: 'MF1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      feedbackDate: '2026-08-29',
      meal: 'Dinner',
      rating: 2,
      quality: 'Poor',
      comments: 'Dal was watery and the chapatis were cold.',
      photo: 'dinner-28-aug.jpg',
      wardenResponse: 'Raised with the mess contractor; supervisor briefed.',
      status: 'Actioned',
    },
    {
      id: 'MF2',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      feedbackDate: '2026-08-31',
      meal: 'Breakfast',
      rating: 4,
      quality: 'Good',
      comments: 'Poha and tea were fresh. Please add fruit twice a week.',
      photo: '',
      wardenResponse: '',
      status: 'New',
    },
  ],

  payments: [
    {
      id: 'PY1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      paymentType: 'Caution Money',
      period: 'One-time',
      amount: 5000,
      mode: 'Online',
      transactionId: 'TXN-9KD82HS01',
      paymentDate: '2026-06-16',
      receiptNo: 'RCPT/2026/0001',
      status: 'Paid',
    },
    {
      id: 'PY2',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      paymentType: 'Hostel Fee',
      period: '2026-27 Session',
      amount: 36000,
      mode: 'Online',
      transactionId: 'TXN-4LP19XZ22',
      paymentDate: '2026-06-16',
      receiptNo: 'RCPT/2026/0002',
      status: 'Paid',
    },
    {
      id: 'PY3',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      paymentType: 'Mess Fee',
      period: 'August 2026',
      amount: 3800,
      mode: 'UPI',
      transactionId: 'TXN-7QW55MN13',
      paymentDate: '2026-08-05',
      receiptNo: 'RCPT/2026/0031',
      status: 'Paid',
    },
    {
      id: 'PY4',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      paymentType: 'Mess Fee',
      period: 'August 2026',
      amount: 3800,
      mode: 'Challan',
      transactionId: '',
      paymentDate: '',
      receiptNo: '',
      status: 'Pending',
    },
  ],

  visitors: [
    {
      id: 'VS1',
      hostelId: 'H1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      visitorName: 'Mahesh Verma',
      relation: 'Father',
      purpose: 'Routine visit',
      contactNumber: '9826000901',
      idProofType: 'Aadhaar',
      idProofNumber: 'XXXX-XXXX-4412',
      visitDate: '2026-08-24',
      timeIn: '11:00',
      timeOut: '13:20',
      remarks: '',
    },
    {
      id: 'VS2',
      hostelId: 'H1',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      visitorName: 'Anil Mehta',
      relation: 'Uncle',
      purpose: 'Dropped study material',
      contactNumber: '9826000912',
      idProofType: 'Voter ID',
      idProofNumber: 'MP/1123/8890',
      visitDate: '2026-09-01',
      timeIn: '16:40',
      timeOut: '',
      remarks: 'Waiting in the visitor lounge',
    },
  ],

  activities: [
    {
      id: 'AC1',
      hostelId: 'H1',
      title: 'Inter-Hostel Cricket Tournament',
      activityTypeId: 'AT1',
      description:
        'Knockout cricket tournament between all university hostels. Teams of 11 plus 3 substitutes.',
      venue: 'University Sports Ground',
      activityDate: '2026-09-12',
      startTime: '07:00',
      endTime: '12:00',
      coordinator: 'Rajesh Kumar',
      status: 'Planned',
      participants: ['S101'],
    },
    {
      id: 'AC2',
      hostelId: 'H1',
      title: 'Hostel Cultural Night',
      activityTypeId: 'AT2',
      description:
        'Annual cultural evening with music, dance and drama by residents.',
      venue: 'Hostel Common Hall',
      activityDate: '2026-09-20',
      startTime: '18:00',
      endTime: '22:00',
      coordinator: 'Rajesh Kumar',
      status: 'Planned',
      participants: [],
    },
    {
      id: 'AC3',
      hostelId: 'H1',
      title: 'Morning Yoga Session',
      activityTypeId: 'AT4',
      description:
        'Daily yoga and meditation run by the university wellness cell.',
      venue: 'Hostel Lawn',
      activityDate: '2026-08-21',
      startTime: '06:00',
      endTime: '07:00',
      coordinator: 'Wellness Cell',
      status: 'Completed',
      participants: ['S101', 'S102'],
    },
  ],

  attendance: [
    {
      id: 'AT-1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      date: '2026-08-31',
      status: 'Present',
      markedBy: 'Rajesh Kumar',
      remarks: '',
    },
    {
      id: 'AT-2',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      date: '2026-09-01',
      status: 'On Leave',
      markedBy: 'Rajesh Kumar',
      remarks: 'Approved leave LV1',
    },
    {
      id: 'AT-3',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      date: '2026-09-01',
      status: 'Present',
      markedBy: 'Rajesh Kumar',
      remarks: '',
    },
    {
      id: 'AT-4',
      studentId: 'S103',
      studentName: 'Vikas Nair',
      hostelId: 'H1',
      date: '2026-09-01',
      status: 'Absent',
      markedBy: 'Rajesh Kumar',
      remarks: 'Not found during night roll call',
    },
  ],

  roomChangeRequests: [
    {
      id: 'RC1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      currentRoomId: 'R-H1-B-301',
      requestedRoomType: 'Double Seater',
      reason: 'Prefer a quieter room closer to the reading room.',
      requestedOn: '2026-08-27',
      status: 'Pending',
      actionBy: '',
      actionDate: '',
      remarks: '',
    },
  ],

  grievances: [
    {
      id: 'GR1',
      grievanceNo: 'GRV/2026/0001',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      categoryId: 'GC2',
      subject: 'No hot water on the second floor',
      description:
        'The geyser on the second floor has not worked for four days; morning bathing is difficult.',
      priority: 'High',
      raisedOn: '2026-08-25',
      status: 'Resolved',
      actionTaken:
        'Geyser heating element replaced by the maintenance team on 27 Aug 2026.',
      actionBy: 'Rajesh Kumar',
      actionDate: '2026-08-27',
    },
    {
      id: 'GR2',
      grievanceNo: 'GRV/2026/0002',
      studentId: 'S102',
      studentName: 'Karan Mehta',
      hostelId: 'H1',
      categoryId: 'GC6',
      subject: 'Wi-Fi drops every evening',
      description:
        'Wi-Fi in the west wing disconnects between 20:00 and 23:00 almost every day.',
      priority: 'Medium',
      raisedOn: '2026-08-30',
      status: 'Open',
      actionTaken: '',
      actionBy: '',
      actionDate: '',
    },
  ],
});

// ───────────────────────────────────────────────────────────────────────────
// Context
// ───────────────────────────────────────────────────────────────────────────

interface HmsContextValue {
  data: HmsData;
  activePortal: PortalRole | null;
  add: <K extends keyof HmsData>(key: K, record: HmsData[K][number]) => void;
  addMany: <K extends keyof HmsData>(key: K, records: HmsData[K]) => void;
  update: <K extends keyof HmsData>(
    key: K,
    id: string,
    record: HmsData[K][number]
  ) => void;
  remove: <K extends keyof HmsData>(key: K, id: string) => void;
  resetData: () => void;
}

const HmsContext = createContext<HmsContextValue | undefined>(undefined);

export function HmsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  const activePortal = useMemo<PortalRole | null>(() => {
    const path = location.pathname;
    if (path.includes('/hostel-management-system/student')) return 'student';
    if (path.includes('/hostel-management-system/warden')) return 'warden';
    if (path.includes('/hostel-management-system/admin')) return 'admin';
    return null;
  }, [location.pathname]);

  const [data, setData] = useState<HmsData>(() => {
    if (localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.removeItem(DATA_KEY);
      return seed();
    }
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
      try {
        return { ...seed(), ...JSON.parse(saved) };
      } catch {
        return seed();
      }
    }
    return seed();
  });

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  const add: HmsContextValue['add'] = (key, record) =>
    setData(prev => ({ ...prev, [key]: [...prev[key], record] }));

  const addMany: HmsContextValue['addMany'] = (key, records) =>
    setData(prev => ({ ...prev, [key]: [...prev[key], ...records] }));

  const update: HmsContextValue['update'] = (key, id, record) =>
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as { id: string }[]).map(item =>
        item.id === id ? record : item
      ),
    }));

  const remove: HmsContextValue['remove'] = (key, id) =>
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as { id: string }[]).filter(item => item.id !== id),
    }));

  const resetData = () => setData(seed());

  return (
    <HmsContext.Provider
      value={{ data, activePortal, add, addMany, update, remove, resetData }}
    >
      {children}
    </HmsContext.Provider>
  );
}

export function useHms() {
  const ctx = useContext(HmsContext);
  if (!ctx) throw new Error('useHms must be used inside <HmsProvider>');
  return ctx;
}

/** Role flags derived from the URL, so pages can branch without prop drilling. */
export function useHmsRole() {
  const { activePortal } = useHms();
  return {
    activePortal,
    isAdmin: activePortal === 'admin',
    isWarden: activePortal === 'warden',
    isStudent: activePortal === 'student',
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Derived selectors — occupancy maths every screen shares
// ───────────────────────────────────────────────────────────────────────────

export interface RoomOccupancy {
  room: Room;
  allotted: number;
  available: number;
}

/** Beds taken in a room, from the active allocations against it. */
export const roomOccupancy = (
  room: Room,
  allocations: Allocation[]
): RoomOccupancy => {
  const allotted = allocations.filter(
    a => a.roomId === room.id && a.status === 'Active'
  ).length;
  return { room, allotted, available: Math.max(room.beds - allotted, 0) };
};

export interface HostelOccupancy {
  hostelId: string;
  totalRooms: number;
  configuredBeds: number;
  allottedBeds: number;
  availableBeds: number;
  /** Declared capacity vs beds actually configured as rooms. */
  declaredCapacity: number;
  occupancyRate: number;
}

export const hostelOccupancy = (
  hostel: Hostel,
  rooms: Room[],
  allocations: Allocation[]
): HostelOccupancy => {
  const hostelRooms = rooms.filter(r => r.hostelId === hostel.id);
  const configuredBeds = hostelRooms.reduce((sum, r) => sum + r.beds, 0);
  const allottedBeds = allocations.filter(
    a => a.hostelId === hostel.id && a.status === 'Active'
  ).length;
  return {
    hostelId: hostel.id,
    totalRooms: hostelRooms.length,
    configuredBeds,
    allottedBeds,
    availableBeds: Math.max(configuredBeds - allottedBeds, 0),
    declaredCapacity: hostel.capacity,
    occupancyRate: configuredBeds
      ? Math.round((allottedBeds / configuredBeds) * 100)
      : 0,
  };
};
