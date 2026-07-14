// Static seed data for the DAVV University CMS.
// Grounded in research of dauniv.ac.in (structure + services). Illustrative where the
// live site could not be verified; the full ~294 affiliated colleges arrive via search later.

import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  FileBadge,
  FileText,
  GraduationCap,
  IdCard,
  Landmark,
  Library,
  Megaphone,
  ReceiptText,
  ScrollText,
  Search,
  ShieldAlert,
  Wallet,
} from 'lucide-react';

export type InstitutionType = 'utd' | 'constituent' | 'affiliated';
export type ServiceGroup = 'student' | 'academic' | 'admin';

export interface UniversityMeta {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  motto: string;
  mottoTranslation: string;
  tagline: string;
  established: number;
}

export interface Campus {
  slug: string;
  name: string;
  role: 'Academic' | 'Administrative';
  location: string;
  blurb: string;
}

export interface Institution {
  slug: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  campusSlug?: string;
  faculty?: string;
}

export interface DavvService {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: ServiceGroup;
  external?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  category:
    | 'Exams'
    | 'Results'
    | 'Admissions'
    | 'Scholarships'
    | 'Tenders'
    | 'Recruitment'
    | 'General';
  audience: 'Students' | 'Colleges' | 'Faculty' | 'Public';
  date: string;
  pinned?: boolean;
}

export const DAVV: UniversityMeta = {
  slug: 'davv',
  name: 'Devi Ahilya Vishwavidyalaya',
  shortName: 'DAVV',
  city: 'Indore, Madhya Pradesh',
  motto: 'Dhiyo Yonah Prachodayat',
  mottoTranslation: 'May He inspire our intellect',
  tagline:
    'One unified portal for the University Teaching Departments, campuses, and affiliated colleges.',
  established: 1964,
};

export const DAVV_STATS = [
  { value: '33', label: 'Teaching Departments' },
  { value: '16', label: 'Faculties' },
  { value: '294', label: 'Affiliated Colleges' },
  { value: '3', label: 'Campuses' },
];

export const CAMPUSES: Campus[] = [
  {
    slug: 'takshashila',
    name: 'Takshashila Parisar',
    role: 'Academic',
    location: 'Khandwa Road, Indore',
    blurb:
      'The primary academic campus — most University Teaching Departments, IET, IIPS, IMS, School of Pharmacy and the Central Library.',
  },
  {
    slug: 'nalanda',
    name: 'Nalanda Parisar',
    role: 'Administrative',
    location: 'R. N. Tagore Marg, Indore',
    blurb:
      'The administrative campus — Vice-Chancellor and Registrar offices, Dean Student Welfare, and the School of Economics.',
  },
  {
    slug: 'avanti',
    name: 'Avanti Parisar',
    role: 'Academic',
    location: 'Indore',
    blurb:
      'The third campus (~154 acres) — expansion land adjacent to Takshashila; hosts no standalone teaching departments.',
  },
];

