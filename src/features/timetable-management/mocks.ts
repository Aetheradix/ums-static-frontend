// ============================================================
//  Timetable Management — Types & Mock Data
//  Static prototype data for academic scheduling.
// ============================================================

export type SessionStatus = 'Active' | 'Draft';
export type TimetableStatus = 'Draft' | 'Generated' | 'Conflict' | 'Published';
export type ClashSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ClashStatus = 'Detected' | 'Resolved' | 'Under Review';
export type ClashType = 'Faculty' | 'Room' | 'Section' | 'Equipment';
export type SubstitutionStatus = 'Under Review' | 'Approved' | 'Rejected';
export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const WEEK_DAYS: WeekDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface Session {
  id: number;
  name: string;
  code: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  periodsPerDay: number;
  examWindowStart?: string;
  examWindowEnd?: string;
  status: SessionStatus;
  remarks?: string;
}

export interface TimeSlot {
  id: number;
  period: number;
  label: string;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  department: string;
}

export interface Section {
  id: number;
  name: string;
  program: string;
  semester: number;
  strength: number;
}

export interface Faculty {
  id: number;
  name: string;
  code: string;
  department: string;
  designation: string;
}

export interface Room {
  id: number;
  name: string;
  code: string;
  type: 'Lecture Hall' | 'Lab' | 'Seminar Room' | 'Auditorium';
  capacity: number;
}

export interface TimetableEntry {
  id: number;
  day: WeekDay;
  period: number;
  timeLabel: string;
  courseId: number;
  courseName: string;
  sectionId: number;
  sectionName: string;
  facultyId: number;
  facultyName: string;
  roomId: number;
  roomName: string;
}

export interface Timetable {
  id: number;
  name: string;
  sectionName: string;
  sessionName: string;
  classesCount: number;
  generatedOn: string;
  status: TimetableStatus;
}

export interface Clash {
  id: number;
  code: string;
  type: ClashType;
  description: string;
  day: WeekDay;
  timeLabel: string;
  severity: ClashSeverity;
  status: ClashStatus;
  resolution?: string;
}

export interface Substitution {
  id: number;
  requestedBy: string;
  courseName: string;
  sectionName: string;
  day: WeekDay;
  timeLabel: string;
  substituteName: string;
  reason: string;
  requestedOn: string;
  status: SubstitutionStatus;
}

export interface ExamSlot {
  id: number;
  courseCode: string;
  courseName: string;
  sectionName: string;
  date: string;
  timeLabel: string;
  roomName: string;
  duration: string;
}

// ─── Sessions ───────────────────────────────────────────────────────────────

export const sessions: Session[] = [
  {
    id: 1,
    name: 'Odd Semester 2024-25',
    code: 'ODD-2425',
    academicYear: '2024-2025',
    startDate: '15 Jul 2024',
    endDate: '30 Nov 2024',
    periodsPerDay: 8,
    examWindowStart: '02 Dec 2024',
    examWindowEnd: '20 Dec 2024',
    status: 'Active',
    remarks: 'Regular working days Monday to Saturday.',
  },
  {
    id: 2,
    name: 'Even Semester 2024-25',
    code: 'EVN-2425',
    academicYear: '2024-2025',
    startDate: '02 Jan 2025',
    endDate: '15 May 2025',
    periodsPerDay: 8,
    examWindowStart: '20 May 2025',
    examWindowEnd: '05 Jun 2025',
    status: 'Draft',
    remarks: 'Draft schedule pending Academic Council approval.',
  },
  {
    id: 3,
    name: 'Summer Term 2025',
    code: 'SUM-25',
    academicYear: '2024-2025',
    startDate: '10 Jun 2025',
    endDate: '15 Jul 2025',
    periodsPerDay: 6,
    status: 'Draft',
    remarks: 'Backlog and improvement courses only.',
  },
];

// ─── Time Slots (Periods) ───────────────────────────────────────────────────

