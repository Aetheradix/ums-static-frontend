import type {
  Application,
  ApplicationStatus,
  Bill,
  DailyLog,
  Department,
  FacultyRequirement,
  RateMaster,
  SubjectMaster,
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

export const SEMESTER_NUMBERS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export const SEMESTER_NUMBER_OPTIONS = opts(SEMESTER_NUMBERS);

export const DESIGNATION_OPTIONS = opts([
  'Visiting Faculty',
  'Visiting Professor',
  'Guest Faculty',
  'Industry Expert',
]);

export const SESSION_OPTIONS = opts(['2025-2026', '2026-2027', '2027-2028']);

export const FACULTY_TYPE_OPTIONS = [
  { id: '', text: 'All' },
  { id: 'new', text: 'New Faculty' },
  { id: 'reapply', text: 'Re-apply Faculty' },
];

export const matchesFacultyType = (
  a: { applicationType?: string },
  type: string
) => !type || (type === 'reapply') === (a.applicationType === 'Re-apply');

export const SEMESTER_OPTIONS = [
  { id: 'Odd', text: 'July – Dec' },
  { id: 'Even', text: 'Jan – June' },
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(d => ({
  id: d.code,
  text: `${d.code} — ${d.name}`,
}));

export const DEFAULT_RATES: RateMaster = {
  theoryRate: 400,
  practicalRate: 800,
  limit: 30000,
  approvalThreshold: 50000,
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
    experienceYears: 3 + (appSeq % 12),
    pan,
    aadhar: `4${String(10000000000 + appSeq * 104729).slice(0, 11)}`,
    session: '2026-2027',
    semester: 'Odd',
    programs: ['B.E.'],
    branches: ['Computer Engineering'],
    semesters: ['III'],
    subjects: ['CER4C1', 'CER4C2'],
    labs: ['CER4L1'],
    theoryHoursPerWeek: 4,
    practicalHoursPerWeek: 2,
    resume: `${first}_resume.pdf`,
    qualificationDocument: `${first}_degree.pdf`,
    panCardDocument: `${first}_pan_card.pdf`,
    applicationType: 'New Registration',
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
  joiningDate: addDays(on, 4),
});

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

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
    paidOn: '2026-10-04',
    approvedOn: '2026-10-03',
    transactionRef: 'NEFT/DAVV/0410/1182',
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
  bill(4, 'IET', PRIYA, 'Priya Verma', 45, 20, 'Approved by Registrar & VC', {
    billDate: '2026-10-02',
    approvedOn: '2026-10-03',
  }),
  bill(5, 'IIPS', ANIL, 'Prof. Anil Kumar Jain', 18, 6, 'Sent to Finance', {
    billDate: '2026-10-04',
  }),
];

// ── Bulk sample data ───────────────────────────────────────────
// Enough rows to exercise search, paging and the approval rules: more
// joined faculty with September bills in every state, and a pipeline of
// applications at every stage across the UTDs.

const SUBJECT_PREFIX: Record<
  string,
  { program: string; branch: string; code: string }
> = {
  IET: { program: 'B.E.', branch: 'Computer Engineering', code: 'CER' },
  IIPS: { program: 'MCA', branch: 'Information Technology', code: 'MCA-' },
  IMS: { program: 'MBA', branch: 'Management', code: 'MBA-' },
  SCSIT: { program: 'M.Sc', branch: 'Information Technology', code: 'MSC-CS-' },
  SOC: { program: 'B.Com', branch: 'Commerce', code: 'BCOM-' },
  SOE: { program: 'Integrated MBA', branch: 'Management', code: 'ECO-' },
};

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Deterministic, well-formed PAN for sample data. */
function samplePan(fullName: string, i: number) {
  const surname = fullName.trim().split(' ').pop() ?? 'X';
  const l = (n: number) => LETTERS[n % LETTERS.length];
  const digits = String(1000 + ((i * 7919) % 9000)).padStart(4, '0');
  return `${l(i * 3 + 1)}${l(i * 5 + 7)}${l(i * 11 + 3)}P${surname[0].toUpperCase()}${digits}${l(i * 13 + 5)}`;
}

const codesFor = (dept: string, i: number) => {
  const p = SUBJECT_PREFIX[dept];
  return {
    subjects: [
      `${p.code}${300 + (i % 5) * 10 + 1}`,
      `${p.code}${300 + (i % 5) * 10 + 4}`,
    ],
    labs: [`${p.code}L${30 + (i % 5)}`],
  };
};

interface ExtraFaculty {
  name: string;
  dept: string;
  theory: number;
  practical: number;
  bill?: Bill['status'];
}

const EXTRA_FACULTY: ExtraFaculty[] = [
  // IET — September total above ₹50,000, already approved by Registrar & VC.
  {
    name: 'Dr. Sanjay Tiwari',
    dept: 'IET',
    theory: 22,
    practical: 6,
    bill: 'Approved by Registrar & VC',
  },
  {
    name: 'Ankita Mishra',
    dept: 'IET',
    theory: 18,
    practical: 5,
    bill: 'Approved by Registrar & VC',
  },
  {
    name: 'Rakesh Choudhary',
    dept: 'IET',
    theory: 15,
    practical: 4,
    bill: 'Approved by Registrar & VC',
  },
  {
    name: 'Dr. Meenal Jain',
    dept: 'IET',
    theory: 25,
    practical: 8,
    bill: 'Approved by Registrar & VC',
  },
  // IIPS — verified, not yet billed by the department.
  { name: 'Gaurav Agrawal', dept: 'IIPS', theory: 20, practical: 6 },
  { name: 'Shweta Pandey', dept: 'IIPS', theory: 16, practical: 5 },
  // IMS — at Finance, total above ₹50,000: needs to be forwarded.
  {
    name: 'Dr. Alok Verma',
    dept: 'IMS',
    theory: 26,
    practical: 8,
    bill: 'Sent to Finance',
  },
  {
    name: 'Ritu Malviya',
    dept: 'IMS',
    theory: 20,
    practical: 6,
    bill: 'Sent to Finance',
  },
  {
    name: 'Nitin Rathore',
    dept: 'IMS',
    theory: 24,
    practical: 7,
    bill: 'Sent to Finance',
  },
  // SCSIT — verified, not yet billed.
  { name: 'Dr. Pankaj Dixit', dept: 'SCSIT', theory: 14, practical: 4 },
  { name: 'Swati Bhatnagar', dept: 'SCSIT', theory: 12, practical: 4 },
  // SOC — above ₹50,000, waiting with the Registrar & VC.
  {
    name: 'Mohit Goyal',
    dept: 'SOC',
    theory: 25,
    practical: 6,
    bill: 'Pending Registrar & VC Approval',
  },
  {
    name: 'Dr. Kirti Sharma',
    dept: 'SOC',
    theory: 22,
    practical: 8,
    bill: 'Pending Registrar & VC Approval',
  },
  {
    name: 'Varun Khandelwal',
    dept: 'SOC',
    theory: 18,
    practical: 5,
    bill: 'Pending Registrar & VC Approval',
  },
  {
    name: 'Preeti Soni',
    dept: 'SOC',
    theory: 20,
    practical: 6,
    bill: 'Pending Registrar & VC Approval',
  },
  // SOE — under ₹50,000, Finance pays directly.
  {
    name: 'Dr. Ashok Raghuwanshi',
    dept: 'SOE',
    theory: 15,
    practical: 5,
    bill: 'Sent to Finance',
  },
  {
    name: 'Nidhi Parmar',
    dept: 'SOE',
    theory: 12,
    practical: 4,
    bill: 'Sent to Finance',
  },
];

