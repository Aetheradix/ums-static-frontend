import type {
  AcademicYearItem,
  ProgrammeItem,
  DegreeLevelItem,
  SpecialisationItem,
  ProgrammeModeItem,
} from '../types';

export const academicYears: AcademicYearItem[] = [
  {
    id: 1,
    name: '2026-2027',
    session: '2026-2027',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    isCurrent: true,
    isActive: true,
  },
  {
    id: 2,
    name: '2025-2026',
    session: '2025-2026',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    isCurrent: false,
    isActive: true,
  },
  {
    id: 3,
    name: '2024-2025',
    session: '2024-2025',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    isCurrent: false,
    isActive: true,
  },
  {
    id: 4,
    name: '2023-2024',
    session: '2023-2024',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    isCurrent: false,
    isActive: true,
  },
];

export const programmes: ProgrammeItem[] = [
  {
    id: 1,
    name: 'Bachelor of Technology',
    code: 'B.Tech',
    durationYears: 4,
    isActive: true,
  },
  {
    id: 2,
    name: 'Master of Business Administration',
    code: 'MBA',
    durationYears: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'Bachelor of Science',
    code: 'B.Sc',
    durationYears: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'Master of Technology',
    code: 'M.Tech',
    durationYears: 2,
    isActive: true,
  },
  {
    id: 5,
    name: 'Bachelor of Commerce',
    code: 'B.Com',
    durationYears: 3,
    isActive: true,
  },
  {
    id: 6,
    name: 'Bachelor of Arts',
    code: 'BA',
    durationYears: 3,
    isActive: true,
  },
  {
    id: 7,
    name: 'Master of Science',
    code: 'M.Sc',
    durationYears: 2,
    isActive: true,
  },
  {
    id: 8,
    name: 'Doctor of Philosophy',
    code: 'PhD',
    durationYears: 5,
    isActive: true,
  },
  {
    id: 9,
    name: 'Bachelor of Education',
    code: 'B.Ed',
    durationYears: 2,
    isActive: true,
  },
  {
    id: 10,
    name: 'Master of Arts',
    code: 'MA',
    durationYears: 2,
    isActive: true,
  },
];

export const degreeLevels: DegreeLevelItem[] = [
  { id: 1, name: 'Undergraduate', code: 'UG', isActive: true },
  { id: 2, name: 'Postgraduate', code: 'PG', isActive: true },
  { id: 3, name: 'Doctorate', code: 'PhD', isActive: true },
  { id: 4, name: 'Diploma', code: 'DIP', isActive: true },
  { id: 5, name: 'Certificate', code: 'CERT', isActive: true },
];

export const specialisations: SpecialisationItem[] = [
  {
    id: 1,
    name: 'Computer Science & Engineering',
    code: 'CSE',
    isActive: true,
  },
  { id: 2, name: 'Mechanical Engineering', code: 'ME', isActive: true },
  { id: 3, name: 'Electronics & Communication', code: 'ECE', isActive: true },
  { id: 4, name: 'Electrical Engineering', code: 'EE', isActive: true },
  { id: 5, name: 'Civil Engineering', code: 'CE', isActive: true },
  { id: 6, name: 'Information Technology', code: 'IT', isActive: true },
  { id: 7, name: 'Artificial Intelligence & ML', code: 'AIML', isActive: true },
  { id: 8, name: 'Data Science', code: 'DS', isActive: true },
  { id: 9, name: 'Finance', code: 'FIN', isActive: true },
  { id: 10, name: 'Marketing', code: 'MKT', isActive: true },
  { id: 11, name: 'Human Resources', code: 'HR', isActive: true },
  { id: 12, name: 'Physics', code: 'PHY', isActive: true },
  { id: 13, name: 'Chemistry', code: 'CHEM', isActive: true },
  { id: 14, name: 'Mathematics', code: 'MATH', isActive: true },
  { id: 15, name: 'English Literature', code: 'ENG', isActive: true },
];

export const programmeModes: ProgrammeModeItem[] = [
  { id: 1, name: 'Regular (Full Time)', code: 'REG', isActive: true },
  { id: 2, name: 'Part Time', code: 'PT', isActive: true },
  { id: 3, name: 'Distance Education', code: 'DE', isActive: true },
  { id: 4, name: 'Online', code: 'ONL', isActive: true },
  { id: 5, name: 'Evening', code: 'EVE', isActive: true },
];
