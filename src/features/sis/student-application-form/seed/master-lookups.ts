import type {
  GenderItem,
  CasteItem,
  NationalityItem,
  ResidencyStatusItem,
  OccupationItem,
  DesignationItem,
  AddressTypeItem,
} from '../types';

export const genders: GenderItem[] = [
  { id: 1, name: 'Male', text: 'Male', isActive: true },
  { id: 2, name: 'Female', text: 'Female', isActive: true },
  { id: 3, name: 'Other', text: 'Other', isActive: true },
];

export const castes: CasteItem[] = [
  { id: 1, name: 'General', code: 'GEN', isActive: true },
  { id: 2, name: 'OBC', code: 'OBC', isActive: true },
  { id: 3, name: 'SC', code: 'SC', isActive: true },
  { id: 4, name: 'ST', code: 'ST', isActive: true },
  { id: 5, name: 'EWS', code: 'EWS', isActive: true },
];

export const nationalities: NationalityItem[] = [
  { id: 1, name: 'Indian', code: 'IND', isActive: true },
  { id: 2, name: 'Nepali', code: 'NPL', isActive: true },
  { id: 3, name: 'Bangladeshi', code: 'BGD', isActive: true },
  { id: 4, name: 'Sri Lankan', code: 'LKA', isActive: true },
  { id: 5, name: 'Bhutanese', code: 'BTN', isActive: true },
];

export const residencyStatuses: ResidencyStatusItem[] = [
  { id: 1, name: 'Resident', text: 'Resident', isActive: true },
  { id: 2, name: 'Non-Resident', text: 'Non-Resident', isActive: true },
];

export const occupations: OccupationItem[] = [
  {
    id: 1,
    name: 'Government Service',
    text: 'Government Service',
    isActive: true,
  },
  { id: 2, name: 'Private Service', text: 'Private Service', isActive: true },
  { id: 3, name: 'Business', text: 'Business', isActive: true },
  { id: 4, name: 'Agriculture', text: 'Agriculture', isActive: true },
  {
    id: 5,
    name: 'Teacher/Professor',
    text: 'Teacher/Professor',
    isActive: true,
  },
  { id: 6, name: 'Doctor', text: 'Doctor', isActive: true },
  { id: 7, name: 'Engineer', text: 'Engineer', isActive: true },
  { id: 8, name: 'Advocate', text: 'Advocate', isActive: true },
  { id: 9, name: 'Housewife', text: 'Housewife', isActive: true },
  { id: 10, name: 'Retired', text: 'Retired', isActive: true },
  { id: 11, name: 'Other', text: 'Other', isActive: true },
];

export const designations: DesignationItem[] = [
  { id: 1, name: 'Professor', code: 'PROF', level: 1, isActive: true },
  {
    id: 2,
    name: 'Associate Professor',
    code: 'ASSOC_PROF',
    level: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'Assistant Professor',
    code: 'ASST_PROF',
    level: 3,
    isActive: true,
  },
  { id: 4, name: 'Lecturer', code: 'LECT', level: 4, isActive: true },
  { id: 5, name: 'Principal', code: 'PRIN', level: 1, isActive: true },
  { id: 6, name: 'Vice Principal', code: 'VP', level: 2, isActive: true },
  { id: 7, name: 'Dean', code: 'DEAN', level: 1, isActive: true },
  { id: 8, name: 'HOD', code: 'HOD', level: 2, isActive: true },
  { id: 9, name: 'Registrar', code: 'REG', level: 1, isActive: true },
  { id: 10, name: 'Clerk', code: 'CLERK', level: 5, isActive: true },
  { id: 11, name: 'Other', code: 'OTH', level: 6, isActive: true },
];

export const addressTypes: AddressTypeItem[] = [
  { id: 1, name: 'Permanent', text: 'Permanent', isActive: true },
  { id: 2, name: 'Current', text: 'Current', isActive: true },
  { id: 3, name: 'Both Same', text: 'Both Same', isActive: true },
];
