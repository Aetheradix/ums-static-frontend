declare namespace HostelManagement {
  // ─── Hostel ──────────────────────────────────────────────────────────────

  interface Hostel {
    code: string;
    name: string;
    type: 'Boys' | 'Girls' | 'Co-Ed';
    college: string;
    category: string;
    state: string;
    district: string;
    city: string;
    address: string;
    pincode: string;
    floors: number;
    rooms: number;
    beds: number;
    occupancy: number;
    available: number;
    wardenName: string;
    wardenMobile: string;
    wardenEmail: string;
    assistantWarden: string;
    assistantWardenMobile: string;
    facilities: string[];
    securityDeposit: number;
    hostelFee: number;
    messFee: number;
    electricityCharges: number;
    status: 'Active' | 'Inactive';
  }

  // ─── Room ─────────────────────────────────────────────────────────────────

  interface Room {
    hostelCode: string;
    hostelName: string;
    roomNumber: string;
    roomName: string;
    floorNumber: string;
    blockWing: string;
    roomType: string;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    facilities: string[];
    category: string;
    additionalCharges: number;
    status: string;
    active: string;
  }

  // ─── Application ──────────────────────────────────────────────────────────

  interface ApplicationDocuments {
    photo: string;
    aadhaar: string;
    admissionReceipt: string;
    collegeId: string;
  }

  interface Application {
    id: string;
    enrollmentNo: string;
    name: string;
    fatherName: string;
    motherName: string;
    gender: string;
    dob: string;
    mobile: string;
    email: string;
    university: string;
    college: string;
    course: string;
    branch: string;
    semester: string;
    admissionYear: string;
    permanentAddress: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    distance: string;
    hostelPreference: string;
    roomPreference: string;
    needMess: string;
    checkInDate: string;
    specialRequirement: string;
    guardianName: string;
    relationship: string;
    guardianMobile: string;
    guardianAddress: string;
    emergencyName: string;
    emergencyMobile: string;
    emergencyRelationship: string;
    bloodGroup: string;
    medicalCondition: string;
    disabilityDetails: string;
    allergies: string;
    documents: ApplicationDocuments;
    declaration: boolean;
    signature: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Sent Back';
    adminRemarks: string;
    allottedHostel: string;
    allottedRoom: string;
    allottedBed: string;
    feeStatus: 'Unpaid' | 'Paid';
  }

  // ─── Check-In ─────────────────────────────────────────────────────────────

  interface CheckInRecord {
    appId: string;
    studentName: string;
    enrollmentNo: string;
    hostelCode: string;
    roomNo: string;
    bedNo: string;
    checkInDate: string;
    luggage: string;
    remarks: string;
  }

  // ─── Notification ─────────────────────────────────────────────────────────

  interface Notification {
    message: string;
    type: 'success' | 'error';
  }
}
