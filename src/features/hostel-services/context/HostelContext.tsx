import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

// Portal / Role Types
export type PortalRole = 'admin' | 'warden' | 'student';

// Mock logged-in identities for the static frontend
export const MOCK_STUDENT_ID = 'S101';
export const MOCK_STUDENT_NAME = 'Rahul Verma';
export const MOCK_WARDEN_HOSTEL_ID = 'H1'; // Warden Rajesh Kumar → Boys Hostel Block A

// Common Types
export type Status = 'Active' | 'Inactive';
export type Visible = 'Yes' | 'No';

export interface BaseMaster {
  id: string;
  status: Status;
  visible: Visible;
}

// 1. Hostel Master
export interface Hostel extends BaseMaster {
  name: string;
  code: string;
  type: 'Boys' | 'Girls' | 'Co-ed' | 'Staff' | 'PG Scholar';
  affiliatedCampus: string;
  totalCapacity: number;
  wardenName: string;
  deputyWarden: string;
  address: string;
  latitude: string;
  longitude: string;
  distanceFromCampus: number;
  modeOfTransport: string;
  nearestPoliceStation: string;
  distanceToPoliceStation: number;
  policeStationContact: string;
  nearestHospital: string;
  safetyNotes: string;
  cctvCoverage: 'Y' | 'N';
}

// 2. Building Master
export interface Building extends BaseMaster {
  name: string;
  hostelId: string;
  numberOfFloors: number;
}

// 3. Room Type Master
export interface RoomType extends BaseMaster {
  name: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  defaultCapacity: number;
  defaultFee: number;
}

// 4. Room & Bed Master
export interface Room extends BaseMaster {
  buildingId: string;
  hostelId: string;
  roomNumber: string;
  roomTypeId: string;
  capacity: number;
  applyFee: 'Y' | 'N';
}

// 5. Warden/Staff Master
export interface WardenStaff extends BaseMaster {
  name: string;
  role: 'Warden' | 'Deputy Warden' | 'Caretaker' | 'Security';
  hostelId: string;
  contactNumber: string;
}

// 6. Facility Master
export interface Facility extends BaseMaster {
  name: string;
}

// 7. Hostel-Facility Mapping
export interface HostelFacility extends BaseMaster {
  hostelId: string;
  facilityId: string;
  feeApplicable: 'Y' | 'N';
}

// 8. Mess/Menu Master
export interface MessMenu extends BaseMaster {
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  foodItems: string;
}

// 9. Hostel Request Type Master
export interface RequestType extends BaseMaster {
  name: string;
  category: 'Maintenance' | 'Facility' | 'Disciplinary' | 'General';
}

// 10. Fee Component Master
export interface FeeComponent extends BaseMaster {
  name: string;
  facilityId: string;
  amount: number;
  oneTime: 'Y' | 'N';
  lateFeeApplicable: 'Y' | 'N';
  billingStartDate: string;
  billingLastDate: string;
}

// 11. Rule/Policy Master
export interface RulePolicy extends BaseMaster {
  title: string;
  description: string;
}

