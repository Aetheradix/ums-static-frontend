declare namespace AffiliationManagementSystem {
  export interface CollegeRegistrationForm {
    collegeCode: string;
    establishmentYear: number;
    collegeName: string;
    collegeAddress: string;
    districtId: number;
    telephoneNo: string;
    collegeEmail: string;
    collegeCategoryId: number;
    collegeTypeId: number;
    accommodationType: string;
    collegeArea: string;
    availableFacilities: Record<number, boolean>;
    otherFacilities?: { facilityName: string }[];
    applicationNumber?: string;
    isSubmitted?: boolean;
    transactionId?: string;
    transactionDate?: string | null;
    totalFees?: number;
    feeStructure?: string;
    isFeePaid?: boolean;
  }

  export interface AffiliationOtherDetailsForm {
    affiliationId?: number;
    registrationId?: number;
    principalDirectorName: string;
    principalMobileNo: string;
    principalEmail: string;
    societyName: string;
    secretaryName: string;
    societyRegistrationNo: string;
    societyRegistrationDate: Date;
    isOtherInstitutionRunning: boolean;
  }

  export interface CollegeCourseDetailForm {
    collegeCourseDetailId?: number;
    registrationId?: number;
    courseId: number;
    subjectIds: number[];
    totalAmount?: number;
    isFeePaid?: boolean;
    paymentDate?: string | null;
  }

  export interface CollegeAffiliationDocumentForm {
    documentId: string;
    documentType: string;
  }

  export interface CollegeRegistrationListItem {
    collegeRegistrationId: number;
    collegeName: string;
    collegeCategoryId: number;
    collegeTypeId: number;
    collegeArea: string;
    isActive: boolean;
  }
  export interface CollegeRegistrationApprovalItem {
    collegeRegistrationId: number;
    collegeName: string;
    collegeCategoryId: number;
    collegeTypeId: number;
    collegeArea: string;
    approvalStatus: number;
    rejectionReason?: string;
    isActive: boolean;
    createdOn: string;
    applicationNumber?: string;
  }

  /** Combined form data for the multi-step application */

  export type CollegeApplicationFormData = CollegeRegistrationForm &
    AffiliationOtherDetailsForm & {
      courses: CollegeCourseDetailForm[];
    } & {
      enclosures: Record<number, boolean>;
      nocFile: File | null;
      affidavitFile: File | null;
      regularAuthorityFile: File | null;
    };

  export interface ProgrammeFeeItem {
    programmeFeeId: number;
    programmeId: number;
    securityDepositAmount: number;
    affiliationFee: number;
    inspectionFee: number;
    otherFee: number | null;
    isActive: boolean;
  }

  export interface CollegeRegistrationPreview {
    registrationId: number;
    establishmentYearId: number;
    collegeName: string;
    collegeAddress: string;
    districtId: number;
    telephoneNo: string;
    collegeEmail: string;
    collegeCategoryId: number;
    collegeTypeId: number;
    accommodationType: string;
    collegeCode: string;
    districtName: string;
    collegeArea: string;
    numberOfClassRooms: number;
    deficiencyEarlierRaisedByCommittee: boolean;
    availableFacilities: string[];
    transactionId?: string;
    transactionDate?: string;
    totalFees?: number;
    feeStructure?: string;
    isFeePaid?: boolean;
    otherDetail?: {
      principalDirectorName: string;
      principalMobileNo: string;
      principalEmail?: string;
      societyName: string;
      secretaryName: string;
      societyRegistrationNo: string;
      societyRegistrationDate: string;
      isOtherInstitutionRunning: boolean;
    };
    courseDetails: {
      collegeCourseDetailId: number;
      programmeFeesMappingId: number;
      totalAmount: number;
      isFeePaid: boolean;
    }[];
    documents: {
      collegeAffiliationDocumentId: number;
      documentId: string;
      documentType: string;
    }[];
  }
}