let billSeq = SEED_BILLS.length;

EXTRA_FACULTY.forEach((f, i) => {
  const pan = samplePan(f.name, i + 100);
  const p = SUBJECT_PREFIX[f.dept];
  const { subjects, labs } = codesFor(f.dept, i);
  SEED_APPLICATIONS.push(
    app(f.dept, f.name, pan, 'Joined', {
      ...joined('2026-08-0' + ((i % 8) + 1), (i % 4) + 1),
      qualifications:
        i % 3 === 0 ? ['M.E. / M.Tech', 'Ph.D.'] : ['M.E. / M.Tech', 'NET'],
      programs: [p.program],
      branches: [p.branch],
      subjects,
      labs,
    })
  );
  const uid = makeUniqueId(f.name, pan);
  SEED_LOGS.push(
    ...logsFor(
      uid,
      f.dept,
      '2026-09',
      f.theory,
      f.practical,
      subjects,
      labs,
      'Verified'
    ),
    ...logsFor(
      uid,
      f.dept,
      '2026-10',
      4 + (i % 3),
      2,
      subjects,
      labs,
      'Pending',
      1 + (i % 3),
      10
    )
  );
  if (f.bill) {
    billSeq++;
    SEED_BILLS.push(
      bill(billSeq, f.dept, uid, f.name, f.theory, f.practical, f.bill, {
        billDate: '2026-10-0' + ((i % 6) + 2),
        ...(f.bill === 'Approved by Registrar & VC'
          ? { approvedOn: '2026-10-03' }
          : {}),
      })
    );
  }
});

// Pipeline — applications at every stage, weighted towards IET.
const FIRST = [
  'Aarti',
  'Abhishek',
  'Akash',
  'Amrita',
  'Anand',
  'Anjali',
  'Arvind',
  'Bhavna',
  'Chetan',
  'Deepika',
  'Devendra',
  'Divya',
  'Harish',
  'Ishita',
  'Jayesh',
  'Kavya',
  'Lokesh',
  'Madhuri',
  'Manoj',
  'Megha',
  'Naveen',
  'Pallavi',
  'Prakash',
  'Rachna',
  'Rajat',
  'Sakshi',
  'Sandeep',
  'Shalini',
  'Sunil',
  'Tanvi',
];
const LAST = [
  'Bhargava',
  'Chouksey',
  'Dubey',
  'Gupta',
  'Joshi',
  'Kushwaha',
  'Mandloi',
  'Nagar',
  'Patidar',
  'Rawat',
  'Saxena',
  'Thakur',
  'Upadhyay',
  'Vyas',
  'Yadav',
];
const PIPE_DEPTS = ['IET', 'IET', 'IIPS', 'IMS', 'IET', 'SCSIT', 'SOC', 'SOE'];
const PIPE_STATUS: ApplicationStatus[] = [
  'Submitted',
  'Submitted',
  'In Scrutiny List',
  'Submitted',
  'Interview Scheduled',
  'In Scrutiny List',
  'Rejected',
  'In Merit List',
  'Pending Approval',
  'Not Selected',
  'In Scrutiny List',
  'Interview Scheduled',
];
const QUALS = [
  ['M.E. / M.Tech'],
  ['M.E. / M.Tech', 'GATE'],
  ['MCA', 'NET'],
  ['MBA'],
  ['M.Sc', 'SET'],
  ['M.Com', 'NET'],
  ['M.E. / M.Tech', 'Ph.D.'],
];
const INTERVIEW_DATES = [
  '2026-10-16',
  '2026-10-17',
  '2026-10-20',
  '2026-10-21',
];
const REJECTIONS = [
  'Post-graduate degree not in the relevant subject.',
  'Highest qualification document not legible.',
  'Experience certificate missing.',
  'PAN and Aadhar names do not match.',
];

