export interface CreateApplicationCommand {
  academicSession: string;
  programmeId: number;
  programmeName: string;
  academic: AcademicDto;
  basicInfo: BasicInfoDto;
  address: AddressDto;
  choices?: ChoiceFillingItemDto[];
}

export interface PriorEducationEntry {
  id: string;
  educationLevel: string;
  institutionName: string;
  boardOrUniversity: string;
  passingYear: number | null;
  percentage: number | null;
  cgpa: number | null;
  subjectsOrStream: string;
  documentType: string;
  documentFile: File | null;
  documentId: string | null;
}
export interface ChoiceFillingItemDto {
  districtId: number;
  districtName: string;
  collegeTypeId: number;
  collegeTypeName: string;
  collegeCategoryId: number;
  collegeCategoryName: string;
  collegeRegistrationId: number;
  collegeName: string;
}

export interface AcademicDto {
  degreeLevelId: number;
  degreeLevelName: string;
  programmeId: number;
  programmeName: string;
  specialisationId: number;
  specialisationName: string;
  priorEducations: PriorEducationApiEntry[];
}

export interface PriorEducationApiEntry {
  educationLevel: string;
  institutionName: string;
  boardOrUniversity: string;
  passingYear: number;
  percentage: number | null;
  cgpa: number | null;
  subjectsOrStream: string;
  documentType: string;
  documentId: string | null;
}

export interface BasicInfoDto {
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
  fatherName: string;
  fatherOccupation: string;
  fatherDesignation: string;
  fatherAnnualIncome: number;
  fatherContactNumber: string;
  motherName: string;
  motherOccupation: string;
  motherDesignation: string;
  motherAnnualIncome: number;
  motherContactNumber: string;
  residencyStatus: string;
  ethnicity: string;
  nationalityId: number;
  nationalityName: string;
}

export interface AddressDto {
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
}

export interface ApplicationFormData {
  academicSession: string;
  programme: string;

  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  caste: any;
  dateOfBirth: Date | null;
  age: number | null;
  fatherName: string;
  fatherOccupation: string;
  fatherDesignation: string;
  fatherAnnualIncome: number | null;
  fatherContactNumber: string;
  motherName: string;
  motherOccupation: string;
  motherDesignation: string;
  motherAnnualIncome: number | null;
  motherContactNumber: string;
  residencyStatus: string;
  ethnicity: string;
  nationality: string;

  degreeLevel: string;
  programOfStudy: any;
  specialisation: string;

  priorEducations: PriorEducationEntry[];

  addressType: string;
  country: string;
  state: string;
  division: string;
  district: string;
  tehsil: string;
  block: any;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  zipcode: number | null;

  choiceFilling: ChoiceFillingItemDto[];
}
