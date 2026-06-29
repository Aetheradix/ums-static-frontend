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

export interface MasterLookups {
  genders: GenderItem[];
  castes: CasteItem[];
  nationalities: NationalityItem[];
  residencyStatuses: ResidencyStatusItem[];
  occupations: OccupationItem[];
  designations: DesignationItem[];
  addressTypes: AddressTypeItem[];
  academicYears: AcademicYearItem[];
  programmes: ProgrammeItem[];
  degreeLevels: DegreeLevelItem[];
  specialisations: SpecialisationItem[];
  programmeModes: ProgrammeModeItem[];
  states: StateItem[];
  divisions: DivisionItem[];
  districts: DistrictItem[];
  tehsils: TehsilItem[];
  blocks: BlockItem[];
  collegeCategories: CollegeCategoryItem[];
  collegeTypes: CollegeTypeItem[];
  allColleges: CollegeRegistrationItem[];
}

export interface GenderItem {
  id: number;
  name: string;
  text: string;
  isActive: boolean;
}

export interface CasteItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface NationalityItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface ResidencyStatusItem {
  id: number;
  name: string;
  text: string;
  isActive: boolean;
}

export interface OccupationItem {
  id: number;
  name: string;
  text: string;
  isActive: boolean;
}

export interface DesignationItem {
  id: number;
  name: string;
  code: string;
  level: number;
  isActive: boolean;
}

export interface AddressTypeItem {
  id: number;
  name: string;
  text: string;
  isActive: boolean;
}

export interface AcademicYearItem {
  id: number;
  name: string;
  session: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
}

export interface ProgrammeItem {
  id: number;
  name: string;
  code: string;
  durationYears: number;
  isActive: boolean;
}

export interface DegreeLevelItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface SpecialisationItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface ProgrammeModeItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface StateItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface DivisionItem {
  id: number;
  name: string;
  stateId: number;
  stateName: string;
  isActive: boolean;
}

export interface DistrictItem {
  id: number;
  name: string;
  divisionId: number;
  divisionName: string;
  isActive: boolean;
}

export interface TehsilItem {
  id: number;
  name: string;
  districtId: number;
  districtName: string;
  isActive: boolean;
}

export interface BlockItem {
  id: number;
  name: string;
  tehsilId: number;
  tehsilName: string;
  isActive: boolean;
}

export interface CollegeCategoryItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CollegeTypeItem {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CollegeRegistrationItem {
  id: number;
  collegeRegistrationId: number;
  collegeName: string;
  name: string;
  district: string;
  city: string;
  isActive: boolean;
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
