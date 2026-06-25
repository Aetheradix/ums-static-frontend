declare namespace AffiliationManagementSystem {
  export interface DraftRegistrationRequest {
    registrationId: number;
    establishmentYear: number;
    collegeName: string;
    collegeCode: string;
    collegeAddress: string;
    districtId: number;
    telephoneNo: string;
    collegeEmail: string;
    collegeCategoryId: number;
    collegeTypeId: number;
    accommodationType: string;
    collegeArea: string;
    applicationNumber?: string;
    availableFacilitiesOther?: string;
    transactionId?: string;
    transactionDate?: string;
    totalFees?: number;
    feeStructure?: string;
    isFeePaid?: boolean;
    availableFacilities: number[];
    affiliation?: AffiliationOtherDetailsDto;
    courses: CollegeCourseDetailDto[];
  }
}
