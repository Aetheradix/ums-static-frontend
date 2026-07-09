import type { Branch, CertificateType, LetterGrade } from '../../types';

export const INSTITUTE = {
  shortName: 'IET DAVV',
  name: 'Institute of Engineering & Technology',
  university: 'Devi Ahilya Vishwavidyalaya',
  city: 'Indore',
  campus: 'Takshashila Parisar, Khandwa Road, Indore, Madhya Pradesh 452001',
  phone: '+91-731-2361116',
  email: 'info@ietdavv.edu.in',
  website: 'https://www.ietdavv.edu.in',
  motto: 'Dhiyo Yonah Prachodayat',
  mottoTranslation: 'May that divine light illuminate our intellect.',
  degree: 'B.E.',
  degreeName: 'Bachelor of Engineering',
  durationYears: 4,
} as const;

export const BRANCHES: Branch[] = [
  { code: 'CSE', name: 'Computer Science & Engineering', intake: 120 },
  { code: 'IT', name: 'Information Technology', intake: 120 },
  { code: 'CSBS', name: 'Computer Science & Business Systems', intake: 120 },
  {
    code: 'ETC',
    name: 'Electronics & Telecommunication Engineering',
    intake: 90,
  },
  { code: 'EI', name: 'Electronics & Instrumentation Engineering', intake: 60 },
  { code: 'ME', name: 'Mechanical Engineering', intake: 60 },
  { code: 'CE', name: 'Civil Engineering', intake: 60 },
  { code: 'IPE', name: 'Industrial & Production Engineering', intake: 30 },
  { code: 'EEE', name: 'Electrical & Electronics Engineering', intake: 30 },
];

export const TOTAL_SEMESTERS = 8;

export const MIN_CREDITS_PER_SEM = 12;

export const REQUIRED_CREDITS = 160;

export const INTERNAL_MAX = 20;
export const EXTERNAL_MAX = 80;

export const INTERNAL_PASS_MARK = 8;

export const ATTENDANCE_THRESHOLD = 75;

export const GRADE_SCALE: {
  letter: LetterGrade;
  min: number;
  max: number;
  point: number;
  label: string;
}[] = [
  { letter: 'O', min: 90, max: 100, point: 10, label: 'Outstanding' },
  { letter: 'A+', min: 80, max: 89, point: 9, label: 'Excellent' },
  { letter: 'A', min: 70, max: 79, point: 8, label: 'Very Good' },
  { letter: 'B+', min: 60, max: 69, point: 7, label: 'Good' },
  { letter: 'B', min: 50, max: 59, point: 6, label: 'Above Average' },
  { letter: 'C', min: 45, max: 49, point: 5, label: 'Average' },
  { letter: 'P', min: 40, max: 44, point: 4, label: 'Pass' },
  { letter: 'F', min: 0, max: 39, point: 0, label: 'Fail' },
];

export const FEE_STRUCTURE = {
  tuitionPerSemester: 40000,
  examPerSemester: 2750,
  hostelPerYear: 32000,
} as const;

export const CERTIFICATE_CATALOG: Record<
  CertificateType,
  { description: string; fee: number; processingDays: number }
> = {
  Bonafide: {
    description: 'Proof of current enrolment at IET DAVV.',
    fee: 100,
    processingDays: 3,
  },
  Character: {
    description: 'Certificate of conduct, issued on completion/transfer.',
    fee: 100,
    processingDays: 5,
  },
  'No-Dues': {
    description: 'Confirms all dues (fees, library, hostel) are cleared.',
    fee: 0,
    processingDays: 5,
  },
  Migration: {
    description: 'Required to transfer to another university.',
    fee: 500,
    processingDays: 15,
  },
  Transcript: {
    description: 'Consolidated academic record (WES verification available).',
    fee: 750,
    processingDays: 20,
  },
  'Duplicate Marksheet': {
    description: 'Reissue of a lost/damaged semester marksheet.',
    fee: 500,
    processingDays: 15,
  },
  Provisional: {
    description: 'Provisional degree certificate pending convocation.',
    fee: 300,
    processingDays: 10,
  },
  Degree: {
    description: 'Final degree certificate awarded after graduation.',
    fee: 1000,
    processingDays: 30,
  },
};

export const EXTERNAL_PORTALS = {
  dteCounselling: {
    label: 'DTE MP Counselling',
    url: 'https://dte.mponline.gov.in',
    description:
      'Directorate of Technical Education, MP — JEE-Main-based B.E. seat allotment.',
  },
  davvSIS: {
    label: 'DAVV Student Information System',
    url: 'https://davv.mponline.gov.in',
    description:
      'Enrolment, exam forms & records. Login: Enrollment Number + Date of Birth.',
  },
  mpOnlineFee: {
    label: 'MPOnline Fee Payment',
    url: 'https://www.mponline.gov.in',
    description: 'Tuition, examination and hostel fee payment.',
  },
  scholarshipPortal: {
    label: 'MP Scholarship Portal 2.0',
    url: 'https://scholarshipportal.mp.nic.in',
    description:
      'State post-matric scholarships (SC/ST/OBC) via Direct Benefit Transfer.',
  },
  cbaCertificates: {
    label: 'DAVV Counter-Base Applications',
    url: 'https://www.dauniv.ac.in/student-services',
    description:
      'Apply for bonafide, migration, transcript and other certificates.',
  },
  ietResults: {
    label: 'IET Result Portal',
    url: 'https://results.ietdavv.edu.in',
    description: 'B.E. / M.Tech end-semester results.',
  },
  library: {
    label: 'IET Digital Library',
    url: 'https://www.ietdavv.edu.in',
    description: 'Catalogue, e-resources and book issue/return.',
  },
  placement: {
    label: 'IET Training & Placement',
    url: 'https://www.ietdavv.edu.in',
    description: 'Placement drives, company registration and statistics.',
  },
} as const;