export const timeSlots: TimeSlot[] = [
  { id: 1, period: 1, label: 'P1', startTime: '09:00', endTime: '09:55' },
  { id: 2, period: 2, label: 'P2', startTime: '09:55', endTime: '10:50' },
  { id: 3, period: 3, label: 'P3', startTime: '11:05', endTime: '12:00' },
  { id: 4, period: 4, label: 'P4', startTime: '12:00', endTime: '12:55' },
  { id: 5, period: 5, label: 'P5', startTime: '13:45', endTime: '14:40' },
  { id: 6, period: 6, label: 'P6', startTime: '14:40', endTime: '15:35' },
  { id: 7, period: 7, label: 'P7', startTime: '15:50', endTime: '16:45' },
  { id: 8, period: 8, label: 'P8', startTime: '16:45', endTime: '17:40' },
];

// ─── Courses ────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: 1,
    code: 'CS301',
    name: 'Data Structures',
    credits: 4,
    department: 'Computer Science',
  },
  {
    id: 2,
    code: 'CS302',
    name: 'Operating Systems',
    credits: 4,
    department: 'Computer Science',
  },
  {
    id: 3,
    code: 'CS303',
    name: 'Database Systems',
    credits: 3,
    department: 'Computer Science',
  },
  {
    id: 4,
    code: 'CS304',
    name: 'Computer Networks',
    credits: 3,
    department: 'Computer Science',
  },
  {
    id: 5,
    code: 'MA201',
    name: 'Discrete Mathematics',
    credits: 4,
    department: 'Mathematics',
  },
  {
    id: 6,
    code: 'CS305',
    name: 'Software Engineering',
    credits: 3,
    department: 'Computer Science',
  },
  {
    id: 7,
    code: 'CS306',
    name: 'Data Structures Lab',
    credits: 2,
    department: 'Computer Science',
  },
  {
    id: 8,
    code: 'HU101',
    name: 'Professional Communication',
    credits: 2,
    department: 'Humanities',
  },
];

// ─── Sections ───────────────────────────────────────────────────────────────

export const sections: Section[] = [
  { id: 1, name: 'CSE-3A', program: 'B.Tech CSE', semester: 3, strength: 60 },
  { id: 2, name: 'CSE-3B', program: 'B.Tech CSE', semester: 3, strength: 58 },
  { id: 3, name: 'CSE-5A', program: 'B.Tech CSE', semester: 5, strength: 55 },
  { id: 4, name: 'IT-3A', program: 'B.Tech IT', semester: 3, strength: 52 },
];

// ─── Faculty ────────────────────────────────────────────────────────────────

export const faculty: Faculty[] = [
  {
    id: 1,
    name: 'Dr. A. Nair',
    code: 'FAC-101',
    department: 'Computer Science',
    designation: 'Professor',
  },
  {
    id: 2,
    name: 'Dr. S. Rao',
    code: 'FAC-102',
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
  {
    id: 3,
    name: 'Prof. M. Iyer',
    code: 'FAC-103',
    department: 'Computer Science',
    designation: 'Assistant Professor',
  },
  {
    id: 4,
    name: 'Dr. P. Menon',
    code: 'FAC-104',
    department: 'Mathematics',
    designation: 'Professor',
  },
  {
    id: 5,
    name: 'Prof. K. Das',
    code: 'FAC-105',
    department: 'Computer Science',
    designation: 'Assistant Professor',
  },
  {
    id: 6,
    name: 'Ms. R. Kapoor',
    code: 'FAC-106',
    department: 'Humanities',
    designation: 'Lecturer',
  },
];

// ─── Rooms ──────────────────────────────────────────────────────────────────

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Lecture Hall 1',
    code: 'LH-1',
    type: 'Lecture Hall',
    capacity: 70,
  },
  {
    id: 2,
    name: 'Lecture Hall 2',
    code: 'LH-2',
    type: 'Lecture Hall',
    capacity: 70,
  },
  {
    id: 3,
    name: 'Seminar Room A',
    code: 'SR-A',
    type: 'Seminar Room',
    capacity: 40,
  },
  { id: 4, name: 'Computer Lab 1', code: 'LAB-1', type: 'Lab', capacity: 60 },
  { id: 5, name: 'Computer Lab 2', code: 'LAB-2', type: 'Lab', capacity: 60 },
  {
    id: 6,
    name: 'Main Auditorium',
    code: 'AUD-1',
    type: 'Auditorium',
    capacity: 200,
  },
];

