export interface Discipline {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

export interface UgcDegree {
  id: string;
  name: string;
  code: string;
  level: string;
  status: string;
}

export interface AdmissionQuota {
  id: string;
  name: string;
  percentage: number;
  description: string;
  status: string;
}

export interface EnrolmentType {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

export interface EnrolmentStatusItem {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface ExamScheme {
  id: string;
  name: string;
  passingMarks: number;
  maxMarks: number;
  description: string;
  status: string;
}

export interface AcademicDistinction {
  id: string;
  name: string;
  minPercentage: number;
  maxPercentage: number;
  description: string;
}

export interface ProgrammeRecord {
  id: string;
  code: string;
  title: string;
  discipline: string;
  ugcDegree: string;
  level: string;
  duration: string;
  admissionQuota: string;
  examScheme: string;
  status: string;
}

export const disciplines: Discipline[] = [
  {
    id: '1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Covers computing, software, and hardware systems.',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    description: 'Covers electronics, communication, and signal systems.',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Mechanical Engineering',
    code: 'ME',
    description: 'Covers design, manufacturing, and thermodynamics.',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Civil Engineering',
    code: 'CE',
    description: 'Covers structures, construction, and infrastructure.',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Management Studies',
    code: 'MS',
    description: 'Covers business, finance, and organizational management.',
    status: 'Active',
  },
];

export const ugcDegrees: UgcDegree[] = [
  {
    id: '1',
    name: 'Bachelor of Technology',
    code: 'B.Tech',
    level: 'UG',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Master of Technology',
    code: 'M.Tech',
    level: 'PG',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bachelor of Science',
    code: 'B.Sc',
    level: 'UG',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Master of Science',
    code: 'M.Sc',
    level: 'PG',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Doctor of Philosophy',
    code: 'Ph.D',
    level: 'Doctorate',
    status: 'Active',
  },
];

export const admissionQuotas: AdmissionQuota[] = [
  {
    id: '1',
    name: 'General',
    percentage: 50,
    description: 'Open merit category.',
    status: 'Active',
  },
  {
    id: '2',
    name: 'OBC',
    percentage: 27,
    description: 'Other Backward Classes reservation.',
    status: 'Active',
  },
  {
    id: '3',
    name: 'SC',
    percentage: 15,
    description: 'Scheduled Caste reservation.',
    status: 'Active',
  },
  {
    id: '4',
    name: 'ST',
    percentage: 7.5,
    description: 'Scheduled Tribe reservation.',
    status: 'Active',
  },
  {
    id: '5',
    name: 'EWS',
    percentage: 10,
    description: 'Economically Weaker Section reservation.',
    status: 'Active',
  },
];

export const enrolmentTypes: EnrolmentType[] = [
  {
    id: '1',
    name: 'Regular',
    code: 'REG',
    description: 'Full-time regular programme.',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Lateral Entry',
    code: 'LE',
    description: 'Direct entry to 2nd year.',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Distance Learning',
    code: 'DL',
    description: 'Distance mode programme.',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Online',
    code: 'ONL',
    description: 'Fully online programme delivery.',
    status: 'Active',
  },
];

export const enrolmentStatusItems: EnrolmentStatusItem[] = [
  {
    id: '1',
    name: 'Enrolled',
    code: 'ENR',
    description: 'Active student enrolled in programme.',
    isActive: true,
  },
  {
    id: '2',
    name: 'On Leave',
    code: 'OL',
    description: 'Student on approved academic leave.',
    isActive: false,
  },
  {
    id: '3',
    name: 'Detained',
    code: 'DET',
    description: 'Detained due to attendance shortage.',
    isActive: false,
  },
  {
    id: '4',
    name: 'Graduated',
    code: 'GRD',
    description: 'Successfully completed the programme.',
    isActive: false,
  },
];

export const examSchemes: ExamScheme[] = [
  {
    id: '1',
    name: 'Semester',
    passingMarks: 35,
    maxMarks: 100,
    description: 'Internal + External semester examination.',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Annual',
    passingMarks: 33,
    maxMarks: 100,
    description: 'Annual year-end examination.',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Choice Based Credit System',
    passingMarks: 40,
    maxMarks: 100,
    description: 'CBCS pattern with elective flexibility.',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Credit Based Semester System',
    passingMarks: 40,
    maxMarks: 100,
    description: 'CBSS pattern with credit accumulation.',
    status: 'Active',
  },
];

export const academicDistinctions: AcademicDistinction[] = [
  {
    id: '1',
    name: 'Distinction',
    minPercentage: 75,
    maxPercentage: 100,
    description: 'Outstanding academic performance.',
  },
  {
    id: '2',
    name: 'First Division',
    minPercentage: 60,
    maxPercentage: 74.99,
    description: 'First division performance.',
  },
  {
    id: '3',
    name: 'Second Division',
    minPercentage: 50,
    maxPercentage: 59.99,
    description: 'Second division performance.',
  },
  {
    id: '4',
    name: 'Pass',
    minPercentage: 40,
    maxPercentage: 49.99,
    description: 'Minimum passing performance.',
  },
];

export const programmeRecords: ProgrammeRecord[] = [
  {
    id: '1',
    code: 'BTCS',
    title: 'B.Tech Computer Science',
    discipline: 'Computer Science & Engineering',
    ugcDegree: 'Bachelor of Technology',
    level: 'UG',
    duration: '4 Years',
    admissionQuota: 'General',
    examScheme: 'Semester',
    status: 'Active',
  },
  {
    id: '2',
    code: 'MTAI',
    title: 'M.Tech AI & ML',
    discipline: 'Computer Science & Engineering',
    ugcDegree: 'Master of Technology',
    level: 'PG',
    duration: '2 Years',
    admissionQuota: 'General',
    examScheme: 'Choice Based Credit System',
    status: 'Active',
  },
  {
    id: '3',
    code: 'BSPH',
    title: 'B.Sc Physics',
    discipline: 'Computer Science & Engineering',
    ugcDegree: 'Bachelor of Science',
    level: 'UG',
    duration: '3 Years',
    admissionQuota: 'General',
    examScheme: 'Annual',
    status: 'Active',
  },
  {
    id: '4',
    code: 'MBA',
    title: 'Master of Business Administration',
    discipline: 'Management Studies',
    ugcDegree: 'Master of Science',
    level: 'PG',
    duration: '2 Years',
    admissionQuota: 'General',
    examScheme: 'Semester',
    status: 'Active',
  },
  {
    id: '5',
    code: 'BCA',
    title: 'Bachelor of Computer Applications',
    discipline: 'Computer Science & Engineering',
    ugcDegree: 'Bachelor of Science',
    level: 'UG',
    duration: '3 Years',
    admissionQuota: 'General',
    examScheme: 'Credit Based Semester System',
    status: 'Inactive',
  },
];
