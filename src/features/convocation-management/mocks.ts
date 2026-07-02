export interface ConvocationEvent {
  id: string;
  title: string;
  edition: number;
  academicYear: string;
  venue: string;
  status:
    | 'Draft'
    | 'Registration Open'
    | 'Registration Closed'
    | 'Ceremony Completed';
  registrationStartDate: string;
  registrationEndDate: string;
}

export interface StudentEligibility {
  rollNumber: string;
  name: string;
  programme: string;
  department: string;
  passingYear: string;
  cgpa: number;
  noDuesStatus: boolean;
  eligible: boolean;
  registrationStatus: 'Not Registered' | 'Pending' | 'Verified';
}

export const MOCK_CONVOCATION_EVENTS: ConvocationEvent[] = [
  {
    id: 'CONV-2026',
    title: '47th Annual Convocation — XYZ University',
    edition: 47,
    academicYear: '2025-2026',
    venue: 'Main Auditorium',
    status: 'Registration Open',
    registrationStartDate: '2026-06-01T00:00:00Z',
    registrationEndDate: '2026-08-01T00:00:00Z',
  },
];

export const MOCK_STUDENTS: StudentEligibility[] = [
  {
    rollNumber: 'CS2022001',
    name: 'Aarav Sharma',
    programme: 'B.Tech Computer Science',
    department: 'Computer Science',
    passingYear: '2026',
    cgpa: 9.2,
    noDuesStatus: true,
    eligible: true,
    registrationStatus: 'Verified',
  },
  {
    rollNumber: 'CS2022002',
    name: 'Isha Patel',
    programme: 'B.Tech Computer Science',
    department: 'Computer Science',
    passingYear: '2026',
    cgpa: 8.5,
    noDuesStatus: true,
    eligible: true,
    registrationStatus: 'Pending',
  },
  {
    rollNumber: 'ME2022015',
    name: 'Rohan Gupta',
    programme: 'B.Tech Mechanical',
    department: 'Mechanical Engineering',
    passingYear: '2026',
    cgpa: 7.8,
    noDuesStatus: false,
    eligible: false,
    registrationStatus: 'Not Registered',
  },
];

export const MOCK_STATS = {
  totalEligible: 1250,
  registered: 840,
  feeReceived: 840000,
  pendingVerification: 120,
  verified: 720,
  passesGenerated: 700,
};
