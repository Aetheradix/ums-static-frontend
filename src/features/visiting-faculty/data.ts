import type {
  Application,
  ApplicationStatus,
  Bill,
  DailyLog,
  Department,
  RateMaster,
  TeachingSession,
} from './types';
import { makeUniqueId } from './utils';

// ── Masters ────────────────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  { code: 'IET', name: 'Institute of Engineering & Technology' },
  { code: 'IIPS', name: 'International Institute of Professional Studies' },
  { code: 'IMS', name: 'Institute of Management Studies' },
  {
    code: 'SCSIT',
    name: 'School of Computer Science & Information Technology',
  },
  { code: 'SOC', name: 'School of Commerce' },
  { code: 'SOE', name: 'School of Economics' },
];

export const deptName = (code: string) =>
  DEPARTMENTS.find(d => d.code === code)?.name ?? code;

const opts = (values: string[]) => values.map(v => ({ id: v, text: v }));

export const QUALIFICATION_OPTIONS = opts([
  'B.E. / B.Tech',
  'M.E. / M.Tech',
  'MCA',
  'M.Sc',
  'MBA',
  'M.Com',
  'M.A.',
  'Ph.D.',
  'NET',
  'SET',
  'GATE',
]);

export const PROGRAM_OPTIONS = opts([
  'B.E.',
  'M.Tech',
  'MCA',
  'MBA',
  'M.Sc',
  'B.Com',
  'BBA',
  'Integrated MBA',
]);

export const BRANCH_OPTIONS = opts([
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electronics & Instrumentation',
  'Mechanical Engineering',
  'Civil Engineering',
  'Management',
  'Commerce',
]);

export const YEAR_OPTIONS = opts([
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
]);

export const SESSION_OPTIONS = opts(['2025-2026', '2026-2027', '2027-2028']);

export const SEMESTER_OPTIONS = opts(['Odd', 'Even']);

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(d => ({
  id: d.code,
  text: `${d.code} — ${d.name}`,
}));

export const DEFAULT_RATES: RateMaster = {
  theoryRate: 400,
  practicalRate: 800,
  limit: 30000,
};

// ── Seed applications ──────────────────────────────────────────

let appSeq = 0;

function app(
  department: string,
  fullName: string,
  pan: string,
  status: ApplicationStatus,
  extra: Partial<Application> = {}
): Application {
  appSeq++;
  const first = fullName
    .replace(/^(Dr|Prof)\.?\s+/i, '')
    .split(' ')[0]
    .toLowerCase();
  return {
    id: `app-${appSeq}`,
    applicationNo: `VF26-${department}-${String(appSeq).padStart(4, '0')}`,
    submittedOn: '2026-07-10',
    department,
    fullName,
    mobile: `98${String(26000000 + appSeq * 7919).slice(0, 8)}`,
    email: `${first}.vf@example.com`,
    address: 'Indore, Madhya Pradesh',
    qualifications: ['M.E. / M.Tech'],
    designation: 'Visiting Faculty',
    dateOfAppointment: '2026-07-15',
    pan,
    aadhar: `4${String(10000000000 + appSeq * 104729).slice(0, 11)}`,
    session: '2026-2027',
    semester: 'Odd',
    programs: ['B.E.'],
    branches: ['Computer Engineering'],
    years: ['2nd Year'],
    subjects: ['CER4C1', 'CER4C2'],
    labs: ['CER4L1'],
    theoryHoursPerWeek: 4,
    practicalHoursPerWeek: 2,
    resume: `${first}_resume.pdf`,
    qualificationDocument: `${first}_degree.pdf`,
    status,
    ...extra,
  };
}

const joined = (on: string, rank: number): Partial<Application> => ({
  verifiedOn: '2026-07-14',
  interview: {
    date: '2026-07-20',
    time: '11:00',
    venue: 'Committee Room',
    committee: 'HoD, Senior Professor, Subject Expert',
    result: 'Finalised',
    marks: 80,
  },
  meritRank: rank,
  forwardedOn: '2026-07-22',
  joinedOn: on,
});

