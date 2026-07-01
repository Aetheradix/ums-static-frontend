// ============================================================
//  Event & Ticketing Management — Types & Mock Data
//  Static prototype data for a university events & ticketing system.
// ============================================================

export type EventStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Published'
  | 'Ongoing'
  | 'Completed'
  | 'Archived';

export type RegistrationStatus =
  | 'Registered'
  | 'Confirmed'
  | 'Checked-In'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Failed';

export interface Category {
  id: number;
  name: string;
}

export interface Venue {
  id: number;
  name: string;
  block: string;
  capacity: number;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
}

export interface Speaker {
  name: string;
  designation: string;
}

export interface Event {
  id: number;
  code: string;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  venueId: number;
  venueName: string;
  organizer: string;
  startDate: string;
  endDate: string;
  startTime: string;
  capacity: number;
  registered: number;
  ticketTypeId: number;
  ticketTypeName: string;
  ticketPrice: number;
  status: EventStatus;
  speakers: Speaker[];
  reviewNotes?: string;
}

export interface Registration {
  id: number;
  ticketCode: string;
  eventId: number;
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  enrollmentNo: string;
  ticketTypeId: number;
  ticketTypeName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  status: RegistrationStatus;
  registeredOn: string;
}

// ─── Reference Masters ──────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: 1, name: 'Cultural' },
  { id: 2, name: 'Technical' },
  { id: 3, name: 'Sports' },
  { id: 4, name: 'Seminar' },
];

export const venues: Venue[] = [
  { id: 1, name: 'Main Auditorium', block: 'Admin Block', capacity: 800 },
  { id: 2, name: 'Open Air Theatre', block: 'Central Lawn', capacity: 2000 },
  { id: 3, name: 'Seminar Hall A', block: 'Academic Block-2', capacity: 250 },
  { id: 4, name: 'Sports Complex Arena', block: 'Sports Zone', capacity: 1500 },
];

export const ticketTypes: TicketType[] = [
  { id: 1, name: 'Free Pass', price: 0 },
  { id: 2, name: 'Student', price: 100 },
  { id: 3, name: 'VIP', price: 500 },
  { id: 4, name: 'External Guest', price: 300 },
];

// ─── Events ──────────────────────────────────────────────────────────────────