// ─── Timetable Entries ──────────────────────────────────────────────────────

export const timetableEntries: TimetableEntry[] = [
  {
    id: 1,
    day: 'Monday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 1,
    courseName: 'Data Structures',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 1,
    facultyName: 'Dr. A. Nair',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 2,
    day: 'Monday',
    period: 2,
    timeLabel: '09:55 - 10:50',
    courseId: 5,
    courseName: 'Discrete Mathematics',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 4,
    facultyName: 'Dr. P. Menon',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 3,
    day: 'Monday',
    period: 3,
    timeLabel: '11:05 - 12:00',
    courseId: 2,
    courseName: 'Operating Systems',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 2,
    facultyName: 'Dr. S. Rao',
    roomId: 2,
    roomName: 'Lecture Hall 2',
  },
  {
    id: 4,
    day: 'Tuesday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 3,
    courseName: 'Database Systems',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 3,
    facultyName: 'Prof. M. Iyer',
    roomId: 3,
    roomName: 'Seminar Room A',
  },
  {
    id: 5,
    day: 'Tuesday',
    period: 2,
    timeLabel: '09:55 - 10:50',
    courseId: 1,
    courseName: 'Data Structures',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 1,
    facultyName: 'Dr. A. Nair',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 6,
    day: 'Tuesday',
    period: 5,
    timeLabel: '13:45 - 14:40',
    courseId: 7,
    courseName: 'Data Structures Lab',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 5,
    facultyName: 'Prof. K. Das',
    roomId: 4,
    roomName: 'Computer Lab 1',
  },
  {
    id: 7,
    day: 'Wednesday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 2,
    courseName: 'Operating Systems',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 2,
    facultyName: 'Dr. S. Rao',
    roomId: 2,
    roomName: 'Lecture Hall 2',
  },
  {
    id: 8,
    day: 'Wednesday',
    period: 3,
    timeLabel: '11:05 - 12:00',
    courseId: 6,
    courseName: 'Software Engineering',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 3,
    facultyName: 'Prof. M. Iyer',
    roomId: 3,
    roomName: 'Seminar Room A',
  },
  {
    id: 9,
    day: 'Wednesday',
    period: 4,
    timeLabel: '12:00 - 12:55',
    courseId: 8,
    courseName: 'Professional Communication',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 6,
    facultyName: 'Ms. R. Kapoor',
    roomId: 3,
    roomName: 'Seminar Room A',
  },
  {
    id: 10,
    day: 'Thursday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 4,
    courseName: 'Computer Networks',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 2,
    facultyName: 'Dr. S. Rao',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 11,
    day: 'Thursday',
    period: 2,
    timeLabel: '09:55 - 10:50',
    courseId: 3,
    courseName: 'Database Systems',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 3,
    facultyName: 'Prof. M. Iyer',
    roomId: 2,
    roomName: 'Lecture Hall 2',
  },
  {
    id: 12,
    day: 'Thursday',
    period: 5,
    timeLabel: '13:45 - 14:40',
    courseId: 5,
    courseName: 'Discrete Mathematics',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 4,
    facultyName: 'Dr. P. Menon',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 13,
    day: 'Friday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 1,
    courseName: 'Data Structures',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 1,
    facultyName: 'Dr. A. Nair',
    roomId: 1,
    roomName: 'Lecture Hall 1',
  },
  {
    id: 14,
    day: 'Friday',
    period: 3,
    timeLabel: '11:05 - 12:00',
    courseId: 6,
    courseName: 'Software Engineering',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 3,
    facultyName: 'Prof. M. Iyer',
    roomId: 2,
    roomName: 'Lecture Hall 2',
  },
  {
    id: 15,
    day: 'Friday',
    period: 5,
    timeLabel: '13:45 - 14:40',
    courseId: 4,
    courseName: 'Computer Networks',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 2,
    facultyName: 'Dr. S. Rao',
    roomId: 3,
    roomName: 'Seminar Room A',
  },
  {
    id: 16,
    day: 'Saturday',
    period: 1,
    timeLabel: '09:00 - 09:55',
    courseId: 7,
    courseName: 'Data Structures Lab',
    sectionId: 1,
    sectionName: 'CSE-3A',
    facultyId: 5,
    facultyName: 'Prof. K. Das',
    roomId: 5,
    roomName: 'Computer Lab 2',
  },
];

