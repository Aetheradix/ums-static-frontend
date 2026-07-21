export const mockDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const GEO_TREE: HostelManagement.GeoNode[] = [
  {
    id: 'DAVV',
    name: 'Devi Ahilya Vishwavidyalaya (DAVV)',
    children: [
      {
        id: 'DAVV-TAKSHASHILA',
        name: 'Takshashila Campus',
      },
      {
        id: 'DAVV-NALANDA',
        name: 'Nalanda Campus',
      },
    ],
  },
];

// Screen 1: Hostels
export const mockHostels: HostelManagement.Hostel[] = [
  {
    id: 'H-001',
    hostelName: 'Vivekananda Boys Hostel',
    hostelNameHindi: 'विवेकानंद बालक छात्रावास',
    hostelCode: 'VBH-01',
    campusId: 'DAVV-TAKSHASHILA',
    campusName: 'Takshashila Campus',
    hostelType: 'BOYS',
    hostelCategory: 'UG',
    establishmentYear: 2010,
    address: 'Khandwa Road, Indore',
    contactNumber: '9876543210',
    totalRooms: 100,
    totalCapacity: 200,
    occupiedBeds: 150,
    availableBeds: 50,
    amenities: ['Wi-Fi', 'Medical Kit', 'CCTV'],
    policeStation: {
      name: 'Bhawarkuan PS',
      address: 'AB Road',
      contactNumber: '100',
    },
    nearestHospital: {
      name: 'MY Hospital',
      address: 'Indore',
      contactNumber: '108',
    },
    warden: {
      name: 'Dr. Alok Prasad',
      mobile: '9876543210',
      designation: 'Chief Warden',
      email: 'alok@davv.ac.in',
    },
    isGirlsHostel: false,
    twentyFourSevenSecurity: true,
    restrictedVisitorHours: false,
    status: 'ACTIVE',
    remarks: 'Main boys hostel',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Screen 2: Buildings & Floors
export const mockBuildings: HostelManagement.Building[] = [
  {
    id: 'B-001',
    name: 'Block A',
    hostelId: 'H-001',
    floors: [
      {
        id: 'F-001',
        floorNumber: 1,
        buildingId: 'B-001',
        rooms: [
          {
            id: 'R-101',
            roomNumber: '101',
            roomTypeId: 'RT-1',
            roomTypeName: 'Double Seater Non-AC',
            floorId: 'F-001',
            capacity: 2,
            occupiedBeds: 1,
            acType: 'NON_AC',
            assetChecklist: [
              {
                id: 'A-1',
                name: 'Study Table',
                condition: 'GOOD',
                lastCheckedDate: '2026-07-01',
              },
              {
                id: 'A-2',
                name: 'Single Bed',
                condition: 'GOOD',
                lastCheckedDate: '2026-07-01',
              },
            ],
            beds: [
              {
                id: 'B-101-1',
                bedNumber: 'Bed 1',
                roomId: 'R-101',
                status: 'OCCUPIED',
                studentId: 'STU-101',
              },
              {
                id: 'B-101-2',
                bedNumber: 'Bed 2',
                roomId: 'R-101',
                status: 'VACANT',
              },
            ],
            status: 'AVAILABLE',
          },
        ],
      },
    ],
  },
];

// Screen 3: Room Types
export const mockRoomTypes: HostelManagement.RoomType[] = [
  {
    id: 'RT-1',
    roomTypeName: 'Double Seater Non-AC',
    occupancyCapacity: 2,
    acType: 'NON_AC',
    monthlyFee: 1500,
    cautionDeposit: 5000,
    defaultAmenities: ['Wi-Fi', 'Study Table', 'Chair'],
    description: 'Standard double room',
    status: 'ACTIVE',
  },
  {
    id: 'RT-2',
    roomTypeName: 'Single Seater AC',
    occupancyCapacity: 1,
    acType: 'AC',
    monthlyFee: 3500,
    cautionDeposit: 8000,
    defaultAmenities: ['Wi-Fi', 'Study Table', 'Chair', 'AC'],
    description: 'Premium single room',
    status: 'ACTIVE',
  },
];

// Screen 4: Room Assets
export const mockRoomAssets: HostelManagement.RoomAsset[] = [
  {
    id: 'RA-1',
    roomTypeId: 'RT-1',
    roomTypeName: 'Double Seater Non-AC',
    assetName: 'Study Table',
    assetCategory: 'FURNITURE',
    quantityPerRoom: 2,
    isConsumable: false,
    estimatedCost: 2500,
    conditionOnIssue: 'NEW',
    status: 'ACTIVE',
  },
  {
    id: 'RA-2',
    roomTypeId: 'RT-1',
    roomTypeName: 'Double Seater Non-AC',
    assetName: 'Single Bed',
    assetCategory: 'FURNITURE',
    quantityPerRoom: 2,
    isConsumable: false,
    estimatedCost: 4000,
    conditionOnIssue: 'USED_GOOD',
    status: 'ACTIVE',
  },
];

// Screen 5: Basic Facilities
export const mockBasicFacilities: HostelManagement.BasicFacility[] = [
  {
    id: 'BF-1',
    facilityName: 'Wi-Fi',
    facilityIcon: 'wifi',
    description: 'High speed campus wifi',
    status: 'ACTIVE',
  },
  {
    id: 'BF-2',
    facilityName: 'Water Purifier',
    facilityIcon: 'water_drop',
    description: 'RO water on every floor',
    status: 'ACTIVE',
  },
];

// Screen 6 & 7: Items
export const mockItemCategories: HostelManagement.ItemCategory[] = [
  { id: 'IC-1', categoryName: 'Grocery', status: 'ACTIVE' },
  { id: 'IC-2', categoryName: 'Electrical', status: 'ACTIVE' },
];
export const mockItems: HostelManagement.InventoryItem[] = [
  {
    id: 'IT-1',
    categoryId: 'IC-1',
    categoryName: 'Grocery',
    itemType: 'CONSUMABLE',
    itemName: 'Rice',
    itemCode: 'GRO-RIC',
    unit: 'KG',
    currentStock: 100,
    reorderLevel: 20,
    estimatedUnitCost: 40,
    status: 'ACTIVE',
  },
  {
    id: 'IT-2',
    categoryId: 'IC-2',
    categoryName: 'Electrical',
    itemType: 'CONSUMABLE',
    itemName: 'LED Bulb',
    itemCode: 'ELE-BULB',
    unit: 'PIECE',
    currentStock: 15,
    reorderLevel: 20,
    estimatedUnitCost: 150,
    status: 'ACTIVE',
  },
];

// Screen 8: Shifts
export const mockShifts: HostelManagement.Shift[] = [
  {
    id: 'SH-1',
    shiftName: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    duration: '8 hours',
    isOvernight: false,
    status: 'ACTIVE',
  },
];

// Screen 9: Mess Menus
export const mockMessMenus: HostelManagement.MessMenu[] = [
  {
    id: 'MM-1',
    hostelId: 'H-001',
    academicYear: '2024-2025',
    weekStarting: '2024-10-14',
    dayOfWeek: 'MONDAY',
    mealType: 'BREAKFAST',
    items: [],
    meals: [],
  },
];

// ─── Phase 2 Mock Data ───────────────────────────────────────────────────

export const mockStudentApplications: HostelManagement.StudentApplication[] = [
  {
    id: 'APP-001',
    studentId: 'STU-101',
    enrollmentNo: 'ENR2026001',
    studentName: 'Rahul Sharma',
    course: 'B.Tech Computer Science',
    semester: '3rd Sem',
    gender: 'MALE',
    hostelId: 'H-001',
    hostelName: 'Vivekananda Boys Hostel',
    roomTypeId: 'RT-1',
    roomTypeName: 'Double Seater Non-AC',
    applicationDate: '2026-07-01',
    distanceFromCity: 150,
    hasMedicalCondition: false,
    status: 'ALLOTTED',
  },
  {
    id: 'APP-002',
    studentId: 'STU-102',
    enrollmentNo: 'ENR2026002',
    studentName: 'Aman Gupta',
    course: 'B.Tech Mechanical',
    semester: '1st Sem',
    gender: 'MALE',
    hostelId: 'H-001',
    hostelName: 'Vivekananda Boys Hostel',
    roomTypeId: 'RT-1',
    roomTypeName: 'Double Seater Non-AC',
    applicationDate: '2026-07-02',
    distanceFromCity: 50,
    hasMedicalCondition: false,
    status: 'SUBMITTED',
  },
];

export const mockRoomAllotments: HostelManagement.RoomAllotment[] = [
  {
    id: 'ALLOT-1',
    applicationId: 'APP-001',
    studentId: 'STU-101',
    studentName: 'Rahul Sharma',
    hostelId: 'H-001',
    hostelName: 'Vivekananda Boys Hostel',
    roomId: 'R-101',
    roomNumber: '101',
    bedId: 'B-101-1',
    bedNumber: 'Bed 1',
    allotmentDate: '2026-07-15',
    allottedBy: 'Admin',
    validFrom: '2026-08-01',
    validTill: '2027-05-31',
    status: 'CHECKED_IN',
  },
];

export const mockCheckInRecords: HostelManagement.CheckInRecord[] = [
  {
    id: 'CHK-1',
    allotmentId: 'ALLOT-1',
    studentId: 'STU-101',
    checkInDate: '2026-08-01',
    checkInTime: '10:30',
    assetsHandedOver: [
      { assetId: 'RA-1', assetName: 'Study Table', condition: 'NEW' },
      { assetId: 'RA-2', assetName: 'Single Bed', condition: 'GOOD' },
    ],
    remarks: 'Checked in smoothly.',
    checkedInBy: 'Warden',
  },
];

export const mockRoomChangeRequests: HostelManagement.RoomChangeRequest[] = [
  {
    id: 'RCR-1',
    studentId: 'STU-101',
    studentName: 'Rahul Sharma',
    currentHostelId: 'H-001',
    currentRoomId: 'R-101',
    requestedHostelId: 'H-001',
    requestedRoomTypeId: 'RT-2',
    reason: 'Need a single seater room for better focus on academics.',
    requestDate: '2026-09-01',
    status: 'PENDING',
  },
];

// ─── Phase 3 Mock Data ───────────────────────────────────────────────────

export const mockGatePasses: HostelManagement.GatePass[] = [
  {
    id: 'GP-1',
    studentId: 'STU-101',
    studentName: 'Rahul Sharma',
    hostelId: 'H-001',
    roomId: 'R-101',
    outTime: '2026-10-15T18:00:00Z',
    expectedInTime: '2026-10-15T21:00:00Z',
    purpose: 'Going to local market for project supplies.',
    status: 'PENDING',
  },
  {
    id: 'GP-2',
    studentId: 'STU-102',
    studentName: 'Aman Gupta',
    hostelId: 'H-001',
    roomId: 'R-102',
    outTime: '2026-10-16T14:00:00Z',
    expectedInTime: '2026-10-16T18:00:00Z',
    purpose: 'Doctor appointment.',
    status: 'PENDING',
  },
  {
    id: 'GP-3',
    studentId: 'STU-103',
    studentName: 'Vikram Singh',
    hostelId: 'H-001',
    roomId: 'R-103',
    outTime: '2026-10-16T15:30:00Z',
    expectedInTime: '2026-10-16T20:00:00Z',
    purpose: 'Attending a workshop at NIT.',
    status: 'PENDING',
  },
  {
    id: 'GP-4',
    studentId: 'STU-104',
    studentName: 'Rohan Desai',
    hostelId: 'H-001',
    roomId: 'R-104',
    outTime: '2026-10-16T10:00:00Z',
    expectedInTime: '2026-10-16T22:00:00Z',
    purpose: 'Visiting relatives in city.',
    status: 'APPROVED',
  },
  {
    id: 'GP-5',
    studentId: 'STU-105',
    studentName: 'Priya Verma',
    hostelId: 'H-001',
    roomId: 'R-105',
    outTime: '2026-10-16T09:00:00Z',
    expectedInTime: '2026-10-16T15:00:00Z',
    purpose: 'Shopping for essentials.',
    status: 'APPROVED',
  },
  {
    id: 'GP-6',
    studentId: 'STU-106',
    studentName: 'Neha Kapoor',
    hostelId: 'H-001',
    roomId: 'R-106',
    outTime: '2026-10-16T08:30:00Z',
    expectedInTime: '2026-10-16T12:00:00Z',
    purpose: 'Coaching classes.',
    status: 'APPROVED',
  },
  {
    id: 'GP-7',
    studentId: 'STU-107',
    studentName: 'Karan Patel',
    hostelId: 'H-001',
    roomId: 'R-107',
    outTime: '2026-10-16T17:00:00Z',
    expectedInTime: '2026-10-16T19:30:00Z',
    purpose: 'Gym and fitness training.',
    status: 'PENDING',
  },
];

export const mockLeaveRequests: HostelManagement.LeaveRequest[] = [
  {
    id: 'LR-1',
    studentId: 'STU-101',
    studentName: 'Rahul Sharma',
    hostelId: 'H-001',
    roomId: 'R-101',
    fromDate: '2026-10-20',
    toDate: '2026-10-25',
    reason: 'Going home for Diwali.',
    contactNumber: '9876543210',
    parentConsent: true,
    status: 'PENDING',
  },
  {
    id: 'LR-2',
    studentId: 'STU-105',
    studentName: 'Priya Verma',
    hostelId: 'H-001',
    roomId: 'R-105',
    fromDate: '2026-10-18',
    toDate: '2026-10-22',
    reason: 'Sister wedding.',
    contactNumber: '9123456789',
    parentConsent: true,
    status: 'PENDING',
  },
  {
    id: 'LR-3',
    studentId: 'STU-108',
    studentName: 'Ankit Tiwari',
    hostelId: 'H-001',
    roomId: 'R-108',
    fromDate: '2026-10-19',
    toDate: '2026-10-21',
    reason: 'Medical checkup in hometown.',
    contactNumber: '9871234560',
    parentConsent: true,
    status: 'PENDING',
  },
  {
    id: 'LR-4',
    studentId: 'STU-109',
    studentName: 'Sanya Mirza',
    hostelId: 'H-001',
    roomId: 'R-109',
    fromDate: '2026-10-21',
    toDate: '2026-10-26',
    reason: 'Family emergency.',
    contactNumber: '9988776655',
    parentConsent: true,
    status: 'APPROVED',
  },
];

export const mockAttendanceRecords: HostelManagement.AttendanceRecord[] = [
  {
    id: 'ATT-1',
    date: '2026-10-15',
    hostelId: 'H-001',
    markedBy: 'STF-103',
    records: [
      {
        studentId: 'STU-101',
        studentName: 'Rahul Sharma',
        roomId: 'R-101',
        status: 'PRESENT',
      },
      {
        studentId: 'STU-102',
        studentName: 'Aman Gupta',
        roomId: 'Unassigned',
        status: 'ON_LEAVE',
      },
    ],
  },
];

export const mockVisitorRecords: HostelManagement.VisitorRecord[] = [
  {
    id: 'VIS-1',
    studentId: 'STU-101',
    studentName: 'Rahul Sharma',
    visitorName: 'Rakesh Sharma',
    relation: 'Father',
    contactNumber: '9988776655',
    purpose: 'Meeting',
    expectedDate: '2026-10-16',
    expectedTime: '14:00',
    status: 'CHECKED_IN',
    actualInTime: '14:05',
  },
];

export const mockDisciplinaryActions: HostelManagement.DisciplinaryAction[] = [
  {
    id: 'DA-1',
    hostelId: 'H-001',
    studentId: 'STU-102',
    studentName: 'Aman Gupta',
    incidentDate: '2026-10-10',
    description: 'Found playing loud music after 11 PM.',
    actionTaken: 'Verbal warning issued.',
    severity: 'LOW',
    reportedBy: 'STF-103',
    status: 'OPEN',
  },
  {
    id: 'DA-2',
    hostelId: 'H-001',
    studentId: 'STU-110',
    studentName: 'Kartik Aryan',
    incidentDate: '2026-10-12',
    description: 'Caught smoking in the hostel premises.',
    actionTaken: 'Parent notified. Fine imposed.',
    severity: 'HIGH',
    reportedBy: 'STF-101',
    status: 'OPEN',
  },
  {
    id: 'DA-3',
    hostelId: 'H-001',
    studentId: 'STU-111',
    studentName: 'Rishabh Pant',
    incidentDate: '2026-10-14',
    description: 'Damaged hostel property (broken chair).',
    actionTaken: 'Cost recovery initiated.',
    severity: 'MEDIUM',
    reportedBy: 'STF-102',
    status: 'OPEN',
  },
  {
    id: 'DA-4',
    hostelId: 'H-001',
    studentId: 'STU-112',
    studentName: 'Ishaan Khatter',
    incidentDate: '2026-09-20',
    description: 'Misbehavior with mess staff.',
    actionTaken: 'Written apology submitted.',
    severity: 'MEDIUM',
    reportedBy: 'STF-104',
    status: 'CLOSED',
  },
];

export const mockIncidentReports: HostelManagement.IncidentReport[] = [
  {
    id: 'IR-1',
    hostelId: 'H-001',
    reportedBy: 'STU-101',
    incidentType: 'DAMAGE',
    title: 'Broken Window in Corridor A',
    date: '2026-10-12',
    time: '22:00',
    severity: 'MEDIUM',
    description: 'Corridor window glass shattered due to heavy wind.',
    status: 'OPEN',
  },
];

// ─── Phase 4 Mock Data ───────────────────────────────────────────────────

export const mockMaintenanceRequests: HostelManagement.MaintenanceRequest[] = [
  {
    id: 'MR-1',
    hostelId: 'H-001',
    roomId: 'R-101',
    reportedBy: 'STU-101',
    issueType: 'ELECTRICAL',
    description: 'Fan regulator in Room 101 is completely broken.',
    priority: 'MEDIUM',
    requestDate: '2026-10-14',
    status: 'ASSIGNED',
    assignedTo: 'STF-101',
  },
];

export const mockStockTransactions: HostelManagement.StockTransaction[] = [
  {
    id: 'STX-1',
    hostelId: 'H-001',
    itemId: 'IT-1',
    itemName: 'Rice',
    transactionType: 'ISSUE',
    quantity: 10,
    date: '2026-10-15',
    remarks: 'Issued to Mess A.',
    performedBy: 'STF-103',
  },
  {
    id: 'STX-2',
    hostelId: 'H-001',
    itemId: 'IT-2',
    itemName: 'LED Bulb',
    transactionType: 'PROCUREMENT',
    quantity: 50,
    date: '2026-10-06',
    remarks: 'Received from Electricals Plus',
    performedBy: 'STF-103',
    referenceId: 'PO-1',
  },
];

export const mockVendors: HostelManagement.Vendor[] = [
  {
    id: 'V-101',
    vendorName: 'Electricals Plus',
    contactPerson: 'John Doe',
    contactNumber: '9876543210',
    email: 'john@electricals.com',
    address: '123 Main St',
    categoriesSupplied: ['ELECTRICAL'],
    status: 'ACTIVE',
  },
];

export const mockPurchaseOrders: HostelManagement.PurchaseOrder[] = [
  {
    id: 'PO-1',
    vendorId: 'V-101',
    vendorName: 'Electricals Plus',
    hostelId: 'H-001',
    orderDate: '2026-10-01',
    expectedDeliveryDate: '2026-10-05',
    items: [
      { itemId: 'IT-2', itemName: 'LED Bulb', quantity: 50, unitPrice: 150 },
    ],
    totalAmount: 7500,
    status: 'COMPLETED',
  },
];

export const mockHostelStaff: HostelManagement.HostelStaff[] = [
  {
    id: 'STF-101',
    employeeId: 'EMP-001',
    name: 'Ramesh Singh',
    role: 'ELECTRICIAN',
    hostelId: 'H-001',
    contactNumber: '9876543211',
    shiftId: 'SH-1',
    status: 'ACTIVE',
  },
  {
    id: 'STF-102',
    employeeId: 'EMP-002',
    name: 'Suresh Kumar',
    role: 'PLUMBER',
    hostelId: 'H-001',
    contactNumber: '9876543212',
    shiftId: 'SH-1',
    status: 'ACTIVE',
  },
  {
    id: 'STF-103',
    employeeId: 'EMP-003',
    name: 'Dr. Alok Prasad',
    role: 'WARDEN',
    hostelId: 'H-001',
    contactNumber: '9876543210',
    shiftId: 'SH-1',
    status: 'ACTIVE',
  },
];

export const mockStaffAttendance: HostelManagement.StaffAttendance[] = [
  {
    id: 'SA-1',
    staffId: 'STF-101',
    date: '2026-10-15',
    status: 'PRESENT',
    inTime: '08:00',
    markedBy: 'STF-103',
  },
  {
    id: 'SA-2',
    staffId: 'STF-102',
    date: '2026-10-15',
    status: 'ON_LEAVE',
    markedBy: 'STF-103',
  },
];

// ─── Student Self-Service Dashboard ──────────────────────────────────

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    program: string;
    semester: number;
    rollNumber: string;
  };
  roomInfo: {
    hostelName: string;
    blockName: string;
    roomNumber: string;
    bedNumber: string;
    roomType: string;
  } | null;
  roommate: {
    id: string;
    name: string;
    program: string;
    department: string;
  } | null;
  activeGatePass: {
    id: string;
    type: string;
    returnDateTime: string;
    status: string;
  } | null;
  pendingComplaints: number;
  todayMessMenu: {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  };
  recentActivity: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }[];
  notifications: {
    id: string;
    type: 'INFO' | 'WARNING' | 'URGENT';
    message: string;
    timestamp: string;
    read: boolean;
  }[];
}