export const events: Event[] = [
  {
    id: 1,
    code: 'EVT-2026-001',
    title: 'Aarohan — Annual Cultural Fest',
    description:
      'The flagship three-day cultural extravaganza featuring music, dance, drama and celebrity nights.',
    categoryId: 1,
    categoryName: 'Cultural',
    venueId: 2,
    venueName: 'Open Air Theatre',
    organizer: 'Cultural Committee',
    startDate: '12 Feb 2026',
    endDate: '14 Feb 2026',
    startTime: '17:00',
    capacity: 2000,
    registered: 1420,
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    ticketPrice: 100,
    status: 'Published',
    speakers: [
      { name: 'DJ Nucleya', designation: 'Headline Artist' },
      { name: 'The Local Train', designation: 'Live Band' },
    ],
    reviewNotes: 'Approved by Dean of Student Welfare.',
  },
  {
    id: 2,
    code: 'EVT-2026-002',
    title: 'Innovate — National Hackathon',
    description:
      '36-hour hackathon challenging students to build solutions for smart-campus problems.',
    categoryId: 2,
    categoryName: 'Technical',
    venueId: 3,
    venueName: 'Seminar Hall A',
    organizer: 'CSE Department',
    startDate: '05 Mar 2026',
    endDate: '06 Mar 2026',
    startTime: '09:00',
    capacity: 250,
    registered: 198,
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    ticketPrice: 100,
    status: 'Approved',
    speakers: [
      { name: 'Ms. Radhika Nair', designation: 'CTO, FinNova' },
      { name: 'Dr. A. Krishnan', designation: 'Head of AI Lab' },
    ],
    reviewNotes: 'Sponsorship confirmed; awaiting publish.',
  },
  {
    id: 3,
    code: 'EVT-2026-003',
    title: 'TechTalk: The Future of Quantum Computing',
    description:
      'An expert seminar on quantum computing and its implications for cryptography.',
    categoryId: 4,
    categoryName: 'Seminar',
    venueId: 1,
    venueName: 'Main Auditorium',
    organizer: 'Physics Department',
    startDate: '22 Jan 2026',
    endDate: '22 Jan 2026',
    startTime: '11:00',
    capacity: 800,
    registered: 640,
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    ticketPrice: 0,
    status: 'Completed',
    speakers: [
      { name: 'Prof. Emily Chen', designation: 'Quantum Researcher, MIT' },
    ],
    reviewNotes: 'Session recorded and archived to the library.',
  },
  {
    id: 4,
    code: 'EVT-2026-004',
    title: 'Inter-College Football Championship',
    description:
      'Knockout football tournament between engineering colleges across the region.',
    categoryId: 3,
    categoryName: 'Sports',
    venueId: 4,
    venueName: 'Sports Complex Arena',
    organizer: 'Sports Council',
    startDate: '18 Feb 2026',
    endDate: '20 Feb 2026',
    startTime: '08:00',
    capacity: 1500,
    registered: 320,
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    ticketPrice: 0,
    status: 'Published',
    speakers: [],
    reviewNotes: 'Ground booked; referees assigned.',
  },
  {
    id: 5,
    code: 'EVT-2026-005',
    title: 'Startup Pitch Fest 2026',
    description:
      'Student founders pitch their startups to a panel of investors and mentors.',
    categoryId: 2,
    categoryName: 'Technical',
    venueId: 3,
    venueName: 'Seminar Hall A',
    organizer: 'E-Cell',
    startDate: '28 Mar 2026',
    endDate: '28 Mar 2026',
    startTime: '10:00',
    capacity: 250,
    registered: 0,
    ticketTypeId: 3,
    ticketTypeName: 'VIP',
    ticketPrice: 500,
    status: 'Pending Approval',
    speakers: [{ name: 'Mr. Vivek Anand', designation: 'Angel Investor' }],
    reviewNotes: 'Submitted for Dean approval.',
  },
  {
    id: 6,
    code: 'EVT-2026-006',
    title: 'Rhythm — Classical Music Evening',
    description:
      'An evening of Indian classical music by renowned artists and student performers.',
    categoryId: 1,
    categoryName: 'Cultural',
    venueId: 1,
    venueName: 'Main Auditorium',
    organizer: 'Music Society',
    startDate: '02 Apr 2026',
    endDate: '02 Apr 2026',
    startTime: '18:30',
    capacity: 800,
    registered: 0,
    ticketTypeId: 4,
    ticketTypeName: 'External Guest',
    ticketPrice: 300,
    status: 'Draft',
    speakers: [{ name: 'Pt. Ronu Majumdar', designation: 'Flute Maestro' }],
  },
  {
    id: 7,
    code: 'EVT-2026-007',
    title: 'CodeSprint Programming Contest',
    description:
      'A timed competitive-programming contest with prizes for the top three teams.',
    categoryId: 2,
    categoryName: 'Technical',
    venueId: 3,
    venueName: 'Seminar Hall A',
    organizer: 'Coding Club',
    startDate: '10 Feb 2026',
    endDate: '10 Feb 2026',
    startTime: '14:00',
    capacity: 200,
    registered: 200,
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    ticketPrice: 100,
    status: 'Ongoing',
    speakers: [],
    reviewNotes: 'Contest live now.',
  },
  {
    id: 8,
    code: 'EVT-2025-092',
    title: 'Convocation Rehearsal Seminar',
    description:
      'Orientation and rehearsal seminar for the graduating batch convocation.',
    categoryId: 4,
    categoryName: 'Seminar',
    venueId: 1,
    venueName: 'Main Auditorium',
    organizer: 'Examination Cell',
    startDate: '08 Dec 2025',
    endDate: '08 Dec 2025',
    startTime: '10:00',
    capacity: 800,
    registered: 720,
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    ticketPrice: 0,
    status: 'Archived',
    speakers: [
      { name: 'Dr. S. Menon', designation: 'Controller of Examinations' },
    ],
    reviewNotes: 'Event concluded and archived.',
  },
  {
    id: 9,
    code: 'EVT-2026-009',
    title: 'Athletics Meet — Track & Field',
    description:
      'Annual inter-department athletics meet with track and field events.',
    categoryId: 3,
    categoryName: 'Sports',
    venueId: 4,
    venueName: 'Sports Complex Arena',
    organizer: 'Sports Council',
    startDate: '15 Mar 2026',
    endDate: '16 Mar 2026',
    startTime: '07:30',
    capacity: 1500,
    registered: 85,
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    ticketPrice: 0,
    status: 'Approved',
    speakers: [],
    reviewNotes: 'Approved; publish pending schedule finalisation.',
  },
  {
    id: 10,
    code: 'EVT-2026-010',
    title: 'AI & Ethics Symposium',
    description:
      'A one-day symposium on responsible AI, featuring academic and industry panels.',
    categoryId: 4,
    categoryName: 'Seminar',
    venueId: 3,
    venueName: 'Seminar Hall A',
    organizer: 'CSE Department',
    startDate: '20 Apr 2026',
    endDate: '20 Apr 2026',
    startTime: '09:30',
    capacity: 250,
    registered: 40,
    ticketTypeId: 4,
    ticketTypeName: 'External Guest',
    ticketPrice: 300,
    status: 'Pending Approval',
    speakers: [
      { name: 'Prof. Lena Ortiz', designation: 'AI Ethicist' },
      { name: 'Mr. Rahul Dev', designation: 'Policy Advisor' },
    ],
    reviewNotes: 'Awaiting budget clearance.',
  },
];