// ─── Timetables ─────────────────────────────────────────────────────────────

export const timetables: Timetable[] = [
  {
    id: 1,
    name: 'CSE-3A — Odd 2024-25',
    sectionName: 'CSE-3A',
    sessionName: 'Odd Semester 2024-25',
    classesCount: 30,
    generatedOn: '10 Jul 2024',
    status: 'Published',
  },
  {
    id: 2,
    name: 'CSE-3B — Odd 2024-25',
    sectionName: 'CSE-3B',
    sessionName: 'Odd Semester 2024-25',
    classesCount: 28,
    generatedOn: '10 Jul 2024',
    status: 'Published',
  },
  {
    id: 3,
    name: 'CSE-5A — Odd 2024-25',
    sectionName: 'CSE-5A',
    sessionName: 'Odd Semester 2024-25',
    classesCount: 27,
    generatedOn: '11 Jul 2024',
    status: 'Conflict',
  },
  {
    id: 4,
    name: 'IT-3A — Odd 2024-25',
    sectionName: 'IT-3A',
    sessionName: 'Odd Semester 2024-25',
    classesCount: 26,
    generatedOn: '11 Jul 2024',
    status: 'Generated',
  },
  {
    id: 5,
    name: 'CSE-3A — Even 2024-25',
    sectionName: 'CSE-3A',
    sessionName: 'Even Semester 2024-25',
    classesCount: 29,
    generatedOn: '28 Dec 2024',
    status: 'Draft',
  },
];

// ─── Clashes ────────────────────────────────────────────────────────────────

export const clashes: Clash[] = [
  {
    id: 1,
    code: 'CLH-001',
    type: 'Faculty',
    description: 'Dr. S. Rao assigned to two sections at the same period.',
    day: 'Monday',
    timeLabel: '11:05 - 12:00',
    severity: 'Critical',
    status: 'Detected',
  },
  {
    id: 2,
    code: 'CLH-002',
    type: 'Room',
    description: 'Lecture Hall 1 double-booked for CSE-3A and CSE-5A.',
    day: 'Tuesday',
    timeLabel: '09:00 - 09:55',
    severity: 'High',
    status: 'Detected',
  },
  {
    id: 3,
    code: 'CLH-003',
    type: 'Section',
    description: 'CSE-3A has overlapping lecture and lab in the same slot.',
    day: 'Wednesday',
    timeLabel: '13:45 - 14:40',
    severity: 'Medium',
    status: 'Under Review',
  },
  {
    id: 4,
    code: 'CLH-004',
    type: 'Equipment',
    description: 'Projector required in two seminar rooms simultaneously.',
    day: 'Thursday',
    timeLabel: '11:05 - 12:00',
    severity: 'Low',
    status: 'Resolved',
    resolution: 'Moved SE lecture to Lecture Hall 2.',
  },
  {
    id: 5,
    code: 'CLH-005',
    type: 'Faculty',
    description: 'Prof. M. Iyer over-allocated beyond weekly load limit.',
    day: 'Friday',
    timeLabel: '11:05 - 12:00',
    severity: 'High',
    status: 'Detected',
  },
  {
    id: 6,
    code: 'CLH-006',
    type: 'Room',
    description: 'Computer Lab 1 capacity exceeded for merged sections.',
    day: 'Tuesday',
    timeLabel: '13:45 - 14:40',
    severity: 'Medium',
    status: 'Resolved',
    resolution: 'Split batch across Lab 1 and Lab 2.',
  },
];