export const INSTITUTIONS: Institution[] = [
  // University Teaching Departments (UTDs) — run directly by the university.
  // Source: DAVV's official /utds directory (verified 2026-07). The "UTD" umbrella includes the
  // institutes (IET/IMS/IIPS/DAVID) alongside the Schools of Study. The official directory lists
  // ~41 units (~29 teaching UTDs + ~12 centres/cells); modeled here as the teaching UTDs plus the
  // 4 main academic-support centres = 33 (matching DAVV's "33 teaching departments and centres").
  // EVERY UTD is on Takshashila Parisar EXCEPT School of Economics (Nalanda). Avanti hosts none.

  // Institutes
  {
    slug: 'iet',
    name: 'Institute of Engineering & Technology',
    shortName: 'IET',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Engineering & Technology',
  },
  {
    slug: 'ims',
    name: 'Institute of Management Studies',
    shortName: 'IMS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Management',
  },
  {
    slug: 'iips',
    name: 'International Institute of Professional Studies',
    shortName: 'IIPS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Professional Studies',
  },
  {
    slug: 'david',
    name: 'DAVV Institute of Design',
    shortName: 'DAVID',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Design',
  },

  // Schools of Study
  {
    slug: 'scsit',
    name: 'School of Computer Science & IT',
    shortName: 'SCSIT',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Computer Science',
  },
  {
    slug: 'data-science',
    name: 'School of Data Science & Forecasting',
    shortName: 'SDSF',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Data Science',
  },
  {
    slug: 'electronics',
    name: 'School of Electronics',
    shortName: 'ELEX',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Electronics',
  },
  {
    slug: 'instrumentation',
    name: 'School of Instrumentation',
    shortName: 'INST',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Instrumentation',
  },
  {
    slug: 'physics',
    name: 'School of Physics',
    shortName: 'PHY',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Physical Sciences',
  },
  {
    slug: 'chemical-sciences',
    name: 'School of Chemical Sciences',
    shortName: 'CHEM',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Chemical Sciences',
  },
  {
    slug: 'mathematics',
    name: 'School of Mathematics',
    shortName: 'MATH',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Mathematical Sciences',
  },
  {
    slug: 'statistics',
    name: 'School of Statistics',
    shortName: 'STAT',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Mathematical Sciences',
  },
  {
    slug: 'life-sciences',
    name: 'School of Life Sciences',
    shortName: 'SLS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Life Sciences',
  },
  {
    slug: 'biotechnology',
    name: 'School of Biotechnology',
    shortName: 'BT',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Life Sciences',
  },
  {
    slug: 'biochemistry',
    name: 'School of Biochemistry',
    shortName: 'BC',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Life Sciences',
  },
  {
    slug: 'energy-environment',
    name: 'School of Energy & Environmental Studies',
    shortName: 'SEES',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Environmental Studies',
  },
  {
    slug: 'pharmacy',
    name: 'School of Pharmacy',
    shortName: 'PHAR',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Pharmacy',
  },
  {
    slug: 'law',
    name: 'School of Law',
    shortName: 'LAW',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Law',
  },
  {
    slug: 'commerce',
    name: 'School of Commerce',
    shortName: 'COM',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Commerce',
  },
  {
    slug: 'economics',
    name: 'School of Economics',
    shortName: 'ECON',
    type: 'utd',
    campusSlug: 'nalanda',
    faculty: 'Economics',
  },
  {
    slug: 'journalism',
    name: 'School of Journalism & Mass Communication',
    shortName: 'SJMC',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Journalism',
  },
  {
    slug: 'social-science',
    name: 'School of Social Science',
    shortName: 'SOSS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Social Sciences',
  },
  {
    slug: 'education',
    name: 'School of Education',
    shortName: 'EDU',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Education',
  },
  {
    slug: 'physical-education',
    name: 'School of Physical Education',
    shortName: 'SOPE',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Physical Education',
  },
  {
    slug: 'library-science',
    name: 'School of Library & Information Science',
    shortName: 'SLIS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Library Science',
  },
  {
    slug: 'comparative-languages',
    name: 'School of Comparative Languages & Culture',
    shortName: 'SCLC',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Languages & Culture',
  },
  {
    slug: 'aviation-tourism',
    name: 'School of Aviation, Tourism & Hospitality Management',
    shortName: 'SATHM',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Tourism & Hospitality',
  },
  {
    slug: 'tribal-studies',
    name: 'School of Tribal Studies',
    shortName: 'SOTS',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Social Sciences',
  },
  {
    slug: 'lifelong-learning',
    name: 'Department of Life Long Learning',
    shortName: 'DOLLL',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Continuing Education',
  },

  // Academic-support centres (on the official /utds directory)
  {
    slug: 'emrc',
    name: 'Educational Multimedia Research Centre',
    shortName: 'EMRC',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Media & Research',
  },
  {
    slug: 'cdoe',
    name: 'Centre for Distance & Online Education',
    shortName: 'CDOE',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Distance & Online',
  },
  {
    slug: 'ddukk',
    name: 'Deen Dayal Upadhyay Kaushal Kendra',
    shortName: 'DDU-KK',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Skill Development',
  },
  {
    slug: 'mmttc',
    name: 'Malaviya Mission Teacher Training Centre',
    shortName: 'MMTTC',
    type: 'utd',
    campusSlug: 'takshashila',
    faculty: 'Teacher Training',
  },

  // Constituent colleges — very few at DAVV
  {
    slug: 'msdgc',
    name: 'Mateshwari Sugni Devi Girls College',
    shortName: 'MSDGC',
    type: 'constituent',
    faculty: 'Arts & Commerce',
  },

  // Affiliated colleges — a small sample of ~294
  {
    slug: 'pimr',
    name: 'Prestige Institute of Management & Research',
    shortName: 'PIMR',
    type: 'affiliated',
    faculty: 'Management',
  },
  {
    slug: 'christian-eminent',
    name: 'Christian Eminent College',
    shortName: 'CEC',
    type: 'affiliated',
    faculty: 'Arts & Science',
  },
  {
    slug: 'holkar-science',
    name: 'Government Holkar Science College',
    shortName: 'Holkar',
    type: 'affiliated',
    faculty: 'Science',
  },
  {
    slug: 'renaissance',
    name: 'Renaissance College of Commerce & Management',
    shortName: 'RCCM',
    type: 'affiliated',
    faculty: 'Commerce & Management',
  },
  {
    slug: 'acropolis',
    name: 'Acropolis Institute of Technology & Research',
    shortName: 'AITR',
    type: 'affiliated',
    faculty: 'Engineering',
  },
  {
    slug: 'shri-vaishnav',
    name: 'Shri Vaishnav Institute of Management',
    shortName: 'SVIM',
    type: 'affiliated',
    faculty: 'Management',
  },
];