export const SEED_APPLICATIONS: Application[] = [
  // Joined — Dr. Rahul Sharma teaches in three UTDs under one Unique ID.
  app('IET', 'Dr. Rahul Sharma', 'ABCPS1234F', 'Joined', {
    ...joined('2026-07-25', 1),
    qualifications: ['M.E. / M.Tech', 'Ph.D.'],
    subjects: ['CER5C3', 'ITR5C1'],
    labs: ['CER5L3'],
  }),
  app('IIPS', 'Dr. Rahul Sharma', 'ABCPS1234F', 'Joined', {
    ...joined('2026-07-28', 1),
    qualifications: ['M.E. / M.Tech', 'Ph.D.'],
    programs: ['MCA'],
    branches: ['Information Technology'],
    subjects: ['MCA-302', 'MCA-305'],
    labs: ['MCA-L31'],
  }),
  app('IMS', 'Dr. Rahul Sharma', 'ABCPS1234F', 'Joined', {
    ...joined('2026-08-01', 2),
    qualifications: ['M.E. / M.Tech', 'Ph.D.'],
    programs: ['MBA'],
    branches: ['Management'],
    subjects: ['MBA-IT-204'],
    labs: ['MBA-L21'],
  }),
  app('IET', 'Priya Verma', 'BQXPV5678K', 'Joined', {
    ...joined('2026-07-25', 2),
    qualifications: ['M.E. / M.Tech', 'NET'],
    branches: ['Electronics & Telecommunication'],
    subjects: ['ETR3C1', 'ETR3C4'],
    labs: ['ETR3L1', 'ETR3L4'],
  }),
  app('IIPS', 'Prof. Anil Kumar Jain', 'CJKPJ4321L', 'Joined', {
    ...joined('2026-07-28', 2),
    qualifications: ['MCA', 'Ph.D.'],
    programs: ['MCA'],
    branches: ['Information Technology'],
    subjects: ['MCA-101', 'MCA-104'],
    labs: ['MCA-L11'],
  }),
  app('IET', 'Neha Joshi', 'DLMPJ9087Q', 'Joined', {
    ...joined('2026-07-25', 3),
    branches: ['Information Technology'],
    subjects: ['ITR3C2'],
    labs: ['ITR3L2'],
  }),
  app('SCSIT', 'Neha Joshi', 'DLMPJ9087Q', 'Joined', {
    ...joined('2026-08-02', 1),
    programs: ['M.Sc'],
    branches: ['Information Technology'],
    subjects: ['MSC-CS-301'],
    labs: ['MSC-CS-L3'],
  }),

  // IET pipeline — one application at every stage.
  app('IET', 'Amit Patel', 'AXZPP4410M', 'Submitted', {
    submittedOn: '2026-10-06',
    qualifications: ['M.E. / M.Tech', 'GATE'],
    subjects: ['CER3C1', 'CER3C3'],
    labs: ['CER3L1'],
  }),
  app('IET', 'Sneha Kulkarni', 'BKLPK7781D', 'Submitted', {
    submittedOn: '2026-10-07',
    branches: ['Civil Engineering'],
    subjects: ['CVR5C2'],
    labs: ['CVR5L2'],
  }),
  // Already joined elsewhere — same PAN, so the same Unique ID on joining.
  app('SCSIT', 'Dr. Rahul Sharma', 'ABCPS1234F', 'Submitted', {
    submittedOn: '2026-10-08',
    qualifications: ['M.E. / M.Tech', 'Ph.D.'],
    programs: ['M.Sc'],
    subjects: ['MSC-CS-305'],
  }),
  app('IET', 'Vikram Singh', 'CVBPS2299H', 'In Scrutiny List', {
    submittedOn: '2026-09-28',
    verifiedOn: '2026-10-01',
    branches: ['Mechanical Engineering'],
    subjects: ['MER3C2'],
    labs: ['MER3L2'],
  }),
  app('IET', 'Rohit Mehta', 'DPLPM6620J', 'Interview Scheduled', {
    submittedOn: '2026-09-25',
    verifiedOn: '2026-09-29',
    interview: {
      date: '2026-10-12',
      time: '11:00',
      venue: 'IET Committee Room, Khandwa Road',
      committee: 'HoD (CE), Prof. S. Tokekar, Subject Expert',
    },
  }),
  app('IET', 'Kavita Rao', 'EKRPR3345A', 'In Merit List', {
    submittedOn: '2026-09-20',
    verifiedOn: '2026-09-22',
    qualifications: ['M.E. / M.Tech', 'Ph.D.'],
    interview: {
      date: '2026-10-03',
      time: '11:00',
      venue: 'IET Committee Room, Khandwa Road',
      committee: 'HoD (CE), Prof. S. Tokekar, Subject Expert',
      result: 'Finalised',
      marks: 84,
      remarks: 'Strong subject knowledge, good communication.',
    },
  }),
  app('IET', 'Manish Tiwari', 'FMTPT8812C', 'In Merit List', {
    submittedOn: '2026-09-20',
    verifiedOn: '2026-09-22',
    branches: ['Information Technology'],
    interview: {
      date: '2026-10-03',
      time: '12:00',
      venue: 'IET Committee Room, Khandwa Road',
      committee: 'HoD (CE), Prof. S. Tokekar, Subject Expert',
      result: 'Finalised',
      marks: 76,
    },
  }),
  app('IET', 'Arjun Yadav', 'GAYPY1177E', 'Not Selected', {
    submittedOn: '2026-09-20',
    verifiedOn: '2026-09-22',
    interview: {
      date: '2026-10-03',
      time: '13:00',
      venue: 'IET Committee Room, Khandwa Road',
      committee: 'HoD (CE), Prof. S. Tokekar, Subject Expert',
      result: 'Not Selected',
      marks: 48,
      remarks: 'Did not meet the subject requirement.',
    },
  }),
  app('IET', 'Deepak Chouhan', 'HDCPC5521K', 'Pending Approval', {
    submittedOn: '2026-09-10',
    verifiedOn: '2026-09-12',
    interview: {
      date: '2026-09-24',
      time: '11:00',
      venue: 'IET Committee Room, Khandwa Road',
      committee: 'HoD (ME), Subject Expert',
      result: 'Finalised',
      marks: 79,
    },
    meritRank: 1,
    forwardedOn: '2026-09-26',
    branches: ['Mechanical Engineering'],
  }),
  app('IET', 'Pooja Saxena', 'JPSPS9902L', 'Rejected', {
    submittedOn: '2026-09-18',
    rejectionReason:
      'Post-graduate degree not in the relevant subject; experience certificate missing.',
  }),

  // Other UTDs
  app('IIPS', 'Sunita Gupta', 'KSGPG4456N', 'Pending Approval', {
    submittedOn: '2026-09-08',
    verifiedOn: '2026-09-10',
    interview: {
      date: '2026-09-22',
      time: '10:30',
      venue: 'IIPS Board Room',
      committee: 'Director IIPS, Subject Expert',
      result: 'Finalised',
      marks: 81,
    },
    meritRank: 1,
    forwardedOn: '2026-09-25',
    programs: ['MCA'],
    branches: ['Information Technology'],
    subjects: ['MCA-201'],
  }),
  app('IIPS', 'Ravi Dubey', 'LRDPD3321P', 'Submitted', {
    submittedOn: '2026-10-05',
    programs: ['MBA'],
    branches: ['Management'],
  }),
];