// ─── Substitutions ──────────────────────────────────────────────────────────

export const substitutions: Substitution[] = [
  {
    id: 1,
    requestedBy: 'Dr. A. Nair',
    courseName: 'Data Structures',
    sectionName: 'CSE-3A',
    day: 'Monday',
    timeLabel: '09:00 - 09:55',
    substituteName: 'Prof. K. Das',
    reason: 'Attending FDP at another campus.',
    requestedOn: '05 Aug 2024',
    status: 'Approved',
  },
  {
    id: 2,
    requestedBy: 'Dr. S. Rao',
    courseName: 'Operating Systems',
    sectionName: 'CSE-3A',
    day: 'Wednesday',
    timeLabel: '09:00 - 09:55',
    substituteName: 'Prof. M. Iyer',
    reason: 'Medical leave.',
    requestedOn: '12 Aug 2024',
    status: 'Under Review',
  },
  {
    id: 3,
    requestedBy: 'Prof. M. Iyer',
    courseName: 'Database Systems',
    sectionName: 'CSE-3A',
    day: 'Tuesday',
    timeLabel: '09:00 - 09:55',
    substituteName: 'Dr. S. Rao',
    reason: 'Conference presentation.',
    requestedOn: '18 Aug 2024',
    status: 'Rejected',
  },
];

// ─── Exam Schedule ──────────────────────────────────────────────────────────

export const examSchedule: ExamSlot[] = [
  {
    id: 1,
    courseCode: 'CS301',
    courseName: 'Data Structures',
    sectionName: 'CSE-3A',
    date: '03 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Main Auditorium',
    duration: '3 hrs',
  },
  {
    id: 2,
    courseCode: 'CS302',
    courseName: 'Operating Systems',
    sectionName: 'CSE-3A',
    date: '06 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Main Auditorium',
    duration: '3 hrs',
  },
  {
    id: 3,
    courseCode: 'CS303',
    courseName: 'Database Systems',
    sectionName: 'CSE-3A',
    date: '09 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Lecture Hall 1',
    duration: '3 hrs',
  },
  {
    id: 4,
    courseCode: 'CS304',
    courseName: 'Computer Networks',
    sectionName: 'CSE-3A',
    date: '12 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Lecture Hall 1',
    duration: '3 hrs',
  },
  {
    id: 5,
    courseCode: 'MA201',
    courseName: 'Discrete Mathematics',
    sectionName: 'CSE-3A',
    date: '15 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Lecture Hall 2',
    duration: '3 hrs',
  },
  {
    id: 6,
    courseCode: 'CS305',
    courseName: 'Software Engineering',
    sectionName: 'CSE-3A',
    date: '18 Dec 2024',
    timeLabel: '10:00 - 13:00',
    roomName: 'Lecture Hall 2',
    duration: '3 hrs',
  },
  {
    id: 7,
    courseCode: 'HU101',
    courseName: 'Professional Communication',
    sectionName: 'CSE-3A',
    date: '20 Dec 2024',
    timeLabel: '14:00 - 16:00',
    roomName: 'Seminar Room A',
    duration: '2 hrs',
  },
];

// ─── Status → StatusBadge variant mapper ────────────────────────────────────

export function statusVariant(
  status: string
): 'success' | 'danger' | 'warning' | 'muted' | 'info' | 'neutral' {
  switch (status) {
    case 'Published':
    case 'Resolved':
    case 'Active':
    case 'Approved':
      return 'success';
    case 'Conflict':
    case 'Critical':
    case 'Detected':
    case 'Rejected':
      return 'danger';
    case 'Generated':
    case 'High':
      return 'warning';
    case 'Draft':
    case 'Medium':
      return 'muted';
    case 'Low':
    case 'Under Review':
      return 'info';
    default:
      return 'neutral';
  }
}
