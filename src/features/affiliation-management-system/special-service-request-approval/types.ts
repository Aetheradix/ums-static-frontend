export type SpecialServiceApprovalStatus =
  | 'Pending Scrutiny'
  | 'Approved'
  | 'Deficiency Raised';

export type SpecialServiceCode =
  | 'LOCATION_CHANGE'
  | 'NAME_CHANGE'
  | 'SOCIETY_CHANGE'
  | 'SEAT_REDUCTION'
  | 'COURSE_CLOSURE'
  | 'COLLEGE_CLOSURE'
  | 'ADD_ON_COURSE';

export interface SubmittedDocument {
  id: string;
  name: string;
  documentType: string;
  fileSize: string;
  isVerified?: boolean;
}

export interface DeficiencyInfo {
  category?: string;
  remarks: string;
  raisedDate: string;
  complianceDeadline?: string;
  raisedBy?: string;
}

export interface SpecialServiceApprovalItem {
  id: string;
  applicationNo: string;
  collegeCode: string;
  collegeName: string;
  collegeType: 'private' | 'govt';
  academicYear: string;
  serviceId: number;
  serviceCode: SpecialServiceCode;
  serviceName: string;
  baseFee: number;
  gstAmount: number;
  feeAmount: number;
  isFeeExempted: boolean;
  paymentStatus: 'Paid' | 'Exempted' | 'Pending';
  transactionId?: string;
  paymentDate?: string;
  submissionDate: string;
  status: SpecialServiceApprovalStatus;
  declarationAccepted: boolean;
  committeeOrderNo?: string;
  scrutinyRemarks?: string;
  deficiencyDetails?: DeficiencyInfo;
  reviewedBy?: string;
  reviewedDate?: string;
  documents: SubmittedDocument[];
  // Specific data payload depending on service
  details: {
    // 1. Location Change (PDF Item 2, 9, 10)
    currentAddress?: string;
    proposedAddress?: string;
    state?: string;
    district?: string;
    tehsil?: string;
    pinCode?: string;
    landArea?: string;
    khasraNo?: string;
    builtUpArea?: string;

    // 2. Name Change (PDF Item 1, 18)
    currentCollegeName?: string;
    proposedCollegeName?: string;
    nameChangeReason?: string;

    // 3. Society Change (PDF Item 6)
    currentSocietyName?: string;
    proposedSocietyName?: string;
    societyRegNo?: string;

    // 4. Seat Reduction (PDF Item 3)
    courseName?: string;
    currentSeats?: number;
    proposedSeats?: number;
    seatReductionReason?: string;

    // 5. Course Closure (PDF Item 4)
    closureCourseName?: string;
    batchYear?: string;
    studentTransferPlan?: string;

    // 6. College Closure (PDF Item 5, 18)
    collegeClosureReason?: string;
    staffSettlementNoc?: string;

    // 7. Add-on Course (PDF Item 7)
    addonCourseTitle?: string;
    addonCourseType?: string;
    addonIntake?: number;
  };
}