export const SERVICES: DavvService[] = [
  // Student services
  {
    id: 'sis',
    label: 'Student Portal (SIS)',
    description: 'Enrollment, profile & academic record',
    icon: IdCard,
    group: 'student',
    external: true,
  },
  {
    id: 'exam-form',
    label: 'Exam Form',
    description: 'Regular, supplementary & ATKT forms',
    icon: FileText,
    group: 'student',
  },
  {
    id: 'results',
    label: 'Results & Marksheets',
    description: 'UG / PG / NEP results and mark lists',
    icon: FileBadge,
    group: 'student',
  },
  {
    id: 'revaluation',
    label: 'Revaluation',
    description: 'Re-totaling, view answer book & revaluation',
    icon: ScrollText,
    group: 'student',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    description: 'Degree, migration, provisional & transcript',
    icon: Award,
    group: 'student',
  },
  {
    id: 'fee',
    label: 'Fee Payment',
    description: 'Pay online or via bank challan',
    icon: Wallet,
    group: 'student',
    external: true,
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    description: 'NSP schemes & university scholarships',
    icon: ReceiptText,
    group: 'student',
  },
  {
    id: 'grievance',
    label: 'Grievance Redressal',
    description: 'Raise & track a grievance',
    icon: ShieldAlert,
    group: 'student',
  },

  // Academic services
  {
    id: 'programmes',
    label: 'Programmes',
    description: 'Courses across 16 faculties',
    icon: GraduationCap,
    group: 'academic',
  },
  {
    id: 'departments',
    label: 'Departments (UTDs)',
    description: 'University teaching departments',
    icon: Building2,
    group: 'academic',
  },
  {
    id: 'calendar',
    label: 'Academic Calendar',
    description: 'Sessions, exams & holidays',
    icon: CalendarDays,
    group: 'academic',
  },
  {
    id: 'syllabus',
    label: 'Syllabus & Timetables',
    description: 'Curriculum, UG/PG time tables',
    icon: BookOpen,
    group: 'academic',
  },
  {
    id: 'e-content',
    label: 'e-Content & Library',
    description: 'SWAYAM, NPTEL, INFLIBNET & e-journals',
    icon: Library,
    group: 'academic',
  },

  // Administrative services
  {
    id: 'affiliation',
    label: 'College Affiliation',
    description: 'Affiliation & inspection for colleges',
    icon: Landmark,
    group: 'admin',
  },
  {
    id: 'notices',
    label: 'Notices & Circulars',
    description: 'Official notices and circulars',
    icon: Megaphone,
    group: 'admin',
  },
  {
    id: 'downloads',
    label: 'Downloads & Forms',
    description: 'University forms and formats',
    icon: FileText,
    group: 'admin',
  },
  {
    id: 'rti',
    label: 'RTI',
    description: 'Right to Information',
    icon: Search,
    group: 'admin',
  },
];

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Last date for UG examination form submission extended to 20 July',
    category: 'Exams',
    audience: 'Students',
    date: '12 Jul 2026',
    pinned: true,
  },
  {
    id: 'n2',
    title: 'B.Com (NEP) IV Semester results declared',
    category: 'Results',
    audience: 'Students',
    date: '11 Jul 2026',
  },
  {
    id: 'n3',
    title: 'CUET-based counselling schedule for UTD programmes 2026',
    category: 'Admissions',
    audience: 'Public',
    date: '10 Jul 2026',
    pinned: true,
  },
  {
    id: 'n4',
    title: 'National Scholarship Portal — applications now open',
    category: 'Scholarships',
    audience: 'Students',
    date: '08 Jul 2026',
  },
  {
    id: 'n5',
    title: 'Tender notice: supply of laboratory equipment (SCSIT)',
    category: 'Tenders',
    audience: 'Public',
    date: '05 Jul 2026',
  },
  {
    id: 'n6',
    title: 'Walk-in interview for visiting faculty — School of Law',
    category: 'Recruitment',
    audience: 'Faculty',
    date: '03 Jul 2026',
  },
  {
    id: 'n7',
    title: 'Result upload schedule for affiliated colleges (July cycle)',
    category: 'Results',
    audience: 'Colleges',
    date: '02 Jul 2026',
  },
];

export const NOTICE_CATEGORIES = [
  'All',
  'Exams',
  'Results',
  'Admissions',
  'Scholarships',
  'Tenders',
  'Recruitment',
] as const;

export const INSTITUTION_TYPE_LABEL: Record<InstitutionType, string> = {
  utd: 'University Department',
  constituent: 'Constituent College',
  affiliated: 'Affiliated College',
};

export const INSTITUTION_TYPE_REACH: Record<InstitutionType, string> = {
  utd: 'Full reach — run directly by the university, end to end.',
  constituent: 'Full reach — university-owned; all functions.',
  affiliated:
    'Limited reach — exams, results, degrees, curriculum & affiliation. The college teaches; the university examines.',
};

export function findInstitution(
  type: string,
  slug: string
): Institution | undefined {
  return INSTITUTIONS.find(i => i.type === type && i.slug === slug);
}

export function campusOf(slug?: string): Campus | undefined {
  return CAMPUSES.find(c => c.slug === slug);
}
