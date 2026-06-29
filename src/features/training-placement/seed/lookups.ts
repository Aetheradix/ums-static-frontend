import type { OrganizationalUnit } from '../types';

export const seedOrganizationalUnits: OrganizationalUnit[] = [
  { id: 'ou-tpc', code: 'TPC', name: 'Training & Placement Cell' },
  { id: 'ou-cse', code: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'ou-ece', code: 'ECE', name: 'Electronics & Communication' },
  { id: 'ou-me', code: 'ME', name: 'Mechanical Engineering' },
  { id: 'ou-ce', code: 'CE', name: 'Civil Engineering' },
  { id: 'ou-ee', code: 'EE', name: 'Electrical Engineering' },
  { id: 'ou-mba', code: 'MBA', name: 'Master of Business Administration' },
  { id: 'ou-mca', code: 'MCA', name: 'Master of Computer Applications' },
  { id: 'ou-bca', code: 'BCA', name: 'Bachelor of Computer Applications' },
  { id: 'ou-eco', code: 'ECO', name: 'Economics & Statistics' },
  { id: 'ou-phy', code: 'PHY', name: 'Physics' },
  { id: 'ou-math', code: 'MATH', name: 'Mathematics' },
];

export const seedProgrammes = [
  { id: 'prog-btech-cse', name: 'B.Tech Computer Science', ouId: 'ou-cse' },
  { id: 'prog-btech-ece', name: 'B.Tech Electronics', ouId: 'ou-ece' },
  { id: 'prog-btech-me', name: 'B.Tech Mechanical', ouId: 'ou-me' },
  { id: 'prog-mba', name: 'MBA', ouId: 'ou-mba' },
  { id: 'prog-mca', name: 'MCA', ouId: 'ou-mca' },
  { id: 'prog-bca', name: 'BCA', ouId: 'ou-bca' },
];
