import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
}

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
      name: 'Rose Wing North',
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
  ],
  rooms: Array.from({ length: 10 }).map((_, i) => ({
    id: `R${i + 1}`,
    buildingId: i < 5 ? 'B1' : 'B2',
    hostelId: i < 5 ? 'H1' : 'H2',
    roomNumber: `${i < 5 ? 'A' : 'R'}-${100 + i}`,
    roomTypeId: i % 2 === 0 ? 'RT1' : 'RT2',
    capacity: i % 2 === 0 ? 1 : 2,
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
  ],
  facilities: [
    { id: 'F1', name: 'Gymnasium', status: 'Active', visible: 'Yes' },
    { id: 'F2', name: 'Laundry', status: 'Active', visible: 'Yes' },
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
  ],
  messMenus: [
    {
      id: 'M1',
      day: 'Monday',
      meal: 'Breakfast',
      foodItems: 'Poha, Jalebi, Tea',
      status: 'Active',
      visible: 'Yes',
    },
    {
      id: 'M2',
      day: 'Monday',
      meal: 'Lunch',
      foodItems: 'Roti, Dal, Rice, Mix Veg',
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
      name: 'Laundry Monthly',
      facilityId: 'F2',
      amount: 500,
      oneTime: 'N',
      lateFeeApplicable: 'N',
      billingStartDate: '2026-08-01',
      billingLastDate: '2026-08-05',
      status: 'Active',
      visible: 'Yes',
    },
  ],
  rulePolicies: [
    {
      id: 'RP1',
      title: 'Curfew Timing',
      description: 'All students must return to the hostel by 9:00 PM.',
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
  ],
  feeGenerations: [
    {
      id: 'FG1',
      studentId: 'S101',
      facilityId: '',
      month: 'August',
      startDate: '2026-08-01',
      lastDate: '2026-08-15',
      amount: 15000,
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
      receiptNo: 'REC-001',
      status: 'Paid',
    },
  ],
  attendance: [
    {
      id: 'ATT1',
      studentId: 'S101',
      studentName: 'Rahul Verma',
      hostelId: 'H1',
      date: '2026-07-20',
      inTime: '18:00',
      outTime: '08:00',
      status: 'Present',
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
      reason: 'Local Guardian Visit',
      approvalStatus: 'Pending',
      approvedBy: '',
    },
  ],
  visitorLogs: [
    {
      id: 'VL1',
      visitorName: 'Ramesh Verma',
      studentVisited: 'Rahul Verma',
      relation: 'Father',
      purpose: 'Meeting',
      timeIn: '10:00',
      timeOut: '12:00',
      idProofType: 'Aadhar',
    },
  ],
  requests: [
    {
      id: 'REQ1',
      studentName: 'Rahul Verma',
      categoryId: 'Maintenance',
      type: 'Electrical Repair',
      description: 'Fan not working in room',
      resolution: '',
      resolutionDate: '',
      status: 'Open',
    },
  ],
  incidents: [
    {
      id: 'INC1',
      studentName: 'Rahul Verma',
      incidentDescription: 'Loud noise after curfew',
      reportedBy: 'Rajesh Kumar',
      date: '2026-07-15',
      status: 'Closed',
    },
  ],
  disciplinaryActions: [
    {
      id: 'DA1',
      studentName: 'Rahul Verma',
      reason: 'Late Entry',
      fineAmount: 500,
      actionTaken: 'Warning and Fine',
      date: '2026-07-16',
      status: 'Actioned',
    },
  ],
  roomChangeRequests: [
    {
      id: 'RCR1',
      studentName: 'Rahul Verma',
      currentRoom: 'A-101',
      requestedRoom: 'A-105',
      reason: 'Too noisy near staircase',
      approvalStatus: 'Pending',
    },
  ],
  studentFacilities: [
    {
      id: 'SF1',
      studentName: 'Rahul Verma',
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
  ],
});

interface HostelContextType {
  role: 'Admin' | 'Warden';
  setRole: (role: 'Admin' | 'Warden') => void;
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

  // Initialize data from localStorage or fallback to sample data
  const [data, setData] = useState<MockData>(() => {
    const saved = localStorage.getItem('hostelManagementData');
    if (saved) {
      try {
        return JSON.parse(saved) as MockData;
      } catch (e) {
        console.error('Failed to parse hostel data from localStorage', e);
      }
    }
    return generateSampleData();
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