export const mockStudentDashboard: StudentDashboardData = {
  student: {
    id: 'STU-101',
    name: 'Rahul Sharma',
    program: 'B.Tech Computer Science',
    semester: 3,
    rollNumber: 'ENR2026001',
  },
  roomInfo: {
    hostelName: 'Vivekananda Boys Hostel',
    blockName: 'Block A',
    roomNumber: '101',
    bedNumber: 'Bed 1',
    roomType: 'Double Seater Non-AC',
  },
  roommate: {
    id: 'STU-102',
    name: 'Aman Gupta',
    program: 'B.Tech Mechanical',
    department: 'Mechanical Engineering',
  },
  activeGatePass: {
    id: 'GP-1',
    type: 'Market Visit',
    returnDateTime: '2026-10-15T21:00:00Z',
    status: 'PENDING',
  },
  pendingComplaints: 1,
  todayMessMenu: {
    breakfast: 'Poha, Boiled Eggs, Bread-Butter, Tea/Coffee, Banana',
    lunch: 'Rice, Dal Fry, Aloo Gobi, Salad, Curd, Roti',
    snacks: 'Samosa, Tea/Coffee',
    dinner: 'Rice, Rajma, Paneer Butter Masala, Salad, Roti',
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'GATE_PASS',
      message: 'Gate pass submitted for Market Visit on Oct 15',
      timestamp: '2026-10-14T18:00:00Z',
    },
    {
      id: 'act-2',
      type: 'MAINTENANCE',
      message:
        'Maintenance ticket MR-1 assigned to Electrician — fan regulator issue',
      timestamp: '2026-10-14T10:30:00Z',
    },
    {
      id: 'act-3',
      type: 'MESS',
      message: 'Mess menu updated for the week of Oct 14',
      timestamp: '2026-10-13T18:00:00Z',
    },
    {
      id: 'act-4',
      type: 'GATE_PASS',
      message: 'Leave request submitted for Diwali (Oct 20-25)',
      timestamp: '2026-10-12T09:00:00Z',
    },
  ],
  notifications: [
    {
      id: 'noti-1',
      type: 'INFO',
      message: 'Visitor arriving: Rakesh Sharma (Father) — expected at 2:00 PM',
      timestamp: '2026-10-16T10:00:00Z',
      read: false,
    },
    {
      id: 'noti-2',
      type: 'WARNING',
      message: 'Hostel fee for November due by Oct 31',
      timestamp: '2026-10-10T10:00:00Z',
      read: false,
    },
    {
      id: 'noti-3',
      type: 'INFO',
      message: 'Room change request is under review',
      timestamp: '2026-09-02T14:00:00Z',
      read: true,
    },
  ],
};
