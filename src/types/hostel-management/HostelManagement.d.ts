declare namespace HostelManagement {
  // ─── Geo cascade ──────────────────────────────────────────────────────────
  interface GeoNode {
    id: string;
    name: string;
    children?: GeoNode[];
  }

  // ─── Notification ─────────────────────────────────────────────────────────
  interface Notification {
    message: string;
    type: 'success' | 'error';
  }

  // ─── Phase 1: Masters ───────────────────────────────────────────────────

  interface Hostel {
    id: string;
    hostelName: string;
    hostelNameHindi: string;
    hostelCode: string;
    campusId: string;
    campusName: string;
    hostelType: 'BOYS' | 'GIRLS';
    hostelCategory: 'UG' | 'PG' | 'RESEARCH' | 'STAFF';
    establishmentYear: number;
    address: string;
    contactNumber: string;
    totalRooms: number;
    totalCapacity: number;
    occupiedBeds: number;
    availableBeds: number;
    amenities: string[];
    policeStation: { name: string; address: string; contactNumber: string };
    nearestHospital: { name: string; address: string; contactNumber: string };
    warden: {
      name: string;
      mobile: string;
      designation: string;
      email: string;
    };
    isGirlsHostel: boolean;
    twentyFourSevenSecurity: boolean;
    restrictedVisitorHours: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';
    remarks: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Building {
    id: string;
    name: string;
    hostelId: string;
    floors: Floor[];
  }
  interface Floor {
    id: string;
    floorNumber: number;
    buildingId: string;
    rooms: Room[];
  }
  interface Room {
    id: string;
    roomNumber: string;
    floorId: string;
    roomTypeId: string;
    roomTypeName: string;
    capacity: number;
    occupiedBeds: number;
    acType: 'AC' | 'NON_AC';
    status:
      | 'AVAILABLE'
      | 'FULLY_OCCUPIED'
      | 'PARTIALLY_OCCUPIED'
      | 'UNDER_MAINTENANCE'
      | 'RESERVED';
    beds: Bed[];
    assetChecklist: AssetItem[];
  }
  interface Bed {
    id: string;
    bedNumber: string;
    roomId: string;
    status: 'VACANT' | 'OCCUPIED' | 'RESERVED';
    studentId?: string;
    studentName?: string;
    allocatedFrom?: string;
  }
  interface AssetItem {
    id: string;
    name: string;
    condition: 'GOOD' | 'NEEDS_REPAIR' | 'MISSING';
    lastCheckedDate: string;
  }

  interface RoomType {
    id: string;
    roomTypeName: string;
    occupancyCapacity: number;
    acType: 'AC' | 'NON_AC';
    monthlyFee: number;
    cautionDeposit: number;
    defaultAmenities: string[];
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface RoomAsset {
    id: string;
    roomTypeId: string;
    roomTypeName: string;
    assetName: string;
    assetCategory: 'FURNITURE' | 'ELECTRICAL' | 'FIXTURE' | 'SANITARY';
    quantityPerRoom: number;
    isConsumable: boolean;
    reorderLevel?: number;
    estimatedCost: number;
    conditionOnIssue: 'NEW' | 'USED_GOOD' | 'USED_FAIR';
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface BasicFacility {
    id: string;
    facilityName: string;
    facilityIcon: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface ItemCategory {
    id: string;
    categoryName: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  interface InventoryItem {
    id: string;
    categoryId: string;
    categoryName: string;
    itemType: 'CONSUMABLE' | 'NON_CONSUMABLE';
    itemName: string;
    itemCode: string;
    unit: 'PIECE' | 'KG' | 'LITRE' | 'BOX' | 'ROLL' | 'SET';
    currentStock: number;
    reorderLevel: number;
    estimatedUnitCost: number;
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface Shift {
    id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    duration: string;
    isOvernight: boolean;
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface MessMenu {
    id: string;
    hostelId: string;
    academicYear: string;
    weekStarting: string;
    meals: MessMeal[];
  }
  interface MessMeal {
    id: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'EVENING_SNACKS' | 'DINNER';
    timeSlot: string;
    days: MessDayMenu[];
  }
  interface MessDayMenu {
    day:
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';
    menuItems: string;
    specialDietAvailable: boolean;
    specialDietMenu: string;
    isHolidayMenu: boolean;
  }
  // ─── Phase 2: Application & Room Management ───────────────────────────────

  interface StudentApplication {
    id: string;
    studentId: string;
    enrollmentNo: string;
    studentName: string;
    course: string;
    semester: string;
    gender: 'MALE' | 'FEMALE';
    hostelId: string;
    hostelName: string;
    roomTypeId: string;
    roomTypeName: string;
    applicationDate: string;
    distanceFromCity: number;
    hasMedicalCondition: boolean;
    medicalDetails?: string;
    status:
      | 'SUBMITTED'
      | 'UNDER_SCRUTINY'
      | 'APPROVED'
      | 'REJECTED'
      | 'ALLOTTED';
    scrutinyRemarks?: string;
    scrutinizedBy?: string;
    scrutinizedAt?: string;
  }

  interface RoomAllotment {
    id: string;
    applicationId: string;
    studentId: string;
    studentName: string;
    hostelId: string;
    hostelName: string;
    roomId: string;
    roomNumber: string;
    bedId: string;
    bedNumber: string;
    allotmentDate: string;
    allottedBy: string;
    validFrom: string;
    validTill: string;
    status: 'PENDING_CHECKIN' | 'CHECKED_IN' | 'VACATED' | 'CANCELLED';
  }

  interface CheckInRecord {
    id: string;
    allotmentId: string;
    studentId: string;
    checkInDate: string;
    checkInTime: string;
    assetsHandedOver: {
      assetId: string;
      assetName: string;
      condition: string;
    }[];
    remarks: string;
    checkedInBy: string;
  }

  interface RoomChangeRequest {
    id: string;
    studentId: string;
    studentName: string;
    currentHostelId: string;
    currentRoomId: string;
    requestedHostelId?: string;
    requestedRoomTypeId?: string;
    reason: string;
    requestDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvalRemarks?: string;
    approvedBy?: string;
    approvalDate?: string;
  }
  // ─── Phase 3: Gate Pass, Leave, and Visitors ────────────────────────────

  interface GatePass {
    id: string;
    studentId: string;
    studentName: string;
    hostelId: string;
    roomId: string;
    outTime: string;
    expectedInTime: string;
    actualInTime?: string;
    purpose: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'RETURNED';
    approvedBy?: string;
    remarks?: string;
  }

  interface LeaveRequest {
    id: string;
    studentId: string;
    studentName: string;
    hostelId: string;
    roomId: string;
    fromDate: string;
    toDate: string;
    reason: string;
    contactNumber: string;
    parentConsent: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    remarks?: string;
  }

  interface AttendanceRecord {
    id: string;
    date: string;
    hostelId: string;
    markedBy: string;
    records: {
      studentId: string;
      studentName: string;
      roomId: string;
      status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
      remarks?: string;
    }[];
  }

  interface VisitorRecord {
    id: string;
    studentId: string;
    studentName: string;
    visitorName: string;
    relation: string;
    contactNumber: string;
    purpose: string;
    expectedDate: string;
    expectedTime: string;
    actualInTime?: string;
    actualOutTime?: string;
    status: 'PRE_REGISTERED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REJECTED';
    approvedBy?: string;
  }

  interface DisciplinaryAction {
    id: string;
    hostelId: string;
    studentId: string;
    studentName: string;
    incidentDate: string;
    description: string;
    actionTaken: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    reportedBy: string;
    status: 'OPEN' | 'CLOSED';
  }

  interface IncidentReport {
    id: string;
    hostelId: string;
    reportedBy: string; // studentId or staffId
    incidentType: 'THEFT' | 'FIGHT' | 'DAMAGE' | 'MEDICAL' | 'OTHER';
    title: string;
    date: string;
    time: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
    resolutionRemarks?: string;
  }
  // ─── Phase 4: Maintenance, Stock, and Staff ────────────────────────────

  interface MaintenanceRequest {
    id: string;
    hostelId: string;
    roomId: string;
    reportedBy: string; // studentId or staffId
    issueType: 'ELECTRICAL' | 'PLUMBING' | 'CARPENTRY' | 'CLEANING' | 'OTHER';
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    requestDate: string;
    status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    assignedTo?: string; // staffId
    resolutionRemarks?: string;
    feedbackScore?: number;
    feedbackRemarks?: string;
  }

  interface StockTransaction {
    id: string;
    hostelId: string;
    itemId: string;
    itemName: string;
    transactionType: 'PROCUREMENT' | 'ISSUE' | 'RETURN' | 'DAMAGE_SCRAP';
    quantity: number;
    date: string;
    remarks: string;
    performedBy: string; // staffId or vendorId depending on type
    referenceId?: string; // e.g. Purchase Order ID
  }

  interface Vendor {
    id: string;
    vendorName: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    address: string;
    categoriesSupplied: string[]; // e.g. ["ELECTRICAL", "FOOD"]
    status: 'ACTIVE' | 'INACTIVE';
  }

  interface PurchaseOrder {
    id: string;
    vendorId: string;
    vendorName: string;
    hostelId: string;
    orderDate: string;
    expectedDeliveryDate: string;
    items: {
      itemId: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
    }[];
    totalAmount: number;
    status: 'DRAFT' | 'SENT' | 'PARTIAL_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  }

  interface HostelStaff {
    id: string;
    employeeId: string; // Link to core Employee management if exists
    name: string;
    role:
      | 'WARDEN'
      | 'CARETAKER'
      | 'SECURITY'
      | 'CLEANER'
      | 'ELECTRICIAN'
      | 'PLUMBER';
    hostelId: string;
    contactNumber: string;
    shiftId: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  }

  interface StaffAttendance {
    id: string;
    staffId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE';
    inTime?: string;
    outTime?: string;
    markedBy: string;
  }
  // ─── Phase 5: Health, Dashboards, and Reports ────────────────────────────

  interface MedicalEmergency {
    id: string;
    studentId: string;
    studentName: string;
    hostelId: string;
    reportedBy: string; // Staff or Student ID
    date: string;
    time: string;
    description: string;
    actionTaken: string;
    hospitalReferred: boolean;
    hospitalName?: string;
    status: 'OPEN' | 'RESOLVED';
  }

  interface SickDietRequest {
    id: string;
    studentId: string;
    studentName: string;
    hostelId: string;
    startDate: string;
    endDate: string;
    dietRequirements: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    approvedBy?: string;
  }

  interface FirstAidLog {
    id: string;
    hostelId: string;
    date: string;
    studentId: string;
    studentName: string;
    treatmentGiven: string;
    administeredBy: string; // Staff ID
  }

  interface MessMenu {
    id: string;
    hostelId: string; // Or applied globally
    dayOfWeek:
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';
    mealType: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
    items: string[];
  }

  interface MealAttendance {
    id: string;
    hostelId: string;
    date: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
    studentId: string;
    scannedAt: string; // Time
  }

  interface MessFeedback {
    id: string;
    studentId: string;
    hostelId: string;
    date: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
    rating: number; // 1-5
    comments: string;
  }
}