// ── Seed mobile-app logs ───────────────────────────────────────

const TOPICS = [
  'Introduction & course outline',
  'Unit 1 — fundamentals',
  'Unit 1 — problem solving',
  'Unit 2 — core concepts',
  'Unit 2 — case study',
  'Unit 3 — design techniques',
  'Unit 3 — tutorial',
  'Unit 4 — applications',
  'Revision & doubt session',
];

let logSeq = 0;

/**
 * Spread a theory/practical count over the working days (Mon–Sat) of a
 * month — up to 2 theory and 1 practical a day, starting at `startDay`.
 */
function logsFor(
  uniqueId: string,
  department: string,
  period: string,
  theory: number,
  practical: number,
  subjects: string[],
  labs: string[],
  status: DailyLog['status'],
  startDay = 1,
  lastDay = 30
): DailyLog[] {
  const [y, m] = period.split('-').map(Number);
  const logs: DailyLog[] = [];
  let t = theory;
  let p = practical;
  for (let d = startDay; d <= lastDay && (t > 0 || p > 0); d++) {
    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1 || date.getDay() === 0) continue;
    const sessions: TeachingSession[] = [];
    for (let i = 0; i < 2 && t > 0; i++, t--) {
      sessions.push({
        type: 'Theory',
        subject: subjects[(d + i) % subjects.length],
        program: 'B.E.',
        topic: TOPICS[(d + i) % TOPICS.length],
        time: i === 0 ? '10:00' : '11:00',
      });
    }
    if (p > 0) {
      sessions.push({
        type: 'Practical',
        subject: labs[d % labs.length],
        program: 'B.E.',
        topic: 'Lab experiment & viva',
        time: '14:00',
      });
      p--;
    }
    logSeq++;
    logs.push({
      id: `log-${logSeq}`,
      uniqueId,
      department,
      date: `${period}-${String(d).padStart(2, '0')}`,
      checkIn: `09:${String(30 + (d % 25)).padStart(2, '0')}`,
      location: `${department} campus, DAVV — geo-verified`,
      sessions,
      status,
    });
  }
  return logs;
}

const RAHUL = makeUniqueId('Dr. Rahul Sharma', 'ABCPS1234F');
const PRIYA = makeUniqueId('Priya Verma', 'BQXPV5678K');
const ANIL = makeUniqueId('Prof. Anil Kumar Jain', 'CJKPJ4321L');
const NEHA = makeUniqueId('Neha Joshi', 'DLMPJ9087Q');

