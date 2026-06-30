declare namespace ResidentialAllocationManagement {
  export interface Estate {
    code: string;
    name: string;
    type: string;
    targetStaff: string;
    payLevelEligible: string;
    district: string;
    city: string;
    address: string;
    pincode: string;
    floors: number;
    flatsCount: number;
    occupancy: number;
    available: number;
    wardenName: string;
    wardenMobile: string;
    wardenEmail: string;
    securityDeposit: number;
    hraDeduction: number;
    maintenanceFee: number;
    waterCharges: number;
    status: string;
    synopsis: string;
  }

  export interface DocumentsDossier {
    photo: string;
    salarySlip: string;
    joiningLetter: string;
    nocCertificate: string;
  }

  export interface StaffApplication {
    id: string;
    enrollmentNo: string;
    name: string;
    fatherName: string;
    motherName: string;
    gender: string;
    dob: string;
    mobile: string;
    email: string;
    department: string;
    designation: string;
    payLevel: string;
    basicPay: number;
    dateOfJoining: string;
    permanentAddress: string;
    district: string;
    city: string;
    pincode: string;
    blockPreference: string;
    quarterPreference: string;
    familyDependents: string;
    specialRequirement: string;
    emergencyName: string;
    emergencyMobile: string;
    emergencyRelationship: string;
    bloodGroup: string;
    medicalCondition: string;
    disabilityDetails: string;
    allergies: string;
    documents: DocumentsDossier;
    declaration: boolean;
    signature: string;
    status: 'Pending' | 'Approved' | 'Sent Back' | 'Rejected';
    adminRemarks: string;
    allottedEstate: string;
    allottedFlat: string;
    feeStatus: 'Paid' | 'Unpaid';
  }

  export interface CheckedInRecord {
    appId: string;
    staffName: string;
    enrollmentNo: string;
    estateCode: string;
    flatNo: string;
    checkInDate: string;
    luggage: string;
    remarks: string;
  }

  export interface FeeReceipt {
    appId: string;
    staffName: string;
    enrollmentNo: string;
    estateName: string;
    flatNo: string;
    securityDeposit: number;
    hraDeduction: number;
    maintenanceFee: number;
    waterCharges: number;
    total: number;
    paid: boolean;
  }
}