for (let i = 0; i < 64; i++) {
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 7 + Math.floor(i / FIRST.length)) % LAST.length]}`;
  const dept = PIPE_DEPTS[i % PIPE_DEPTS.length];
  const status = PIPE_STATUS[i % PIPE_STATUS.length];
  const p = SUBJECT_PREFIX[dept];
  const { subjects, labs } = codesFor(dept, i);
  const day = String((i % 12) + 1).padStart(2, '0');
  const marks = 55 + ((i * 17) % 40);
  const verified = !['Submitted', 'Rejected'].includes(status);
  const interviewed = [
    'In Merit List',
    'Pending Approval',
    'Not Selected',
  ].includes(status);
  SEED_APPLICATIONS.push(
    app(dept, name, samplePan(name, i), status, {
      submittedOn:
        i % 3 === 0
          ? `2026-10-${day}`
          : `2026-09-${String(15 + (i % 14)).padStart(2, '0')}`,
      qualifications: QUALS[i % QUALS.length],
      programs: [p.program],
      branches: [
        i % 4 === 0 && dept === 'IET' ? 'Information Technology' : p.branch,
      ],
      semesters: [SEMESTER_NUMBERS[i % SEMESTER_NUMBERS.length]],
      subjects,
      labs,
      theoryHoursPerWeek: 2 + (i % 4),
      practicalHoursPerWeek: i % 3,
      ...(verified ? { verifiedOn: '2026-10-01' } : {}),
      ...(status === 'Rejected'
        ? { rejectionReason: REJECTIONS[i % REJECTIONS.length] }
        : {}),
      ...(status === 'Interview Scheduled' || interviewed
        ? {
            interview: {
              date: interviewed
                ? '2026-10-06'
                : INTERVIEW_DATES[i % INTERVIEW_DATES.length],
              time: ['10:30', '11:30', '12:30', '14:30'][i % 4],
              venue: `${dept} Committee Room, DAVV`,
              committee: 'HoD, Senior Professor, Subject Expert',
              ...(interviewed
                ? {
                    result:
                      status === 'Not Selected'
                        ? ('Not Selected' as const)
                        : ('Finalised' as const),
                    marks: status === 'Not Selected' ? 40 + (i % 10) : marks,
                    remarks:
                      status === 'Not Selected'
                        ? 'Below the subject requirement.'
                        : 'Good subject knowledge.',
                  }
                : {}),
            },
          }
        : {}),
      ...(status === 'Pending Approval'
        ? { meritRank: (i % 3) + 2, forwardedOn: '2026-10-08' }
        : {}),
    })
  );
}

// ── Finance history — a settled August cycle, more September bills ──

const SEPT_TO_FINANCE: Record<string, Bill['status']> = {
  SCSIT: 'Sent to Finance',
};

EXTRA_FACULTY.forEach((f, i) => {
  const status = SEPT_TO_FINANCE[f.dept];
  if (!status || f.bill) return;
  const uid = makeUniqueId(f.name, samplePan(f.name, i + 100));
  billSeq++;
  SEED_BILLS.push(
    bill(billSeq, f.dept, uid, f.name, f.theory, f.practical, status, {
      billDate: '2026-10-09',
    })
  );
});
billSeq++;
SEED_BILLS.push(
  bill(billSeq, 'SCSIT', NEHA, 'Neha Joshi', 10, 4, 'Sent to Finance', {
    billDate: '2026-10-09',
  })
);

/** Everyone joined before August, with an August bill per UTD. */
const AUGUST: {
  dept: string;
  uid: string;
  name: string;
  t: number;
  p: number;
}[] = [
  { dept: 'IET', uid: RAHUL, name: 'Dr. Rahul Sharma', t: 25, p: 5 },
  { dept: 'IIPS', uid: RAHUL, name: 'Dr. Rahul Sharma', t: 20, p: 5 },
  { dept: 'IMS', uid: RAHUL, name: 'Dr. Rahul Sharma', t: 12, p: 5 },
  { dept: 'IET', uid: PRIYA, name: 'Priya Verma', t: 40, p: 15 },
  { dept: 'IIPS', uid: ANIL, name: 'Prof. Anil Kumar Jain', t: 22, p: 6 },
  { dept: 'IET', uid: NEHA, name: 'Neha Joshi', t: 26, p: 8 },
  { dept: 'SCSIT', uid: NEHA, name: 'Neha Joshi', t: 8, p: 3 },
  ...EXTRA_FACULTY.map((f, i) => ({
    dept: f.dept,
    uid: makeUniqueId(f.name, samplePan(f.name, i + 100)),
    name: f.name,
    t: Math.max(f.theory - 4, 8),
    p: Math.max(f.practical - 1, 2),
  })),
];

const augPaid = new Map<string, number>();
const augTotals = new Map<string, number>();
AUGUST.forEach(a =>
  augTotals.set(
    a.dept,
    (augTotals.get(a.dept) ?? 0) +
      a.t * DEFAULT_RATES.theoryRate +
      a.p * DEFAULT_RATES.practicalRate
  )
);

AUGUST.forEach((a, i) => {
  const amount =
    a.t * DEFAULT_RATES.theoryRate + a.p * DEFAULT_RATES.practicalRate;
  const already = augPaid.get(a.uid) ?? 0;
  const payable = Math.min(amount, Math.max(DEFAULT_RATES.limit - already, 0));
  augPaid.set(a.uid, already + payable);
  const approval =
    (augTotals.get(a.dept) ?? 0) > DEFAULT_RATES.approvalThreshold
      ? {
          sentForApprovalOn: '2026-09-04',
          approvedOn: '2026-09-06',
          approvedBy: 'Registrar & VC Sir',
        }
      : {};
  SEED_BILLS.push({
    id: `bill-aug-${i + 1}`,
    billNo: `VFB/${a.dept}/2026-08/${String(i + 1).padStart(3, '0')}`,
    billDate: '2026-09-02',
    department: a.dept,
    uniqueId: a.uid,
    facultyName: a.name,
    period: '2026-08',
    daysPresent: Math.ceil(a.t / 2),
    theoryCount: a.t,
    practicalCount: a.p,
    theoryRate: DEFAULT_RATES.theoryRate,
    practicalRate: DEFAULT_RATES.practicalRate,
    billAmount: amount,
    hodCertified: true,
    status:
      payable === 0
        ? 'Not Payable'
        : payable < amount
          ? 'Partially Paid'
          : 'Paid',
    payable,
    notPayable: amount - payable,
    paidOn: '2026-09-10',
    transactionRef: `NEFT/DAVV/1009/AUG-${a.dept}`,
    ...approval,
  });
});

// Approval trail on the seeded September batches.
SEED_BILLS.forEach(b => {
  if (b.period !== '2026-09') return;
  if (b.status === 'Pending Registrar & VC Approval')
    b.sentForApprovalOn = '2026-10-07';
  if (b.approvedOn) {
    b.sentForApprovalOn = '2026-10-02';
    b.approvedBy = 'Registrar & VC Sir';
    b.approvalRemarks = 'Approved as per attendance verified by the HoD.';
  }
});

// ── Re-applications and fresh approvals ────────────────────────
// Joined faculty applying again — for another subject in the same UTD, or
// for another UTD — at different stages, so every department screen shows
// both kinds side by side.

const REAPPLY_SEEDS: {
  name: string;
  pan: string;
  dept: string;
  status: ApplicationStatus;
  reapplyFor: NonNullable<Application['reapplyFor']>;
}[] = [
  {
    name: 'Priya Verma',
    pan: 'BQXPV5678K',
    dept: 'IET',
    status: 'Submitted',
    reapplyFor: 'Another Subject',
  },
  {
    name: 'Prof. Anil Kumar Jain',
    pan: 'CJKPJ4321L',
    dept: 'IET',
    status: 'Submitted',
    reapplyFor: 'Another UTD Department',
  },
  {
    name: 'Neha Joshi',
    pan: 'DLMPJ9087Q',
    dept: 'IET',
    status: 'In Scrutiny List',
    reapplyFor: 'Another Subject',
  },
  {
    name: 'Dr. Rahul Sharma',
    pan: 'ABCPS1234F',
    dept: 'IET',
    status: 'Interview Scheduled',
    reapplyFor: 'Another Subject',
  },
  {
    name: 'Prof. Anil Kumar Jain',
    pan: 'CJKPJ4321L',
    dept: 'IMS',
    status: 'In Scrutiny List',
    reapplyFor: 'Another UTD Department',
  },
  {
    name: 'Priya Verma',
    pan: 'BQXPV5678K',
    dept: 'SOC',
    status: 'Pending Approval',
    reapplyFor: 'Another UTD Department',
  },
];

REAPPLY_SEEDS.forEach((r, i) => {
  const earlier = SEED_APPLICATIONS.find(a => a.pan === r.pan);
  const interviewed = ['In Merit List', 'Pending Approval'].includes(r.status);
  SEED_APPLICATIONS.push(
    app(r.dept, r.name, r.pan, r.status, {
      applicationType: 'Re-apply',
      reapplyFor: r.reapplyFor,
      davvExperienceYears: 1,
      mobile: earlier?.mobile,
      email: earlier?.email,
      aadhar: earlier?.aadhar,
      experienceYears: earlier?.experienceYears,
      submittedOn: `2026-10-${String(10 + i).padStart(2, '0')}`,
      semesters: [SEMESTER_NUMBERS[(i + 2) % SEMESTER_NUMBERS.length]],
      subjects: [`CER${500 + i * 10 + 2}`, ''],
      ...(r.status !== 'Submitted' ? { verifiedOn: '2026-10-14' } : {}),
      ...(r.status === 'Interview Scheduled' || interviewed
        ? {
            interview: {
              date: interviewed ? '2026-10-18' : '2026-12-02',
              time: '11:30',
              venue: `${r.dept} Committee Room, DAVV`,
              committee: 'HoD, Senior Professor, Subject Expert',
              ...(interviewed
                ? {
                    result: 'Finalised' as const,
                    marks: 82,
                    remarks: 'Already teaching at DAVV — good feedback.',
                  }
                : {}),
            },
          }
        : {}),
      ...(r.status === 'Pending Approval'
        ? { meritRank: 1, forwardedOn: '2026-10-20' }
        : {}),
    } as Partial<Application>)
  );
});

// Approved by Registrar & VC, joining date not yet entered by the department.
[
  { name: 'Dr. Hemant Bhatt', dept: 'IET', type: 'New Registration' as const },
  { name: 'Kirti Pal', dept: 'IET', type: 'New Registration' as const },
  {
    name: 'Dr. Sunil Mandloi',
    dept: 'IIPS',
    type: 'New Registration' as const,
  },
].forEach((f, i) => {
  const { subjects, labs } = codesFor(f.dept, i + 40);
  SEED_APPLICATIONS.push(
    app(f.dept, f.name, samplePan(f.name, i + 300), 'Joined', {
      ...joined('2026-11-20', i + 1),
      joiningDate: undefined,
      applicationType: f.type,
      subjects,
      labs,
    })
  );
});

// ── HODs — one per branch of each UTD ──────────────────────────
export const DEPT_BRANCHES: Record<string, string[]> = {
  IET: [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Electronics & Instrumentation',
    'Mechanical Engineering',
    'Civil Engineering',
  ],
  IIPS: ['Information Technology', 'Management'],
  IMS: ['Management'],
  SCSIT: ['Information Technology'],
  SOC: ['Commerce'],
  SOE: ['Management'],
};

/** Every HOD login, e.g. "IET — Computer Engineering". */
export const HOD_OPTIONS = Object.entries(DEPT_BRANCHES).flatMap(
  ([dept, branches]) =>
    branches.map(b => ({ id: `${dept}|${b}`, text: `${dept} — ${b} HOD` }))
);

/**
 * The branch (and so the HOD) an application belongs to — the first branch
 * the applicant chose that the UTD offers.
 */
export const hodBranchOf = (a: { department: string; branches: string[] }) =>
  a.branches.find(b => DEPT_BRANCHES[a.department]?.includes(b)) ??
  DEPT_BRANCHES[a.department]?.[0] ??
  a.branches[0];

// ── HOD → UTD Department hand-offs ─────────────────────────────
// Merit lists forwarded by branch HODs and waiting at the UTD, and bills
// prepared by HODs and waiting for the UTD to forward to Finance.

[
  { name: 'Shubham Rathi', branch: 'Computer Engineering', marks: 86 },
  { name: 'Dr. Ritika Jain', branch: 'Computer Engineering', marks: 81 },
  { name: 'Ayush Malviya', branch: 'Information Technology', marks: 79 },
  { name: 'Komal Bhatia', branch: 'Mechanical Engineering', marks: 77 },
].forEach((c, i) => {
  SEED_APPLICATIONS.push(
    app('IET', c.name, samplePan(c.name, i + 500), 'Forwarded to UTD', {
      submittedOn: '2026-10-28',
      verifiedOn: '2026-11-02',
      branches: [c.branch],
      semesters: [SEMESTER_NUMBERS[(i + 3) % SEMESTER_NUMBERS.length]],
      interview: {
        date: '2026-11-12',
        time: '11:00',
        venue: 'IET Committee Room, DAVV',
        committee: `HOD (${c.branch}), Senior Professor, Subject Expert`,
        result: 'Finalised',
        marks: c.marks,
        remarks: 'Recommended by the HOD.',
      },
      meritRank: (i % 2) + 1,
      hodForwardedOn: '2026-11-18',
    })
  );
});

const SENT_TO_UTD = [
  { uid: NEHA, name: 'Neha Joshi', dept: 'IET', t: 30, p: 10 },
  ...EXTRA_FACULTY.map((f, i) => ({ f, i }))
    .filter(({ f }) => f.dept === 'IIPS')
    .slice(0, 1)
    .map(({ f, i }) => ({
      uid: makeUniqueId(f.name, samplePan(f.name, i + 100)),
      name: f.name,
      dept: f.dept,
      t: f.theory,
      p: f.practical,
    })),
];
SENT_TO_UTD.forEach(b => {
  billSeq++;
  SEED_BILLS.push(
    bill(billSeq, b.dept, b.uid, b.name, b.t, b.p, 'Sent to UTD', {
      billDate: '2026-10-12',
      sentToUtdOn: '2026-10-12',
    })
  );
});

// ── Branch-wise sample data (every HOD, every status) ──────────
// Three joined faculty per HOD branch with October and November
// attendance, October bills at every stage of the HOD → UTD → Finance →
// Registrar & VC chain, and a pipeline of applications (new and re-apply)
// at every stage for every branch.

const BRANCH_CODE: Record<string, string> = {
  'IET|Computer Engineering': 'CER',
  'IET|Information Technology': 'ITR',
  'IET|Electronics & Telecommunication': 'ETR',
  'IET|Electronics & Instrumentation': 'EIR',
  'IET|Mechanical Engineering': 'MER',
  'IET|Civil Engineering': 'CVR',
  'IIPS|Information Technology': 'MCA-',
  'IIPS|Management': 'IMBA-',
  'IMS|Management': 'MBA-',
  'SCSIT|Information Technology': 'MSC-CS-',
  'SOC|Commerce': 'BCOM-',
  'SOE|Management': 'ECO-',
};

const BRANCH_PROGRAM: Record<string, string> = {
  IET: 'B.E.',
  IIPS: 'MCA',
  IMS: 'MBA',
  SCSIT: 'M.Sc',
  SOC: 'B.Com',
  SOE: 'Integrated MBA',
};

/** October bill stage of each HOD branch — every stage of the chain is shown. */
const OCT_STAGE: Record<string, Bill['status'] | null> = {
  'IET|Computer Engineering': 'Sent to Finance',
  'IET|Information Technology': 'Sent to UTD',
  'IET|Electronics & Telecommunication': 'Prepared',
  'IET|Electronics & Instrumentation': 'Returned by UTD',
  'IET|Mechanical Engineering': 'Sent to Finance',
  'IET|Civil Engineering': null, // attendance verified — HOD still to prepare
  'IIPS|Information Technology': 'Pending Registrar & VC Approval',
  'IIPS|Management': 'Pending Registrar & VC Approval',
  'IMS|Management': 'Approved by Registrar & VC',
  'SCSIT|Information Technology': 'Paid',
  'SOC|Commerce': 'Sent to Finance',
  'SOE|Management': 'Sent to UTD',
};

const BRANCH_TOPICS = [
  'Unit 1 — introduction and basics',
  'Unit 1 — numericals',
  'Unit 2 — core concepts',
  'Unit 2 — worked examples',
  'Unit 3 — design and analysis',
  'Unit 3 — case study',
  'Unit 4 — applications',
  'Unit 4 — previous year questions',
  'Unit 5 — advanced topics',
  'Class test and discussion',
];

function branchLogs(
  uniqueId: string,
  department: string,
  program: string,
  subjects: string[],
  labs: string[],
  period: string,
  theory: number,
  practical: number,
  status: DailyLog['status'],
  startDay: number,
  lastDay: number,
  seed: number
) {
  // Re-label the generic sessions with this branch's program and topics.
  return logsFor(
    uniqueId,
    department,
    period,
    theory,
    practical,
    subjects,
    labs,
    status,
    startDay,
    lastDay
  ).map((l, n) => ({
    ...l,
    checkIn: `${String(9 + ((n + seed) % 2)).padStart(2, '0')}:${String(5 + ((n * 7 + seed) % 50)).padStart(2, '0')}`,
    sessions: l.sessions.map((s, k) => ({
      ...s,
      program,
      topic:
        s.type === 'Practical'
          ? `Experiment ${((n + k + seed) % 10) + 1} — lab work & viva`
          : BRANCH_TOPICS[(n + k + seed) % BRANCH_TOPICS.length],
    })),
  }));
}

function periodBill(
  id: string,
  period: string,
  department: string,
  branch: string,
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
      l.date.startsWith(period) &&
      l.status === 'Verified'
  ).length;
  const amount =
    theory * DEFAULT_RATES.theoryRate + practical * DEFAULT_RATES.practicalRate;
  return {
    id,
    billNo: `VFB/${department}/${period}/${id.slice(-3)}`,
    billDate: '2026-11-03',
    department,
    branch,
    uniqueId,
    facultyName,
    period,
    daysPresent: days,
    theoryCount: theory,
    practicalCount: practical,
    theoryRate: DEFAULT_RATES.theoryRate,
    practicalRate: DEFAULT_RATES.practicalRate,
    billAmount: amount,
    hodCertified: true,
    status,
    ...extra,
  };
}

const PIPELINE_STAGES: ApplicationStatus[] = [
  'Submitted',
  'Submitted',
  'Rejected',
  'In Scrutiny List',
  'Interview Scheduled',
  'Not Selected',
  'In Merit List',
  'Forwarded to UTD',
  'Pending Approval',
];

let branchSeq = 0;

Object.entries(DEPT_BRANCHES).forEach(([dept, branches]) =>
  branches.forEach(branch => {
    const key = `${dept}|${branch}`;
    const code = BRANCH_CODE[key] ?? 'GEN-';
    const program = BRANCH_PROGRAM[dept] ?? 'B.E.';
    const joinedHere: { uid: string; name: string; pan: string }[] = [];

    // Three joined faculty with Oct + Nov attendance and an October bill.
    for (let k = 0; k < 3; k++) {
      branchSeq++;
      const name = `${k === 0 ? 'Dr. ' : ''}${FIRST[(branchSeq * 7 + 3) % FIRST.length]} ${LAST[(branchSeq * 4 + 1) % LAST.length]}`;
      const pan = samplePan(name, 700 + branchSeq);
      const uid = makeUniqueId(name, pan);
      const subjects = [
        `${code}${300 + k * 10 + 1}`,
        `${code}${300 + k * 10 + 3}`,
      ];
      const labs = [`${code}L${30 + k}`];
      joinedHere.push({ uid, name, pan });
      // Every third branch: the last faculty was just approved — joining date,
      // attendance and bills are still to come.
      const awaiting = k === 2 && branchSeq % 3 === 0;

      SEED_APPLICATIONS.push(
        app(dept, name, pan, 'Joined', {
          ...joined(
            awaiting
              ? '2026-11-21'
              : `2026-09-${String(18 + k).padStart(2, '0')}`,
            k + 1
          ),
          programs: [program],
          branches: [branch],
          semesters: [
            SEMESTER_NUMBERS[(branchSeq + k) % SEMESTER_NUMBERS.length],
          ],
          subjects,
          labs,
          qualifications:
            k === 0 ? ['M.E. / M.Tech', 'Ph.D.'] : ['M.E. / M.Tech', 'NET'],
          experienceYears: 4 + ((branchSeq * 3) % 14),
          ...(awaiting ? { joiningDate: undefined } : {}),
        })
      );

      if (awaiting) continue;

      const t = dept === 'IMS' ? 45 : 16 + ((branchSeq * 3 + k) % 9);
      const p = dept === 'IMS' ? 12 : 4 + ((branchSeq + k) % 4);
      SEED_LOGS.push(
        ...branchLogs(
          uid,
          dept,
          program,
          subjects,
          labs,
          '2026-10',
          t,
          p,
          'Verified',
          1,
          31,
          branchSeq + k
        ),
        ...branchLogs(
          uid,
          dept,
          program,
          subjects,
          labs,
          '2026-11',
          10 + k,
          3,
          'Verified',
          2,
          14,
          branchSeq + k
        ),
        ...branchLogs(
          uid,
          dept,
          program,
          subjects,
          labs,
          '2026-11',
          6 + k,
          2,
          'Pending',
          16,
          26,
          branchSeq + k
        )
      );

      const stage = OCT_STAGE[key];
      if (stage) {
        const paid = stage === 'Paid';
        const amount =
          t * DEFAULT_RATES.theoryRate + p * DEFAULT_RATES.practicalRate;
        SEED_BILLS.push(
          periodBill(
            `bill-oct-${String(branchSeq).padStart(3, '0')}`,
            '2026-10',
            dept,
            branch,
            uid,
            name,
            t,
            p,
            stage,
            {
              ...(stage !== 'Prepared' ? { sentToUtdOn: '2026-11-04' } : {}),
              ...([
                'Sent to Finance',
                'Pending Registrar & VC Approval',
                'Approved by Registrar & VC',
                'Paid',
              ].includes(stage)
                ? { utdForwardedOn: '2026-11-06' }
                : {}),
              ...(stage === 'Returned by UTD'
                ? {
                    utdRemarks:
                      'Practical count does not match the lab register — please recheck.',
                  }
                : {}),
              ...(stage === 'Pending Registrar & VC Approval'
                ? { sentForApprovalOn: '2026-11-10' }
                : {}),
              ...(stage === 'Approved by Registrar & VC'
                ? {
                    sentForApprovalOn: '2026-11-10',
                    approvedOn: '2026-11-14',
                    approvedBy: 'Registrar & VC Sir',
                    approvalRemarks:
                      'Approved. Release as per verified attendance.',
                  }
                : {}),
              ...(paid
                ? {
                    payable: amount,
                    notPayable: 0,
                    paidOn: '2026-11-12',
                    transactionRef: `NEFT/DAVV/1211/${dept}-OCT`,
                  }
                : {}),
            }
          )
        );
      }
    }

    // One November entry rejected by the HOD in each branch.
    const reject = [...SEED_LOGS]
      .reverse()
      .find(l => l.uniqueId === joinedHere[1].uid && l.status === 'Pending');
    if (reject) {
      reject.status = 'Rejected';
      reject.remarks =
        'Not present in the department on this date as per the register.';
    }

    // Applications at every stage — new faculty and re-applications.
    PIPELINE_STAGES.forEach((status, s) => {
      branchSeq++;
      const reapply = s % 3 === 2 && status !== 'Rejected';
      const who = reapply ? joinedHere[s % joinedHere.length] : null;
      const name =
        who?.name ??
        `${FIRST[(branchSeq * 11 + 5) % FIRST.length]} ${LAST[(branchSeq * 2 + 7) % LAST.length]}`;
      const pan = who?.pan ?? samplePan(name, 900 + branchSeq);
      const interviewed = [
        'Not Selected',
        'In Merit List',
        'Forwarded to UTD',
        'Pending Approval',
      ].includes(status);
      const marks =
        status === 'Not Selected' ? 42 + (s % 8) : 68 + ((branchSeq * 7) % 28);
      SEED_APPLICATIONS.push(
        app(dept, name, pan, status, {
          applicationType: reapply ? 'Re-apply' : 'New Registration',
          ...(reapply
            ? { reapplyFor: 'Another Subject' as const, davvExperienceYears: 1 }
            : {}),
          submittedOn: `2026-11-${String(2 + ((s * 3) % 20)).padStart(2, '0')}`,
          programs: [program],
          branches: [branch],
          semesters: [
            SEMESTER_NUMBERS[(s + branchSeq) % SEMESTER_NUMBERS.length],
          ],
          subjects: [`${code}${400 + s * 10 + 2}`, ''],
          labs: [`${code}L${40 + s}`],
          qualifications: QUALS[(branchSeq + s) % QUALS.length],
          experienceYears: 2 + ((branchSeq * 5) % 16),
          ...(status === 'Rejected'
            ? { rejectionReason: REJECTIONS[s % REJECTIONS.length] }
            : {}),
          ...(!['Submitted', 'Rejected'].includes(status)
            ? { verifiedOn: '2026-11-15' }
            : {}),
          ...(status === 'Interview Scheduled' || interviewed
            ? {
                interview: {
                  date: interviewed ? '2026-11-20' : `2026-12-0${(s % 5) + 2}`,
                  time: ['10:30', '11:30', '14:00', '15:00'][s % 4],
                  venue: `${dept} Committee Room, DAVV`,
                  committee: `HOD (${branch}), Senior Professor, Subject Expert`,
                  ...(interviewed
                    ? {
                        result:
                          status === 'Not Selected'
                            ? ('Not Selected' as const)
                            : ('Finalised' as const),
                        marks,
                        remarks:
                          status === 'Not Selected'
                            ? 'Below the subject requirement.'
                            : 'Recommended by the committee.',
                      }
                    : {}),
                },
              }
            : {}),
          ...(['Forwarded to UTD', 'Pending Approval'].includes(status)
            ? { meritRank: 1, hodForwardedOn: '2026-11-22' }
            : {}),
          ...(status === 'Pending Approval'
            ? { forwardedOn: '2026-11-24' }
            : {}),
        } as Partial<Application>)
      );
    });
  })
);

// ── One faculty, several UTDs — October bills arriving at different times ──
// Dr. Rahul Sharma (IET + IIPS + IMS) and Neha Joshi (IET + SCSIT). Finance
// sees what each has already been paid this month and the balance left
// under the ₹30,000 limit, whichever UTD's bill is opened.

const MULTI_UTD: {
  uid: string;
  name: string;
  dept: string;
  branch: string;
  subjects: string[];
  labs: string[];
  theory: number;
  practical: number;
  status: Bill['status'];
  extra?: Partial<Bill>;
}[] = [
  // Rahul: IET paid first (₹20,000), IMS approved (₹8,800), IIPS with the Registrar & VC (₹9,600).
  {
    uid: RAHUL,
    name: 'Dr. Rahul Sharma',
    dept: 'IET',
    branch: 'Computer Engineering',
    subjects: ['CER5C3', 'ITR5C1'],
    labs: ['CER5L3'],
    theory: 34,
    practical: 3,
    status: 'Paid',
    extra: {
      payable: 20000,
      notPayable: 0,
      paidOn: '2026-11-08',
      transactionRef: 'NEFT/DAVV/0811/IET-RAHU',
      approvedOn: '2026-11-07',
      approvedBy: 'Registrar & VC Sir',
      sentForApprovalOn: '2026-11-06',
    },
  },
  {
    uid: RAHUL,
    name: 'Dr. Rahul Sharma',
    dept: 'IMS',
    branch: 'Management',
    subjects: ['MBA-IT-204'],
    labs: ['MBA-L21'],
    theory: 14,
    practical: 4,
    status: 'Approved by Registrar & VC',
    extra: {
      sentForApprovalOn: '2026-11-10',
      approvedOn: '2026-11-14',
      approvedBy: 'Registrar & VC Sir',
    },
  },
  {
    uid: RAHUL,
    name: 'Dr. Rahul Sharma',
    dept: 'IIPS',
    branch: 'Information Technology',
    subjects: ['MCA-302', 'MCA-305'],
    labs: ['MCA-L31'],
    theory: 16,
    practical: 4,
    status: 'Pending Registrar & VC Approval',
    extra: { sentForApprovalOn: '2026-11-10' },
  },
  // Neha: SCSIT paid (₹12,000), IET at Finance (₹22,000) — only ₹18,000 fits.
  {
    uid: NEHA,
    name: 'Neha Joshi',
    dept: 'SCSIT',
    branch: 'Information Technology',
    subjects: ['MSC-CS-301'],
    labs: ['MSC-CS-L3'],
    theory: 20,
    practical: 5,
    status: 'Paid',
    extra: {
      payable: 12000,
      notPayable: 0,
      paidOn: '2026-11-12',
      transactionRef: 'NEFT/DAVV/1211/SCSIT-OCT',
    },
  },
  {
    uid: NEHA,
    name: 'Neha Joshi',
    dept: 'IET',
    branch: 'Information Technology',
    subjects: ['ITR3C2'],
    labs: ['ITR3L2'],
    theory: 30,
    practical: 8,
    status: 'Sent to Finance',
  },
];

MULTI_UTD.forEach((m, i) => {
  // Earlier October entries of this faculty in this UTD are verified too.
  SEED_LOGS.forEach(l => {
    if (
      l.uniqueId === m.uid &&
      l.department === m.dept &&
      l.date.startsWith('2026-10')
    )
      l.status = 'Verified';
  });
  SEED_LOGS.push(
    ...branchLogs(
      m.uid,
      m.dept,
      BRANCH_PROGRAM[m.dept] ?? 'B.E.',
      m.subjects,
      m.labs,
      '2026-10',
      m.theory,
      m.practical,
      'Verified',
      9,
      31,
      40 + i
    )
  );
  const verified = SEED_LOGS.filter(
    l =>
      l.uniqueId === m.uid &&
      l.department === m.dept &&
      l.date.startsWith('2026-10') &&
      l.status === 'Verified'
  );
  const t = verified.reduce(
    (s, l) => s + l.sessions.filter(x => x.type === 'Theory').length,
    0
  );
  const p = verified.reduce(
    (s, l) => s + l.sessions.filter(x => x.type === 'Practical').length,
    0
  );
  SEED_BILLS.push(
    periodBill(
      `bill-multi-${String(i + 1).padStart(3, '0')}`,
      '2026-10',
      m.dept,
      m.branch,
      m.uid,
      m.name,
      t,
      p,
      m.status,
      {
        sentToUtdOn: '2026-11-04',
        utdForwardedOn: '2026-11-05',
        ...m.extra,
        ...(m.extra?.payable !== undefined
          ? {
              payable:
                t * DEFAULT_RATES.theoryRate + p * DEFAULT_RATES.practicalRate,
            }
          : {}),
      }
    )
  );
});

// ── Subject master and faculty requirements ────────────────────
// Each HOD keeps the subjects and labs of the branch. The codes follow the
// ones used in the sample applications, so names resolve everywhere.

const SUBJECT_NAMES: Record<string, string[]> = {
  CER: [
    'Data Structures',
    'Operating Systems',
    'Computer Networks',
    'Database Management Systems',
    'Theory of Computation',
    'Compiler Design',
    'Software Engineering',
    'Machine Learning',
    'Computer Architecture',
    'Design & Analysis of Algorithms',
  ],
  ITR: [
    'Web Technologies',
    'Object Oriented Programming',
    'Information Security',
    'Cloud Computing',
    'Data Mining',
    'Internet of Things',
    'Distributed Systems',
    'Mobile Application Development',
    'Big Data Analytics',
    'Software Testing',
  ],
  ETR: [
    'Signals & Systems',
    'Analog Communication',
    'Digital Communication',
    'Microprocessors',
    'Antenna & Wave Propagation',
    'VLSI Design',
    'Control Systems',
    'Digital Signal Processing',
    'Optical Communication',
    'Embedded Systems',
  ],
  EIR: [
    'Transducers',
    'Process Control',
    'Industrial Instrumentation',
    'Biomedical Instrumentation',
    'Control Systems',
    'Analytical Instrumentation',
    'PLC & SCADA',
    'Sensors & Actuators',
    'Virtual Instrumentation',
    'Power Electronics',
  ],
  MER: [
    'Engineering Thermodynamics',
    'Fluid Mechanics',
    'Strength of Materials',
    'Theory of Machines',
    'Heat Transfer',
    'Machine Design',
    'Manufacturing Processes',
    'Refrigeration & Air Conditioning',
    'IC Engines',
    'CAD/CAM',
  ],
  CVR: [
    'Surveying',
    'Structural Analysis',
    'Geotechnical Engineering',
    'Concrete Technology',
    'Transportation Engineering',
    'Hydraulics',
    'Environmental Engineering',
    'Design of Steel Structures',
    'Estimation & Costing',
    'Construction Management',
  ],
  'MCA-': [
    'Programming in C',
    'Discrete Mathematics',
    'Java Programming',
    'Python Programming',
    'Data Structures using C++',
    'Computer Graphics',
    'Artificial Intelligence',
    'Software Project Management',
    'Linux Administration',
    'Advanced DBMS',
  ],
  'IMBA-': [
    'Principles of Management',
    'Business Economics',
    'Financial Accounting',
    'Marketing Management',
    'Organisational Behaviour',
    'Business Statistics',
    'Human Resource Management',
    'Business Law',
    'Operations Research',
    'Strategic Management',
  ],
  'MBA-': [
    'Managerial Economics',
    'Corporate Finance',
    'Marketing Research',
    'Consumer Behaviour',
    'Supply Chain Management',
    'Business Analytics',
    'Investment Management',
    'Digital Marketing',
    'Entrepreneurship',
    'International Business',
  ],
  'MSC-CS-': [
    'Advanced Algorithms',
    'Data Science',
    'Computer Vision',
    'Natural Language Processing',
    'Parallel Computing',
    'Blockchain Technology',
    'Deep Learning',
    'Cryptography',
    'Soft Computing',
    'Research Methodology',
  ],
  'BCOM-': [
    'Financial Accounting',
    'Cost Accounting',
    'Income Tax',
    'Business Law',
    'Corporate Accounting',
    'Auditing',
    'Banking & Insurance',
    'Management Accounting',
    'GST',
    'E-Commerce',
  ],
  'ECO-': [
    'Microeconomics',
    'Macroeconomics',
    'Indian Economy',
    'Econometrics',
    'Public Finance',
    'International Economics',
    'Development Economics',
    'Monetary Economics',
    'Agricultural Economics',
    'Environmental Economics',
  ],
};

let subjectSeq = 0;

export const SEED_SUBJECTS: SubjectMaster[] = Object.entries(
  BRANCH_CODE
).flatMap(([key, code]) => {
  const [department, branch] = key.split('|');
  const names = SUBJECT_NAMES[code] ?? SUBJECT_NAMES.CER;
  const program = BRANCH_PROGRAM[department] ?? 'B.E.';
  const theory = [
    301, 303, 304, 311, 313, 314, 321, 323, 324, 331, 334, 341, 344, 402, 412,
    422, 432, 442, 452, 462, 472, 482,
  ];
  const labs = [30, 31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48];
  return [
    ...theory.map((n, i) => ({
      id: `sub-${++subjectSeq}`,
      department,
      branch,
      code: `${code}${n}`,
      name: names[i % names.length],
      type: 'Theory' as const,
      program,
      semester: SEMESTER_NUMBERS[Math.floor(n / 100) - 1] ?? 'III',
    })),
    ...labs.map((n, i) => ({
      id: `sub-${++subjectSeq}`,
      department,
      branch,
      code: `${code}L${n}`,
      name: `${names[i % names.length]} Lab`,
      type: 'Practical' as const,
      program,
      semester: SEMESTER_NUMBERS[Math.floor(n / 10) - 1] ?? 'III',
    })),
  ];
});

export const SEED_REQUIREMENTS: FacultyRequirement[] = Object.entries(
  BRANCH_CODE
).flatMap(([key, code], b) => {
  const [department, branch] = key.split('|');
  const program = BRANCH_PROGRAM[department] ?? 'B.E.';
  const rows: [string, 'Odd' | 'Even', string, number, number, number][] = [
    // session, period, semester, code number, required, hours/week
    ['2026-2027', 'Odd', 'III', 301, 2, 4],
    ['2026-2027', 'Odd', 'III', 304, 1, 3],
    ['2026-2027', 'Odd', 'IV', 402, 1, 4],
    ['2026-2027', 'Even', 'IV', 412, 2, 4],
    ['2026-2027', 'Even', 'V', 432, 1, 3],
    ['2025-2026', 'Even', 'IV', 311, 1, 4],
  ];
  return [
    ...rows.map(
      (
        [session, semesterPeriod, semester, n, facultyRequired, hoursPerWeek],
        i
      ) => ({
        id: `req-${b}-${i}`,
        department,
        branch,
        session,
        semesterPeriod,
        program,
        semester,
        subjectCode: `${code}${n}`,
        facultyRequired,
        hoursPerWeek,
        remarks: i === 0 ? 'Regular faculty on leave for the term.' : undefined,
        createdOn: session === '2025-2026' ? '2026-01-05' : '2026-06-20',
      })
    ),
    {
      id: `req-${b}-lab`,
      department,
      branch,
      session: '2026-2027',
      semesterPeriod: 'Odd' as const,
      program,
      semester: 'III',
      subjectCode: `${code}L30`,
      facultyRequired: 1,
      hoursPerWeek: 2,
      createdOn: '2026-06-20',
    },
  ];
});
