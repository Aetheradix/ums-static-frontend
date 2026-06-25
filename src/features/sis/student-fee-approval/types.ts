export interface StudentApplicationPayload {
  academicSession: string;
  programmeId: number;
  programmeName: string;
  academic: {
    degreeLevelId: number;
    degreeLevelName: string;
    programmeId: number;
    programmeName: string;
    specialisationId: number;
    specialisationName: string;
  };
  basicInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    casteId: number;
    casteName: string;
    dateOfBirth: string;
    age: number;
  };
  address: {
    addressType: string;
    country: string;
    stateId: number;
    stateName: string;
    divisionId: number;
    divisionName: string;
    districtId: number;
    districtName: string;
    tehsilId: number;
    tehsilName: string;
    blockId: number;
    blockName: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    zipcode: number;
  };
}

export interface StudentApplication {
  studentApplicationId: number;
  academicSession: string;
  applicationDate: string;
  programmeId: number;
  programmeName: string;
  isFeePaid: boolean;
  isApproved: boolean;
  lastDateOfSubmission: string;
  payload: StudentApplicationPayload;
}
