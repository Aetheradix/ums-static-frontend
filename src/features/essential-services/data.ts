export interface ApprovalHierarchy {
  id: string;
  type: 'Parking' | 'Conference Hall' | 'Guest House' | 'Transport Request';
  organisationUnit: string;
  verifierDetail: string;
  approverDetail: string;
  status: 'Active' | 'Inactive';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface ParkingRequest {
  id: string;
  accountType: 'Employee' | 'Administrative';
  userName: string;
  vehicleType: 'Two-Wheeler' | 'Four-Wheeler';
  registrationNumber: string;
  description: string;
  startDate: string;
  endDate: string;
  allottedSlot?: string;
  reason?: string;
  status: 'Approved' | 'Rejected' | 'Cancelled' | 'Pending';
  createdDate: string;
}

export interface ConferenceHallType {
  id: string;
  type: string;
  status: 'Active' | 'Inactive';
}

export interface ConferenceHall {
  id: string;
  hallNo: string;
  name: string;
  incharge: string;
  inchargeMobile: string;
  inchargeEmail: string;
  description: string;
  status: 'Active' | 'Inactive';
  isPublished: boolean;
}

export interface ConferenceBooking {
  id: string;
  accountType: 'Employee' | 'Administrative';
  coordinatorName: string;
  level: 'Departmental' | 'University' | 'National' | 'International';
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  hallNo: string;
  participants: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
}

export interface RoomType {
  id: string;
  name: string;
  amount: number;
  status: 'Active' | 'Inactive';
}

export interface GuestHouse {
  id: string;
  name: string;
  description: string;
  incharge: string;
  inchargeMobile: string;
  inchargeEmail: string;
  genderEligibility: 'MEN' | 'WOMEN' | 'BOTH';
  location: string;
  status: 'Active' | 'Inactive';
  isPublished: boolean;
}

export interface RoomDetail {
  id: string;
  guestHouseId: string;
  roomNo: string;
  roomType: string;
  amount: number;
  facilities: string;
  status: 'Active' | 'Inactive';
  isPublished: boolean;
}

export interface TaxMethod {
  id: string;
  name: string;
  percentage: number;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface GuestType {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface ExpenditureHead {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface GuestHouseBooking {
  id: string;
  guestHouseName: string;
  guestType: string;
  expenditureHead: string;
  guestName: string;
  designation: string;
  contact: string;
  email: string;
  nationality: string;
  accountType: 'Employee' | 'Administrative';
  userName: string;
  purpose: string;
  accompanyingPerson: string;
  arrivalDate: string;
  departureDate: string;
  roomType: string;
  occupancyCount: number;
  roomsRequired: number;
  mealIncluded: 'Yes' | 'No';
  mealPreference?: 'Veg' | 'Non-Veg' | 'Other';
  specialRequirements?: string;
  status:
    | 'Pending'
    | 'Approved'
    | 'Check-In'
    | 'Check-Out'
    | 'Rejected'
    | 'Cancelled';
  allottedRooms?: string;
  referenceDoc?: string;
  visitorIdProof?: string;
  paymentCaptured?: boolean;
}

export interface TransportBooking {
  id: string;
  vehicleType: string;
  capacity: number;
  requestFor: 'Self' | 'Guest' | 'Official Work';
  guestName: string;
  address: string;
  contact: string;
  departureFrom: string;
  arrivalTo: string;
  reason: string;
  accountType: 'Employee' | 'Administrative';
  inchargeName: string;
  startDate: string;
  endDate: string;
  otherInfo?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  assignedVehicle?: {
    isUniversity: 'Yes' | 'No';
    vehicleDetails: string;
    driverName: string;
    remarks?: string;
  };
}

export interface SystemLog {
  id: string;
  service: 'Parking' | 'Conference' | 'Guest House' | 'Transport';
  type: 'Email' | 'Action';
  recipientOrUser: string;
  subjectOrAction: string;
  contentOrRemarks: string;
  timestamp: string;
}

// Mock Data Definitions
export const initialApprovalHierarchies: ApprovalHierarchy[] = [
  {
    id: '1',
    type: 'Parking',
    organisationUnit: 'Central Administration',
    verifierDetail: 'Assistant Registrar',
    approverDetail: 'Registrar',
    status: 'Active',
  },
  {
    id: '2',
    type: 'Conference Hall',
    organisationUnit: 'School of Engineering',
    verifierDetail: 'Dean Secretary',
    approverDetail: 'Dean',
    status: 'Active',
  },
  {
    id: '3',
    type: 'Guest House',
    organisationUnit: 'Campus Services',
    verifierDetail: 'Guest House Manager',
    approverDetail: 'Estate Officer',
    status: 'Active',
  },
  {
    id: '4',
    type: 'Transport Request',
    organisationUnit: 'Transport Division',
    verifierDetail: 'Transport Supervisor',
    approverDetail: 'Transport Admin',
    status: 'Active',
  },
];

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Guest House Request Approval',
    subject: 'Your Guest House Request Has Been Approved',
    description:
      'Dear {Applicant},\n\nWe are pleased to inform you that your request for accommodation at {GuestHouseName} has been approved.\n\nRoom Number(s) Allotted: {RoomNo}\nCheck-in Date: {ArrivalDate}\n\nBest regards,\nCampus Services Team',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Parking Request Rejection',
    subject: 'Parking Request Status Update',
    description:
      'Dear {Applicant},\n\nWe regret to inform you that your parking space booking request has been rejected due to: {Reason}.\n\nThank you for your understanding.\n\nSecurity Administration',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Transport Booking Confirmation',
    subject: 'Transport Booking Confirmation',
    description:
      'Dear {Applicant},\n\nYour transport booking from {Departure} to {Arrival} has been approved.\n\nVehicle: {Vehicle}\nDriver Name: {DriverName}\nContact: {DriverContact}\n\nHave a safe journey,\nTransport Cell',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Conference Hall Approval Notification',
    subject: 'Conference Hall Booking Confirmation',
    description:
      'Dear Coordinator,\n\nThis is to confirm that {HallName} has been reserved for the conference: "{ConferenceTitle}".\n\nDate: {StartDate} to {EndDate}\n\nSincerely,\nEstate Office',
    status: 'Active',
  },
];

export const initialParkingRequests: ParkingRequest[] = [
  {
    id: 'PRK-001',
    accountType: 'Employee',
    userName: 'Dr. Ramesh Chandra',
    vehicleType: 'Four-Wheeler',
    registrationNumber: 'DL11AB1234',
    description: 'Daily commute of faculty member',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    allottedSlot: 'Slot A-24',
    status: 'Approved',
    createdDate: '2026-06-25',
  },
  {
    id: 'PRK-002',
    accountType: 'Administrative',
    userName: 'Admin Support',
    vehicleType: 'Two-Wheeler',
    registrationNumber: 'MH02XY5678',
    description: 'Official pool vehicle parking request',
    startDate: '2026-07-05',
    endDate: '2027-07-05',
    status: 'Pending',
    createdDate: '2026-06-29',
  },
];

export const initialConferenceHallTypes: ConferenceHallType[] = [
  { id: '1', type: 'Auditorium', status: 'Active' },
  { id: '2', type: 'Executive Boardroom', status: 'Active' },
  { id: '3', type: 'Seminar Hall', status: 'Active' },
];

export const initialConferenceHalls: ConferenceHall[] = [
  {
    id: '1',
    hallNo: 'CONF-101',
    name: 'Rabindranath Tagore Auditorium',
    incharge: 'Prof. J. K. Bose',
    inchargeMobile: '+1 (555) 012-3456',
    inchargeEmail: 'jkbose@univ.edu',
    description:
      'Large auditorium with 500 seating capacity and line-array audio.',
    status: 'Active',
    isPublished: true,
  },
  {
    id: '2',
    hallNo: 'CONF-202',
    name: 'Newton Seminar Room',
    incharge: 'Dr. Sarah Connor',
    inchargeMobile: '+1 (555) 012-7890',
    inchargeEmail: 'sconnor@univ.edu',
    description: 'Corporate style meeting room with interactive smartboard.',
    status: 'Active',
    isPublished: false,
  },
];

export const initialConferenceBookings: ConferenceBooking[] = [
  {
    id: 'CRQ-001',
    accountType: 'Employee',
    coordinatorName: 'Dr. Alan Turing',
    level: 'National',
    title: 'AI and Robotics Symposium 2026',
    purpose: 'Research collaboration conference',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    hallNo: 'CONF-101',
    participants: 150,
    status: 'Approved',
  },
  {
    id: 'CRQ-002',
    accountType: 'Administrative',
    coordinatorName: 'Registrar Office',
    level: 'University',
    title: 'Quarterly Academic Senate',
    purpose: 'Board meeting',
    startDate: '2026-07-15',
    endDate: '2026-07-15',
    hallNo: 'CONF-202',
    participants: 45,
    status: 'Pending',
  },
];

export const initialRoomTypes: RoomType[] = [
  { id: '1', name: 'Single Standard', amount: 800, status: 'Active' },
  { id: '2', name: 'Double Deluxe', amount: 1500, status: 'Active' },
  { id: '3', name: 'VIP Suite', amount: 3500, status: 'Active' },
];

export const initialGuestHouses: GuestHouse[] = [
  {
    id: '1',
    name: 'Main Campus Guest House',
    description:
      'Executive guest house with modern dining hall and green lawns.',
    incharge: 'Manager Product',
    inchargeMobile: '+1 (555) 019-9911',
    inchargeEmail: 'ghmanager@univ.edu',
    genderEligibility: 'BOTH',
    location: 'Near North Gate',
    status: 'Active',
    isPublished: true,
  },
];

export const initialRoomDetails: RoomDetail[] = [
  {
    id: '101',
    guestHouseId: '1',
    roomNo: 'GH-101',
    roomType: 'Single Standard',
    amount: 800,
    facilities: 'AC, Wifi, Cable TV, Geyser',
    status: 'Active',
    isPublished: true,
  },
  {
    id: '102',
    guestHouseId: '1',
    roomNo: 'GH-202',
    roomType: 'VIP Suite',
    amount: 3500,
    facilities: 'AC, Wifi, Mini Fridge, Sofa, Balcony',
    status: 'Active',
    isPublished: true,
  },
];

export const initialTaxMethods: TaxMethod[] = [
  {
    id: '1',
    name: 'VAT / Service Tax',
    percentage: 12,
    description: 'Standard service tax applied to room bookings',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Luxury Tax',
    percentage: 5,
    description: 'Tax applicable on premium/VIP room rates',
    status: 'Active',
  },
];

export const initialGuestTypes: GuestType[] = [
  { id: '1', name: 'Official Institutional Guest', status: 'Active' },
  { id: '2', name: 'Personal Employee Guest', status: 'Active' },
];

export const initialExpenditureHeads: ExpenditureHead[] = [
  { id: '1', name: 'Dean Academics Budget', status: 'Active' },
  { id: '2', name: 'Registrar Office Contingency', status: 'Active' },
];

export const initialGuestHouseBookings: GuestHouseBooking[] = [
  {
    id: 'GHB-001',
    guestHouseName: 'Main Campus Guest House',
    guestType: 'Official Institutional Guest',
    expenditureHead: 'Dean Academics Budget',
    guestName: 'Prof. Richard Feynman',
    designation: 'Emeritus Professor of Physics, Caltech',
    contact: '+1 (555) 019-4455',
    email: 'feynman@caltech.edu',
    nationality: 'American',
    accountType: 'Employee',
    userName: 'Dr. Ramesh Chandra',
    purpose: 'Invited speaker for Convocation',
    accompanyingPerson: 'None',
    arrivalDate: '2026-07-15 14:00',
    departureDate: '2026-07-20 12:00',
    roomType: 'VIP Suite',
    occupancyCount: 1,
    roomsRequired: 1,
    mealIncluded: 'Yes',
    mealPreference: 'Veg',
    status: 'Approved',
    allottedRooms: 'Room GH-202',
    paymentCaptured: false,
  },
  {
    id: 'GHB-002',
    guestHouseName: 'Main Campus Guest House',
    guestType: 'Personal Employee Guest',
    expenditureHead: 'Registrar Office Contingency',
    guestName: 'Sunita Chandra',
    designation: 'Spouse',
    contact: '+1 (555) 019-2233',
    email: 'sunita@chandra.com',
    nationality: 'Indian',
    accountType: 'Employee',
    userName: 'Dr. Ramesh Chandra',
    purpose: 'Family visit',
    accompanyingPerson: 'None',
    arrivalDate: '2026-06-28 10:00',
    departureDate: '2026-06-30 18:00',
    roomType: 'Single Standard',
    occupancyCount: 1,
    roomsRequired: 1,
    mealIncluded: 'No',
    status: 'Check-In',
    allottedRooms: 'Room GH-101',
    referenceDoc: 'approval_letter.pdf',
    visitorIdProof: 'id_proof.png',
    paymentCaptured: true,
  },
];

export const initialTransportBookings: TransportBooking[] = [
  {
    id: 'TRP-001',
    vehicleType: 'Car',
    capacity: 4,
    requestFor: 'Guest',
    guestName: 'Prof. Richard Feynman',
    address: 'International Airport T3',
    contact: '+1 (555) 019-4455',
    departureFrom: 'Airport Terminal 3',
    arrivalTo: 'Main Campus Guest House',
    reason: 'Airport Pickup for VIP guest',
    accountType: 'Employee',
    inchargeName: 'Dr. Ramesh Chandra',
    startDate: '2026-07-15 13:00',
    endDate: '2026-07-15 15:00',
    status: 'Approved',
    assignedVehicle: {
      isUniversity: 'Yes',
      vehicleDetails: 'Toyota Camry (Registration: DL4CAF7781)',
      driverName: 'Sanjay Kumar (Mobile: +1 (555) 019-4433)',
      remarks: 'Flight status is on-time.',
    },
  },
  {
    id: 'TRP-002',
    vehicleType: 'Bus',
    capacity: 40,
    requestFor: 'Official Work',
    guestName: 'Student Researchers',
    address: 'Science Exhibition Center',
    contact: '+1 (555) 019-1122',
    departureFrom: 'Campus Main Gate',
    arrivalTo: 'Science Exhibition Center',
    reason: 'Excursion trip for engineering students',
    accountType: 'Administrative',
    inchargeName: 'Admin Support',
    startDate: '2026-07-22 08:00',
    endDate: '2026-07-22 17:00',
    status: 'Pending',
  },
];

export const initialSystemLogs: SystemLog[] = [
  {
    id: '1',
    service: 'Parking',
    type: 'Email',
    recipientOrUser: 'ramesh.c@univ.edu',
    subjectOrAction: 'Parking Allocation Confirmation',
    contentOrRemarks:
      'Parking slot A-24 allocated and confirmation email dispatched.',
    timestamp: '2026-06-25 10:15',
  },
  {
    id: '2',
    service: 'Guest House',
    type: 'Action',
    recipientOrUser: 'Admin Clerk',
    subjectOrAction: 'Check-In Logged',
    contentOrRemarks:
      'Guest Sunita Chandra checked into room GH-101. ID and reference doc uploaded.',
    timestamp: '2026-06-28 10:30',
  },
  {
    id: '3',
    service: 'Conference',
    type: 'Action',
    recipientOrUser: 'estate_officer',
    subjectOrAction: 'Senate Room Published',
    contentOrRemarks: 'Rabindranath Tagore Auditorium locked and published.',
    timestamp: '2026-06-24 14:00',
  },
];

export const parkingEndYearSetting = 2030;
export const currentPaymentDetailConfig = 'At the time of Check-In';
export const guestTypeWiseChargesSwitch = 'Yes';
export const guestHouseCancelDisableTime = '24 Hours before check-in';
export const guestHouseAlertDisclaimer =
  'Please check-out by 12:00 noon. Room charges do not include laundry or extra meals.';