// Transaction Types
export interface HostelApplication {
  id: string;
  studentName: string;
  studentId: string;
  hostelId: string;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface RoomAllocation {
  id: string;
  hostelId: string;
  buildingId: string;
  roomId: string;
  studentName: string;
  studentId: string;
  validFrom: string;
  validTill: string;
  status: 'Active' | 'Terminated';
}

export interface FeeGeneration {
  id: string;
  studentId: string;
  facilityId: string;
  month: string;
  startDate: string;
  lastDate: string;
  amount: number;
  status: Status;
  visible: Visible;
}

export interface FeeCollection {
  id: string;
  studentId: string;
  studentName: string;
  feeComponentId: string;
  amountPaid: number;
  paymentDate: string;
  receiptNo: string;
  status: 'Paid' | 'Pending';
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  date: string;
  inTime: string;
  outTime: string;
  status: 'Present' | 'Absent' | 'Night-Out';
}

export interface LeaveOutpass {
  id: string;
  studentId: string;
  studentName: string;
  leaveType: 'Leave' | 'Outpass';
  fromDate: string;
  toDate: string;
  reason: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy: string;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  studentVisited: string;
  relation: string;
  purpose: string;
  timeIn: string;
  timeOut: string;
  idProofType: string;
}

export interface HostelRequestComplaint {
  id: string;
  studentName: string;
  categoryId: string; // from RequestType
  type: string; // from RequestType
  description: string;
  resolution: string;
  resolutionDate: string;
  status: 'Open' | 'Resolved';
}

export interface IncidentReport {
  id: string;
  studentName: string; // optional
  incidentDescription: string;
  reportedBy: string;
  date: string;
  status: 'Under Investigation' | 'Closed';
}

export interface DisciplinaryAction {
  id: string;
  studentName: string;
  reason: string;
  fineAmount: number;
  actionTaken: string;
  date: string;
  status: 'Pending' | 'Actioned';
}

export interface RoomChangeRequest {
  id: string;
  studentName: string;
  currentRoom: string;
  requestedRoom: string;
  reason: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface StudentFacilityMapping {
  id: string;
  studentName: string;
  facilityId: string;
  mappedDate: string;
}

export interface CheckoutRefund {
  id: string;
  studentName: string;
  roomId: string;
  vacateDate: string;
  depositAmount: number;
  refundAmount: number;
  refundStatus: 'Processed' | 'Pending';
}

export interface FoodStock {
  id: string;
  itemName: string;
  category: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  threshold: number;
  expiryDate: string;
  supplierInfo: string;
  status: Status;
}

export interface HostelUtility {
  id: string;
  assetName: string;
  category:
    | 'Furniture'
    | 'Appliances'
    | 'Maintenance Supplies'
    | 'Linen & Bedding';
  hostelId: string;
  quantity: number;
  threshold: number;
  condition: 'Good' | 'Needs Repair' | 'Damaged';
  lastRestocked: string;
}

export interface MaintenanceTicket {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  assetId?: string;
  category: 'Plumbing' | 'Electrical' | 'Structural' | 'Furniture' | 'General';
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  description: string;
  assignedTechnician: string;
  status: 'Logged' | 'Assigned' | 'Resolved';
  loggedDate: string;
  assignedDate?: string;
  resolvedDate?: string;
  studentSignature?: string;
}

export interface MockData {
  hostels: Hostel[];
  buildings: Building[];
  roomTypes: RoomType[];
  rooms: Room[];
  wardenStaff: WardenStaff[];
  facilities: Facility[];
  hostelFacilities: HostelFacility[];
  messMenus: MessMenu[];
  requestTypes: RequestType[];
  feeComponents: FeeComponent[];
  rulePolicies: RulePolicy[];
  applications: HostelApplication[];
  allocations: RoomAllocation[];
  feeGenerations: FeeGeneration[];
  feeCollections: FeeCollection[];
  attendance: Attendance[];
  leaves: LeaveOutpass[];
  visitorLogs: VisitorLog[];
  requests: HostelRequestComplaint[];
  incidents: IncidentReport[];
  disciplinaryActions: DisciplinaryAction[];
  roomChangeRequests: RoomChangeRequest[];
  studentFacilities: StudentFacilityMapping[];
  checkouts: CheckoutRefund[];
  foodStock: FoodStock[];
  hostelUtilities: HostelUtility[];
  maintenanceTickets: MaintenanceTicket[];
}

// Sample Data Generation
// Sample Data Generation
const generateSampleData = (): MockData => ({
  hostels: [
    {
      id: 'H1',
      name: 'Boys Hostel - Block A',
      code: 'BHA',
      type: 'Boys',
      affiliatedCampus: 'Main Campus',
      totalCapacity: 200,
      wardenName: 'Rajesh Kumar',
      deputyWarden: 'Suresh Singh',
      address: 'University Campus, Bhopal',
      latitude: '23.2599',
      longitude: '77.4126',
      distanceFromCampus: 0.5,
      modeOfTransport: 'Walking',
      nearestPoliceStation: 'Campus PS',
      distanceToPoliceStation: 1.2,
      policeStationContact: '100',
      nearestHospital: 'University Clinic',
      safetyNotes: 'First aid on ground floor',
      cctvCoverage: 'Y',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'H2',
      name: 'Girls Hostel - Rose Wing',
      code: 'GHR',
      type: 'Girls',
      affiliatedCampus: 'Main Campus',
      totalCapacity: 150,
      wardenName: 'Sunita Sharma',
      deputyWarden: 'Anita Patel',
      address: 'University Campus, Bhopal',
      latitude: '23.2599',
      longitude: '77.4126',
      distanceFromCampus: 0.8,
      modeOfTransport: 'Walking',
      nearestPoliceStation: 'Campus PS',
      distanceToPoliceStation: 1.5,
      policeStationContact: '100',
      nearestHospital: 'University Clinic',
      safetyNotes: 'Strict entry after 8 PM',
      cctvCoverage: 'Y',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'H3',
      name: 'PG Executive Hostel',
      code: 'PGEH',
      type: 'Co-ed',
      affiliatedCampus: 'North Campus',
      totalCapacity: 100,
      wardenName: 'Dr. Vikram Rathore',
      deputyWarden: 'Meena Devi',
      address: 'North Campus Residency, Bhopal',
      latitude: '23.2650',
      longitude: '77.4200',
      distanceFromCampus: 1.2,
      modeOfTransport: 'Shuttle Bus',
      nearestPoliceStation: 'North PS',
      distanceToPoliceStation: 2.0,
      policeStationContact: '100',
      nearestHospital: 'City General Hospital',
      safetyNotes: '24/7 Security Guard Desk',
      cctvCoverage: 'Y',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  buildings: [
    {
      id: 'B1',
      name: 'Block A Main',
      hostelId: 'H1',
      numberOfFloors: 4,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'B2',
      name: 'Block A Annex',
      hostelId: 'H1',
      numberOfFloors: 3,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'B3',
      name: 'Rose Wing North',
      hostelId: 'H2',
      numberOfFloors: 3,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'B4',
      name: 'Rose Wing South',
      hostelId: 'H2',
      numberOfFloors: 3,
      status: 'Active',
      visible: 'Yes',
    },
  ],
  roomTypes: [
    {
      id: 'RT1',
      name: 'Single',
      defaultCapacity: 1,
      defaultFee: 5000,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RT2',
      name: 'Double',
      defaultCapacity: 2,
      defaultFee: 3000,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RT3',
      name: 'Triple',
      defaultCapacity: 3,
      defaultFee: 2200,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RT4',
      name: 'Dormitory',
      defaultCapacity: 1,
      defaultFee: 7500,
      status: 'Active',
      visible: 'Yes',
    },
  ],
  rooms: Array.from({ length: 12 }).map((_, i) => ({
    id: `R${i + 1}`,
    buildingId: i < 6 ? (i % 2 === 0 ? 'B1' : 'B2') : i % 2 === 0 ? 'B3' : 'B4',
    hostelId: i < 6 ? 'H1' : 'H2',
    roomNumber: `${i < 6 ? 'A' : 'R'}-${101 + i}`,
    roomTypeId:
      i % 4 === 0 ? 'RT1' : i % 4 === 1 ? 'RT2' : i % 4 === 2 ? 'RT3' : 'RT4',
    capacity: i % 4 === 0 ? 1 : i % 4 === 1 ? 2 : i % 4 === 2 ? 3 : 1,
    applyFee: 'Y',
    status: 'Active',
    visible: 'Yes',
  })),
  wardenStaff: [
    {
      id: 'W1',
      name: 'Rajesh Kumar',
      role: 'Warden',
      hostelId: 'H1',
      contactNumber: '9876543210',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'W2',
      name: 'Sunita Sharma',
      role: 'Warden',
      hostelId: 'H2',
      contactNumber: '9876543211',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'W3',
      name: 'Dr. Vikram Rathore',
      role: 'Warden',
      hostelId: 'H3',
      contactNumber: '9876543212',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'W4',
      name: 'Suresh Singh',
      role: 'Caretaker',
      hostelId: 'H1',
      contactNumber: '9876543213',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'W5',
      name: 'Anita Patel',
      role: 'Deputy Warden',
      hostelId: 'H2',
      contactNumber: '9876543214',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  facilities: [
    {
      id: 'F1',
      name: 'Gymnasium & Fitness Club',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'F2',
      name: 'Automatic Laundry Services',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'F3',
      name: 'High-Speed Wi-Fi Zone',
      status: 'Active',
      visible: 'Yes',
    },
    { id: 'F4', name: 'Study Reading Room', status: 'Active', visible: 'Yes' },
    { id: 'F5', name: 'Indoor Games Hall', status: 'Active', visible: 'Yes' },
  ],
  hostelFacilities: [
    {
      id: 'HF1',
      hostelId: 'H1',
      facilityId: 'F1',
      feeApplicable: 'N',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'HF2',
      hostelId: 'H1',
      facilityId: 'F2',
      feeApplicable: 'Y',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'HF3',
      hostelId: 'H2',
      facilityId: 'F3',
      feeApplicable: 'N',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'HF4',
      hostelId: 'H2',
      facilityId: 'F4',
      feeApplicable: 'N',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  messMenus: [
    {
      id: 'M1',
      day: 'Monday',
      meal: 'Breakfast',
      foodItems: 'Poha, Jalebi, Tea, Sprouts',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M2',
      day: 'Monday',
      meal: 'Lunch',
      foodItems: 'Roti, Dal Tadka, Jeera Rice, Bhindi Masala, Salad',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M3',
      day: 'Monday',
      meal: 'Snacks',
      foodItems: 'Samosa, Mint Chutney, Coffee',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M4',
      day: 'Monday',
      meal: 'Dinner',
      foodItems: 'Roti, Paneer Butter Masala, Veg Biryani, Gulab Jamun',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M5',
      day: 'Tuesday',
      meal: 'Breakfast',
      foodItems: 'Idli, Sambhar, Coconut Chutney, Tea',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M6',
      day: 'Tuesday',
      meal: 'Lunch',
      foodItems: 'Roti, Rajma, Steamed Rice, Aloo Gobhi',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M7',
      day: 'Wednesday',
      meal: 'Breakfast',
      foodItems: 'Aloo Paratha, Curd, Pickle, Tea',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M8',
      day: 'Wednesday',
      meal: 'Dinner',
      foodItems: 'Roti, Chana Masala, Veg Pulao, Kheer',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M9',
      day: 'Thursday',
      meal: 'Lunch',
      foodItems: 'Roti, Dal Fry, Veg Kolhapuri, Steamed Rice',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M10',
      day: 'Friday',
      meal: 'Dinner',
      foodItems: 'Roti, Dal Makhani, Veg Fried Rice, Ice Cream',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  requestTypes: [
    {
      id: 'RQ1',
      name: 'Electrical Repair',
      category: 'Maintenance',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RQ2',
      name: 'Plumbing Issue',
      category: 'Maintenance',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RQ3',
      name: 'Furniture Repair',
      category: 'Maintenance',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RQ4',
      name: 'Wi-Fi Connectivity',
      category: 'Facility',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RQ5',
      name: 'Pest Control & Cleaning',
      category: 'General',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  feeComponents: [
    {
      id: 'FC1',
      name: 'Hostel Term Fee',
      facilityId: '',
      amount: 15000,
      oneTime: 'N',
      lateFeeApplicable: 'Y',
      billingStartDate: '2026-08-01',
      billingLastDate: '2026-08-15',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'FC2',
      name: 'Mess Monthly Charge',
      facilityId: '',
      amount: 4500,
      oneTime: 'N',
      lateFeeApplicable: 'Y',
      billingStartDate: '2026-08-01',
      billingLastDate: '2026-08-05',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'FC3',
      name: 'Laundry Monthly Fee',
      facilityId: 'F2',
      amount: 500,
      oneTime: 'N',
      lateFeeApplicable: 'N',
      billingStartDate: '2026-08-01',
      billingLastDate: '2026-08-05',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'FC4',
      name: 'Caution Deposit (Refundable)',
      facilityId: '',
      amount: 5000,
      oneTime: 'Y',
      lateFeeApplicable: 'N',
      billingStartDate: '2026-08-01',
      billingLastDate: '2026-08-10',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  rulePolicies: [
    {
      id: 'RP1',
      title: 'Hostel Curfew Timing',
      description:
        'All hostel residents must enter premises by 9:00 PM on weekdays and 9:30 PM on weekends.',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RP2',
      title: 'Visitor Entry Policy',
      description:
        'External visitors are permitted only in the ground floor visitor hall between 4:00 PM and 7:00 PM with valid ID proof.',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'RP3',
      title: 'Quiet Study Hours',
      description:
        'Strict silence must be maintained in corridors and rooms from 10:00 PM to 6:00 AM.',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  applications: [
    {
      id: 'APP1',
      studentName: 'Rahul Verma',
      studentId: 'S101',
      hostelId: 'H1',
      applicationDate: '2026-07-10',
      status: 'Approved',
    },
    {
      id: 'APP2',
      studentName: 'Priya Singh',
      studentId: 'S102',
      hostelId: 'H2',
      applicationDate: '2026-07-12',
      status: 'Pending',
    },
    {
      id: 'APP3',
      studentName: 'Amit Patel',
      studentId: 'S103',
      hostelId: 'H1',
      applicationDate: '2026-07-14',
      status: 'Approved',
    },
    {
      id: 'APP4',
      studentName: 'Sneha Rao',
      studentId: 'S104',
      hostelId: 'H2',
      applicationDate: '2026-07-15',
      status: 'Pending',
    },
    {
      id: 'APP5',
      studentName: 'Vikram Joshi',
      studentId: 'S105',
      hostelId: 'H3',
      applicationDate: '2026-07-18',
      status: 'Approved',
    },
  ],
  allocations: [
    {
      id: 'AL1',
      hostelId: 'H1',
      buildingId: 'B1',
      roomId: 'R1',
      studentName: 'Rahul Verma',
      studentId: 'S101',
      validFrom: '2026-08-01',
      validTill: '2027-05-31',
      status: 'Active',
    },
    {
      id: 'AL2',
      hostelId: 'H2',
      buildingId: 'B3',
      roomId: 'R7',
      studentName: 'Priya Singh',
      studentId: 'S102',
      validFrom: '2026-08-01',
      validTill: '2027-05-31',
      status: 'Active',
    },
    {
      id: 'AL3',
      hostelId: 'H1',
      buildingId: 'B1',
      roomId: 'R2',
      studentName: 'Amit Patel',
      studentId: 'S103',
      validFrom: '2026-08-01',
      validTill: '2027-05-31',
      status: 'Active',
    },
    {
      id: 'AL4',
      hostelId: 'H3',
      buildingId: 'B1',
      roomId: 'R3',
      studentName: 'Vikram Joshi',
      studentId: 'S105',
      validFrom: '2026-08-01',
      validTill: '2027-05-31',
      status: 'Active',
    },
  ],
  feeGenerations: [
    {
      id: 'FG1',
      studentId: 'S101',
      facilityId: '',
      month: 'August 2026',
      startDate: '2026-08-01',
      lastDate: '2026-08-15',
      amount: 15000,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'FG2',
      studentId: 'S102',
      facilityId: '',
      month: 'August 2026',
      startDate: '2026-08-01',
      lastDate: '2026-08-15',
      amount: 15000,
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'FG3',
      studentId: 'S103',
      facilityId: 'F2',
      month: 'August 2026',
      startDate: '2026-08-01',
      lastDate: '2026-08-05',
      amount: 500,
      status: 'Active',
      visible: 'Yes',
    },
  ],
  feeCollections: [
    {
      id: 'FCX1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      feeComponentId: 'FC1',
      amountPaid: 15000,
      paymentDate: '2026-08-02',
      receiptNo: 'REC-1001',
      status: 'Paid',
    },
    {
      id: 'FCX2',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      feeComponentId: 'FC2',
      amountPaid: 4500,
      paymentDate: '2026-08-03',
      receiptNo: 'REC-1002',
      status: 'Paid',
    },
    {
      id: 'FCX3',
      studentId: 'S102',
      studentName: 'Priya Singh',
      feeComponentId: 'FC1',
      amountPaid: 15000,
      paymentDate: '2026-08-05',
      receiptNo: 'REC-1003',
      status: 'Paid',
    },
    {
      id: 'FCX4',
      studentId: 'S103',
      studentName: 'Amit Patel',
      feeComponentId: 'FC4',
      amountPaid: 5000,
      paymentDate: '2026-08-01',
      receiptNo: 'REC-1004',
      status: 'Paid',
    },
  ],
  attendance: [
    {
      id: 'ATT1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      date: '2026-07-22',
      inTime: '18:30',
      outTime: '07:45',
      status: 'Present',
    },
    {
      id: 'ATT2',
      studentId: 'S103',
      studentName: 'Amit Patel',
      hostelId: 'H1',
      date: '2026-07-22',
      inTime: '19:15',
      outTime: '08:00',
      status: 'Present',
    },
    {
      id: 'ATT3',
      studentId: 'S102',
      studentName: 'Priya Singh',
      hostelId: 'H2',
      date: '2026-07-22',
      inTime: '18:00',
      outTime: '07:30',
      status: 'Present',
    },
    {
      id: 'ATT4',
      studentId: 'S105',
      studentName: 'Vikram Joshi',
      hostelId: 'H3',
      date: '2026-07-22',
      inTime: '--',
      outTime: '14:00',
      status: 'Night-Out',
    },
    {
      id: 'ATT5',
      studentId: 'S104',
      studentName: 'Sneha Rao',
      hostelId: 'H2',
      date: '2026-07-21',
      inTime: '--',
      outTime: '--',
      status: 'Absent',
    },
  ],
  leaves: [
    {
      id: 'LV1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      leaveType: 'Outpass',
      fromDate: '2026-07-22',
      toDate: '2026-07-22',
      reason: 'Local Guardian Visit & Shopping',
      approvalStatus: 'Pending',
      approvedBy: '',
    },
    {
      id: 'LV2',
      studentId: 'S102',
      studentName: 'Priya Singh',
      leaveType: 'Leave',
      fromDate: '2026-07-25',
      toDate: '2026-07-28',
      reason: 'Family Function at Home',
      approvalStatus: 'Approved',
      approvedBy: 'Warden Sunita Sharma',
    },
    {
      id: 'LV3',
      studentId: 'S103',
      studentName: 'Amit Patel',
      leaveType: 'Outpass',
      fromDate: '2026-07-21',
      toDate: '2026-07-21',
      reason: 'Medical Appointment',
      approvalStatus: 'Approved',
      approvedBy: 'Warden Rajesh Kumar',
    },
    {
      id: 'LV4',
      studentId: 'S105',
      studentName: 'Vikram Joshi',
      leaveType: 'Leave',
      fromDate: '2026-08-01',
      toDate: '2026-08-07',
      reason: 'Personal Leave',
      approvalStatus: 'Rejected',
      approvedBy: 'Warden Vikram Rathore',
    },
  ],
  visitorLogs: [
    {
      id: 'VL1',
      visitorName: 'Ramesh Verma',
      studentVisited: 'Rahul Verma',
      relation: 'Father',
      purpose: 'Monthly Visit & Books Delivery',
      timeIn: '10:00',
      timeOut: '12:30',
      idProofType: 'Aadhar Card',
    },
    {
      id: 'VL2',
      visitorName: 'Meenakshi Singh',
      studentVisited: 'Priya Singh',
      relation: 'Mother',
      purpose: 'Health Checkup Visit',
      timeIn: '15:30',
      timeOut: '17:00',
      idProofType: 'Voter ID',
    },
    {
      id: 'VL3',
      visitorName: 'Sanjay Patel',
      studentVisited: 'Amit Patel',
      relation: 'Local Guardian',
      purpose: 'Fees Discussion & Document Signing',
      timeIn: '11:15',
      timeOut: '13:00',
      idProofType: 'Driving License',
    },
    {
      id: 'VL4',
      visitorName: 'Kavita Joshi',
      studentVisited: 'Vikram Joshi',
      relation: 'Sister',
      purpose: 'Delivering Medicines',
      timeIn: '16:00',
      timeOut: '16:45',
      idProofType: 'Passport',
    },
  ],
  requests: [
    {
      id: 'REQ1',
      studentName: 'Rahul Verma',
      categoryId: 'Maintenance',
      type: 'Electrical Repair',
      description: 'Ceiling fan humming noise and slow speed in Room A-101',
      resolution: 'Inspected and capacitor replaced by Ramesh Electrician',
      resolutionDate: '2026-07-20',
      status: 'Resolved',
    },
    {
      id: 'REQ2',
      studentName: 'Priya Singh',
      categoryId: 'Maintenance',
      type: 'Plumbing Issue',
      description: 'Washroom tap leaking continuously in Rose Wing R-204',
      resolution: '',
      resolutionDate: '',
      status: 'Open',
    },
    {
      id: 'REQ3',
      studentName: 'Amit Patel',
      categoryId: 'Facility',
      type: 'Wi-Fi Connectivity',
      description: 'Wi-Fi router signal weak on 2nd floor Block A corridor',
      resolution: 'Wi-Fi extender installed by IT Caretaker',
      resolutionDate: '2026-07-19',
      status: 'Resolved',
    },
    {
      id: 'REQ4',
      studentName: 'Sneha Rao',
      categoryId: 'General',
      type: 'Pest Control & Cleaning',
      description: 'Request for room deep cleaning and pest spray in R-105',
      resolution: '',
      resolutionDate: '',
      status: 'Open',
    },
  ],
  incidents: [
    {
      id: 'INC1',
      studentName: 'Rahul Verma',
      incidentDescription: 'Loud music after 10 PM quiet hours warning',
      reportedBy: 'Chief Warden Rajesh Kumar',
      date: '2026-07-15',
      status: 'Closed',
    },
    {
      id: 'INC2',
      studentName: 'Karan Sharma',
      incidentDescription:
        'Late entry at hostel gate after 10:15 PM without prior outpass',
      reportedBy: 'Night Security Guard',
      date: '2026-07-20',
      status: 'Under Investigation',
    },
    {
      id: 'INC3',
      studentName: 'Group Block B',
      incidentDescription:
        'Minor electrical short circuit in 1st floor corridor switchboard',
      reportedBy: 'Caretaker Suresh Singh',
      date: '2026-07-18',
      status: 'Closed',
    },
  ],
  disciplinaryActions: [
    {
      id: 'DA1',
      studentName: 'Rahul Verma',
      reason: 'Late Entry Violation (Passed curfew time)',
      fineAmount: 500,
      actionTaken: 'First Written Warning & Fine Recorded',
      date: '2026-07-16',
      status: 'Actioned',
    },
    {
      id: 'DA2',
      studentName: 'Karan Sharma',
      reason: 'Unauthorized Hosteller Guest in Room',
      fineAmount: 1000,
      actionTaken: 'Fine Issued & Parent Informed',
      date: '2026-07-21',
      status: 'Pending',
    },
  ],
  roomChangeRequests: [
    {
      id: 'RCR1',
      studentName: 'Rahul Verma',
      currentRoom: 'A-101',
      requestedRoom: 'A-105',
      reason: 'Excessive staircase noise near Room A-101',
      approvalStatus: 'Pending',
    },
    {
      id: 'RCR2',
      studentName: 'Sneha Rao',
      currentRoom: 'R-204',
      requestedRoom: 'R-210',
      reason: 'Medical condition requiring lower floor room access',
      approvalStatus: 'Approved',
    },
  ],
  studentFacilities: [
    {
      id: 'SF1',
      studentName: 'Rahul Verma',
      facilityId: 'F1',
      mappedDate: '2026-08-01',
    },
    {
      id: 'SF2',
      studentName: 'Rahul Verma',
      facilityId: 'F2',
      mappedDate: '2026-08-01',
    },
    {
      id: 'SF3',
      studentName: 'Priya Singh',
      facilityId: 'F3',
      mappedDate: '2026-08-01',
    },
    {
      id: 'SF4',
      studentName: 'Amit Patel',
      facilityId: 'F1',
      mappedDate: '2026-08-01',
    },
  ],
  checkouts: [
    {
      id: 'CO1',
      studentName: 'Amit Patel',
      roomId: 'A-102',
      vacateDate: '2026-05-31',
      depositAmount: 5000,
      refundAmount: 5000,
      refundStatus: 'Processed',
    },
    {
      id: 'CO2',
      studentName: 'Karan Sharma',
      roomId: 'A-104',
      vacateDate: '2026-06-15',
      depositAmount: 5000,
      refundAmount: 4500,
      refundStatus: 'Pending',
    },
  ],
  foodStock: [
    {
      id: 'FS1',
      itemName: 'Basmati Rice',
      category: 'Grains & Pulses',
      batchNumber: 'BR-2026-07',
      quantity: 450,
      unit: 'kg',
      threshold: 100,
      expiryDate: '2026-12-31',
      supplierInfo: 'National Grains Ltd (Ph: 9876500001)',
      status: 'Active',
    },
    {
      id: 'FS2',
      itemName: 'Cooking Oil (Sunflower)',
      category: 'Oils & Fats',
      batchNumber: 'CO-2026-06',
      quantity: 15,
      unit: 'liters',
      threshold: 50,
      expiryDate: '2026-09-15',
      supplierInfo: 'Apex Agro Products (Ph: 9876500002)',
      status: 'Active',
    },
    {
      id: 'FS3',
      itemName: 'Whole Wheat Flour (Atta)',
      category: 'Grains & Pulses',
      batchNumber: 'WF-2026-07',
      quantity: 320,
      unit: 'kg',
      threshold: 100,
      expiryDate: '2026-11-30',
      supplierInfo: 'FreshMills Inc (Ph: 9876500003)',
      status: 'Active',
    },
    {
      id: 'FS4',
      itemName: 'Milk Packets',
      category: 'Dairy',
      batchNumber: 'MK-2026-07-22',
      quantity: 8,
      unit: 'packets',
      threshold: 25,
      expiryDate: '2026-07-23',
      supplierInfo: 'Amul Dairy Co (Ph: 9876500004)',
      status: 'Active',
    },
    {
      id: 'FS5',
      itemName: 'Toor Dal (Pigeon Pea)',
      category: 'Grains & Pulses',
      batchNumber: 'TD-2026-07',
      quantity: 180,
      unit: 'kg',
      threshold: 40,
      expiryDate: '2027-01-15',
      supplierInfo: 'Central Agro Traders (Ph: 9876500005)',
      status: 'Active',
    },
    {
      id: 'FS6',
      itemName: 'Refined Sugar',
      category: 'Spices & Condiments',
      batchNumber: 'SG-2026-05',
      quantity: 25,
      unit: 'kg',
      threshold: 60,
      expiryDate: '2027-06-30',
      supplierInfo: 'SweetSugar Suppliers (Ph: 9876500006)',
      status: 'Active',
    },
    {
      id: 'FS7',
      itemName: 'Tea Leaves (CTC)',
      category: 'Spices & Condiments',
      batchNumber: 'TL-2026-06',
      quantity: 45,
      unit: 'kg',
      threshold: 15,
      expiryDate: '2027-03-31',
      supplierInfo: 'Assam Tea Depot (Ph: 9876500007)',
      status: 'Active',
    },
    {
      id: 'FS8',
      itemName: 'Fresh Potatoes & Onions',
      category: 'Vegetables',
      batchNumber: 'VEG-2026-07-20',
      quantity: 12,
      unit: 'bags',
      threshold: 30,
      expiryDate: '2026-08-05',
      supplierInfo: 'City Fresh Mandi (Ph: 9876500008)',
      status: 'Active',
    },
  ],
  hostelUtilities: [
    {
      id: 'HU1',
      assetName: 'LED Bulbs 12W',
      category: 'Maintenance Supplies',
      hostelId: 'H1',
      quantity: 8,
      threshold: 20,
      condition: 'Good',
      lastRestocked: '2026-07-01',
    },
    {
      id: 'HU2',
      assetName: 'Cotton Bedsheets',
      category: 'Linen & Bedding',
      hostelId: 'H1',
      quantity: 12,
      threshold: 25,
      condition: 'Good',
      lastRestocked: '2026-06-15',
    },
    {
      id: 'HU3',
      assetName: 'Pillow & Cover Set',
      category: 'Linen & Bedding',
      hostelId: 'H1',
      quantity: 85,
      threshold: 30,
      condition: 'Good',
      lastRestocked: '2026-06-15',
    },
    {
      id: 'HU4',
      assetName: 'Ceiling Fan 48"',
      category: 'Appliances',
      hostelId: 'H1',
      quantity: 120,
      threshold: 10,
      condition: 'Good',
      lastRestocked: '2026-01-10',
    },
    {
      id: 'HU5',
      assetName: 'Wooden Study Table',
      category: 'Furniture',
      hostelId: 'H1',
      quantity: 95,
      threshold: 15,
      condition: 'Good',
      lastRestocked: '2026-01-10',
    },
    {
      id: 'HU6',
      assetName: 'Heavy Plastic Chairs',
      category: 'Furniture',
      hostelId: 'H2',
      quantity: 6,
      threshold: 20,
      condition: 'Good',
      lastRestocked: '2026-05-20',
    },
    {
      id: 'HU7',
      assetName: 'Water Cooler 150L',
      category: 'Appliances',
      hostelId: 'H1',
      quantity: 6,
      threshold: 2,
      condition: 'Good',
      lastRestocked: '2026-02-15',
    },
    {
      id: 'HU8',
      assetName: 'Floor Cleaning Brooms & Mops',
      category: 'Maintenance Supplies',
      hostelId: 'H2',
      quantity: 15,
      threshold: 10,
      condition: 'Good',
      lastRestocked: '2026-07-10',
    },
  ],
  maintenanceTickets: [
    {
      id: 'TKT-1001',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      roomNumber: 'A-101',
      assetId: 'HU4',
      category: 'Electrical',
      urgency: 'High',
      description: 'Ceiling fan making loud humming noise and running slowly.',
      assignedTechnician: 'Ramesh Electrician',
      status: 'Assigned',
      loggedDate: '2026-07-21',
      assignedDate: '2026-07-22',
      resolvedDate: '',
      studentSignature: '',
    },
    {
      id: 'TKT-1002',
      studentId: 'S102',
      studentName: 'Priya Singh',
      roomNumber: 'R-204',
      assetId: '',
      category: 'Plumbing',
      urgency: 'Emergency',
      description: 'Bathroom tap leaking continuously in R-204.',
      assignedTechnician: 'Suresh Plumber',
      status: 'Resolved',
      loggedDate: '2026-07-18',
      assignedDate: '2026-07-18',
      resolvedDate: '2026-07-19',
      studentSignature: 'Priya Singh (Digitally Verified)',
    },
    {
      id: 'TKT-1003',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      roomNumber: 'A-101',
      assetId: 'HU5',
      category: 'Furniture',
      urgency: 'Medium',
      description: 'Study chair leg loose and unstable.',
      assignedTechnician: '',
      status: 'Logged',
      loggedDate: '2026-07-22',
      assignedDate: '',
      resolvedDate: '',
      studentSignature: '',
    },
    {
      id: 'TKT-1004',
      studentId: 'S103',
      studentName: 'Amit Patel',
      roomNumber: 'A-102',
      assetId: 'HU1',
      category: 'Electrical',
      urgency: 'Low',
      description: 'Study tube light fused in room A-102.',
      assignedTechnician: 'Ramesh Electrician',
      status: 'Resolved',
      loggedDate: '2026-07-15',
      assignedDate: '2026-07-16',
      resolvedDate: '2026-07-16',
      studentSignature: 'Amit Patel (Digitally Verified)',
    },
    {
      id: 'TKT-1005',
      studentId: 'S105',
      studentName: 'Vikram Joshi',
      roomNumber: 'A-103',
      assetId: '',
      category: 'Structural',
      urgency: 'Medium',
      description: 'Door lock latch sticking and difficult to key open.',
      assignedTechnician: 'Karan Carpenter',
      status: 'Assigned',
      loggedDate: '2026-07-20',
      assignedDate: '2026-07-21',
      resolvedDate: '',
      studentSignature: '',
    },
  ],
});

interface HostelContextType {
  role: 'Admin' | 'Warden';
  setRole: (role: 'Admin' | 'Warden') => void;
  activePortal: PortalRole | null;
  selectedHostelId: string | null;
  setSelectedHostelId: (id: string | null) => void;
  data: MockData;
  setData: (data: MockData) => void;
  addRecord: <K extends keyof MockData>(
    collectionName: K,
    record: MockData[K][0]
  ) => void;
  updateRecord: <K extends keyof MockData>(
    collectionName: K,
    id: string,
    record: MockData[K][0]
  ) => void;
  deleteRecord: <K extends keyof MockData>(
    collectionName: K,
    id: string
  ) => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<'Admin' | 'Warden'>('Admin');
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const location = useLocation();

  // Derive active portal from URL path
  const activePortal = useMemo<PortalRole | null>(() => {
    const path = location.pathname;
    if (path.includes('/hostel-services/student')) return 'student';
    if (path.includes('/hostel-services/warden')) return 'warden';
    if (path.includes('/hostel-services/admin')) return 'admin';
    return null;
  }, [location.pathname]);

  // Initialize data from localStorage or fallback to sample data
  const [data, setData] = useState<MockData>(() => {
    const defaultData = generateSampleData();
    const saved = localStorage.getItem('hostelManagementData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaultData to ensure new collections are populated if missing in old localStorage
        return {
          ...defaultData,
          ...parsed,
          foodStock:
            parsed.foodStock && parsed.foodStock.length > 0
              ? parsed.foodStock
              : defaultData.foodStock,
          hostelUtilities:
            parsed.hostelUtilities && parsed.hostelUtilities.length > 0
              ? parsed.hostelUtilities
              : defaultData.hostelUtilities,
          maintenanceTickets:
            parsed.maintenanceTickets && parsed.maintenanceTickets.length > 0
              ? parsed.maintenanceTickets
              : defaultData.maintenanceTickets,
          messMenus:
            parsed.messMenus && parsed.messMenus.length >= 5
              ? parsed.messMenus
              : defaultData.messMenus,
        };
      } catch (e) {
        console.error('Failed to parse hostel data from localStorage', e);
      }
    }
    return defaultData;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('hostelManagementData', JSON.stringify(data));
  }, [data]);

  const addRecord = <K extends keyof MockData>(
    collectionName: K,
    record: MockData[K][0]
  ) => {
    setData(prev => ({
      ...prev,
      [collectionName]: [...prev[collectionName], record],
    }));
  };

  const updateRecord = <K extends keyof MockData>(
    collectionName: K,
    id: string,
    record: MockData[K][0]
  ) => {
    setData(prev => ({
      ...prev,
      [collectionName]: prev[collectionName].map((item: any) =>
        item.id === id ? record : item
      ),
    }));
  };

  const deleteRecord = <K extends keyof MockData>(
    collectionName: K,
    id: string
  ) => {
    setData(prev => ({
      ...prev,
      [collectionName]: prev[collectionName].filter(
        (item: any) => item.id !== id
      ),
    }));
  };

  return (
    <HostelContext.Provider
      value={{
        role,
        setRole,
        activePortal,
        selectedHostelId,
        setSelectedHostelId,
        data,
        setData,
        addRecord,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostelContext = () => {
  const context = useContext(HostelContext);
  if (!context)
    throw new Error('useHostelContext must be used within HostelProvider');
  return context;
};

/** Convenience hook for role-based checks */
export const useHostelRole = () => {
  const { activePortal } = useHostelContext();
  return {
    activePortal,
    isStudent: activePortal === 'student',
    isWarden: activePortal === 'warden',
    isAdmin: activePortal === 'admin',
  };
};