export const SEED_LOGS: DailyLog[] = [
  // September 2026 — verified by the departments, ready to bill.
  ...logsFor(
    RAHUL,
    'IET',
    '2026-09',
    20,
    5,
    ['CER5C3', 'ITR5C1'],
    ['CER5L3'],
    'Verified'
  ),
  ...logsFor(
    RAHUL,
    'IIPS',
    '2026-09',
    25,
    5,
    ['MCA-302', 'MCA-305'],
    ['MCA-L31'],
    'Verified'
  ),
  ...logsFor(
    RAHUL,
    'IMS',
    '2026-09',
    15,
    5,
    ['MBA-IT-204'],
    ['MBA-L21'],
    'Verified'
  ),
  ...logsFor(
    PRIYA,
    'IET',
    '2026-09',
    45,
    20,
    ['ETR3C1', 'ETR3C4'],
    ['ETR3L1', 'ETR3L4'],
    'Verified'
  ),
  ...logsFor(
    ANIL,
    'IIPS',
    '2026-09',
    18,
    6,
    ['MCA-101', 'MCA-104'],
    ['MCA-L11'],
    'Verified'
  ),
  ...logsFor(
    NEHA,
    'IET',
    '2026-09',
    30,
    10,
    ['ITR3C2'],
    ['ITR3L2'],
    'Verified'
  ),
  ...logsFor(
    NEHA,
    'SCSIT',
    '2026-09',
    10,
    4,
    ['MSC-CS-301'],
    ['MSC-CS-L3'],
    'Verified'
  ),
  // October 2026 — fresh from the mobile app, awaiting verification.
  ...logsFor(
    RAHUL,
    'IET',
    '2026-10',
    6,
    2,
    ['CER5C3', 'ITR5C1'],
    ['CER5L3'],
    'Pending',
    1,
    8
  ),
  ...logsFor(
    PRIYA,
    'IET',
    '2026-10',
    8,
    3,
    ['ETR3C1', 'ETR3C4'],
    ['ETR3L1', 'ETR3L4'],
    'Pending',
    1,
    8
  ),
  ...logsFor(
    NEHA,
    'IET',
    '2026-10',
    5,
    2,
    ['ITR3C2'],
    ['ITR3L2'],
    'Pending',
    3,
    8
  ),
  ...logsFor(
    ANIL,
    'IIPS',
    '2026-10',
    6,
    2,
    ['MCA-101', 'MCA-104'],
    ['MCA-L11'],
    'Pending',
    1,
    8
  ),
];

// ── Seed bills — reproduces Example 3 of the flow document ─────

function bill(
  seq: number,
  department: string,
  uniqueId: string,
  facultyName: string,
  theory: number,
  practical: number,
  status: Bill['status'],
  extra: Partial<Bill> = {}
): Bill {
  const days = SEED_LOGS.filter(
    l =>
      l.uniqueId === uniqueId &&
      l.department === department &&
      l.date.startsWith('2026-09')
  ).length;
  return {
    id: `bill-${seq}`,
    billNo: `VFB/${department}/2026-09/${String(seq).padStart(3, '0')}`,
    billDate: '2026-10-01',
    department,
    uniqueId,
    facultyName,
    period: '2026-09',
    daysPresent: days,
    theoryCount: theory,
    practicalCount: practical,
    theoryRate: DEFAULT_RATES.theoryRate,
    practicalRate: DEFAULT_RATES.practicalRate,
    billAmount:
      theory * DEFAULT_RATES.theoryRate +
      practical * DEFAULT_RATES.practicalRate,
    hodCertified: true,
    status,
    ...extra,
  };
}

export const SEED_BILLS: Bill[] = [
  bill(1, 'IET', RAHUL, 'Dr. Rahul Sharma', 20, 5, 'Paid', {
    payable: 12000,
    notPayable: 0,
    paidOn: '2026-10-03',
    transactionRef: 'NEFT/DAVV/0310/1182',
  }),
  bill(2, 'IIPS', RAHUL, 'Dr. Rahul Sharma', 25, 5, 'Paid', {
    payable: 14000,
    notPayable: 0,
    paidOn: '2026-10-05',
    transactionRef: 'NEFT/DAVV/0510/1207',
  }),
  bill(3, 'IMS', RAHUL, 'Dr. Rahul Sharma', 15, 5, 'Sent to Finance', {
    billDate: '2026-10-06',
  }),
  bill(4, 'IET', PRIYA, 'Priya Verma', 45, 20, 'Sent to Finance', {
    billDate: '2026-10-02',
  }),
  bill(5, 'IIPS', ANIL, 'Prof. Anil Kumar Jain', 18, 6, 'Sent to Finance', {
    billDate: '2026-10-04',
  }),
];