// ─── Registrations ────────────────────────────────────────────────────────────

export const registrations: Registration[] = [
  {
    id: 1,
    ticketCode: 'TKT-0001',
    eventId: 1,
    eventTitle: 'Aarohan — Annual Cultural Fest',
    attendeeName: 'Aditi Sharma',
    attendeeEmail: 'aditi.s@univ.edu',
    enrollmentNo: 'CS21-042',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    registeredOn: '18 Jan 2026',
  },
  {
    id: 2,
    ticketCode: 'TKT-0002',
    eventId: 1,
    eventTitle: 'Aarohan — Annual Cultural Fest',
    attendeeName: 'Rohan Verma',
    attendeeEmail: 'rohan.v@univ.edu',
    enrollmentNo: 'ME20-118',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Checked-In',
    registeredOn: '19 Jan 2026',
  },
  {
    id: 3,
    ticketCode: 'TKT-0003',
    eventId: 1,
    eventTitle: 'Aarohan — Annual Cultural Fest',
    attendeeName: 'Priya Nair',
    attendeeEmail: 'priya.n@univ.edu',
    enrollmentNo: 'EC22-007',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Pending',
    status: 'Registered',
    registeredOn: '20 Jan 2026',
  },
  {
    id: 4,
    ticketCode: 'TKT-0004',
    eventId: 2,
    eventTitle: 'Innovate — National Hackathon',
    attendeeName: 'Karan Mehta',
    attendeeEmail: 'karan.m@univ.edu',
    enrollmentNo: 'CS21-089',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    registeredOn: '01 Feb 2026',
  },
  {
    id: 5,
    ticketCode: 'TKT-0005',
    eventId: 2,
    eventTitle: 'Innovate — National Hackathon',
    attendeeName: 'Sneha Iyer',
    attendeeEmail: 'sneha.i@univ.edu',
    enrollmentNo: 'IT21-033',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Registered',
    registeredOn: '02 Feb 2026',
  },
  {
    id: 6,
    ticketCode: 'TKT-0006',
    eventId: 3,
    eventTitle: 'TechTalk: The Future of Quantum Computing',
    attendeeName: 'Ananya Rao',
    attendeeEmail: 'ananya.r@univ.edu',
    enrollmentNo: 'PH19-004',
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    amount: 0,
    paymentStatus: 'Paid',
    status: 'Checked-In',
    registeredOn: '10 Jan 2026',
  },
  {
    id: 7,
    ticketCode: 'TKT-0007',
    eventId: 3,
    eventTitle: 'TechTalk: The Future of Quantum Computing',
    attendeeName: 'Vikram Singh',
    attendeeEmail: 'vikram.s@univ.edu',
    enrollmentNo: 'PH20-011',
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    amount: 0,
    paymentStatus: 'Paid',
    status: 'Checked-In',
    registeredOn: '11 Jan 2026',
  },
  {
    id: 8,
    ticketCode: 'TKT-0008',
    eventId: 4,
    eventTitle: 'Inter-College Football Championship',
    attendeeName: 'Arjun Das',
    attendeeEmail: 'arjun.d@univ.edu',
    enrollmentNo: 'CE21-056',
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    amount: 0,
    paymentStatus: 'Paid',
    status: 'Registered',
    registeredOn: '05 Feb 2026',
  },
  {
    id: 9,
    ticketCode: 'TKT-0009',
    eventId: 4,
    eventTitle: 'Inter-College Football Championship',
    attendeeName: 'Meera Joshi',
    attendeeEmail: 'meera.j@univ.edu',
    enrollmentNo: 'CS22-101',
    ticketTypeId: 1,
    ticketTypeName: 'Free Pass',
    amount: 0,
    paymentStatus: 'Paid',
    status: 'Cancelled',
    registeredOn: '06 Feb 2026',
  },
  {
    id: 10,
    ticketCode: 'TKT-0010',
    eventId: 5,
    eventTitle: 'Startup Pitch Fest 2026',
    attendeeName: 'Nikhil Kapoor',
    attendeeEmail: 'nikhil.k@univ.edu',
    enrollmentNo: 'MBA24-015',
    ticketTypeId: 3,
    ticketTypeName: 'VIP',
    amount: 500,
    paymentStatus: 'Pending',
    status: 'Registered',
    registeredOn: '15 Feb 2026',
  },
  {
    id: 11,
    ticketCode: 'TKT-0011',
    eventId: 7,
    eventTitle: 'CodeSprint Programming Contest',
    attendeeName: 'Divya Menon',
    attendeeEmail: 'divya.m@univ.edu',
    enrollmentNo: 'IT20-072',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Checked-In',
    registeredOn: '01 Feb 2026',
  },
  {
    id: 12,
    ticketCode: 'TKT-0012',
    eventId: 7,
    eventTitle: 'CodeSprint Programming Contest',
    attendeeName: 'Sameer Khan',
    attendeeEmail: 'sameer.k@univ.edu',
    enrollmentNo: 'CS21-063',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Refunded',
    status: 'Cancelled',
    registeredOn: '02 Feb 2026',
  },
  {
    id: 13,
    ticketCode: 'TKT-0013',
    eventId: 1,
    eventTitle: 'Aarohan — Annual Cultural Fest',
    attendeeName: 'Tara Bhatt',
    attendeeEmail: 'tara.b@univ.edu',
    enrollmentNo: 'EC21-029',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    registeredOn: '21 Jan 2026',
  },
  {
    id: 14,
    ticketCode: 'TKT-0014',
    eventId: 10,
    eventTitle: 'AI & Ethics Symposium',
    attendeeName: 'Ishaan Gupta',
    attendeeEmail: 'ishaan.g@univ.edu',
    enrollmentNo: 'CS20-004',
    ticketTypeId: 4,
    ticketTypeName: 'External Guest',
    amount: 300,
    paymentStatus: 'Pending',
    status: 'Registered',
    registeredOn: '16 Feb 2026',
  },
  {
    id: 15,
    ticketCode: 'TKT-0015',
    eventId: 2,
    eventTitle: 'Innovate — National Hackathon',
    attendeeName: 'Lakshmi Pillai',
    attendeeEmail: 'lakshmi.p@univ.edu',
    enrollmentNo: 'IT21-090',
    ticketTypeId: 2,
    ticketTypeName: 'Student',
    amount: 100,
    paymentStatus: 'Failed',
    status: 'Registered',
    registeredOn: '03 Feb 2026',
  },
];

// ─── Status → StatusBadge variant mappers ───────────────────────────────────

export function eventStatusVariant(
  status: EventStatus
): 'success' | 'info' | 'warning' | 'muted' {
  switch (status) {
    case 'Published':
    case 'Approved':
      return 'success';
    case 'Ongoing':
      return 'info';
    case 'Pending Approval':
    case 'Draft':
      return 'warning';
    case 'Completed':
    case 'Archived':
      return 'muted';
  }
}

export function registrationStatusVariant(
  status: RegistrationStatus
): 'info' | 'success' | 'danger' {
  switch (status) {
    case 'Registered':
      return 'info';
    case 'Confirmed':
    case 'Checked-In':
      return 'success';
    case 'Cancelled':
      return 'danger';
  }
}

export function paymentStatusVariant(
  status: PaymentStatus
): 'warning' | 'success' | 'danger' {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Paid':
      return 'success';
    case 'Refunded':
    case 'Failed':
      return 'danger';
  }
}
