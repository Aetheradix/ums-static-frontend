import Joi from 'joi';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { getCollegeRegistration } from '../../registrationStore';

export interface GoverningBodyMember {
  memberName: string;
  fathersName: string;
  age: string;
  qualification: string;
  mobileNumber: string;
  occupationAddress: string;
}

export interface ExistingCourse {
  courseName: string;
  seats: string;
  class: string;
  year: string;
  type: string;
  conditions: string;
  statusOfCompliance: string;
}

export interface TeachingStaff {
  name: string;
  role: string | number;
  status: string | number;
  qualification: string | number;
  experience: string;
  joiningDate: Date | null;
  dateOfBirth: Date | null;
  course: string;
  subject: string;
}

export interface AdditionalInstitution {
  institutionName: string;
  address: string;
  course: string;
  seats: string;
  class: string;
  year: string;
  type: string | number;
  conditions: string;
  statusOfCompliance: string;
  institutionPhoto?: any;
}

export interface LabDetail {
  labType: string;
  labFloorSpace: string;
  labExclusive: string;
  lightAirConditions: string;
  labEquipmentDetails: string;
  labPhoto: any;
}

export interface HostelDetail {
  hostelType: string;
  hostelName: string;
  capacity: string;
  roomsCount: string;
  wardenName: string;
}

export interface NonTeachingStaff {
  name: string;
  designation: string;
  status: string | number;
  joiningDate: Date | null;
}

export interface ProfileDetailsFormData {
  // Step 1: General Info
  affiliationType: number | string;
  collegeName: string;
  societyName?: string;
  yearOfFoundationCollege?: string;
  yearOfFoundationSociety?: string;
  corporateOfficeAddress?: string;
  collegeAddress: string;
  anyOtherAddress?: string;

  collegeType?: string;
  collegeEmail?: string;
  principalDirectorName?: string;
  principalMobileNo?: string;
  principalEmail?: string;
  stateName?: string;
  districtName?: string;
  blockTehsil?: string;
  pinCode?: string;

  ownershipEntityName: string;

  chairmanName: string;
  chairmanFathersName: string;
  chairmanAge: string;
  chairmanQualification: string;
  chairmanMobileNumber: string;
  chairmanOccupationAddress: string;

  executiveName: string;
  executiveAge: string;
  executiveQualification: string;
  executiveMobileNumber: string;
  executiveOccupationAddress: string;

  governingBodyMembers: GoverningBodyMember[];
  // Step 2: Academics & Inst
  existingCourses: ExistingCourse[];
  teachingStaff: TeachingStaff[];
  additionalInstitutions: AdditionalInstitution[];

  // Step 3: Land & Building
  landNormsFulfilled: string;
  landType: string;
  landRegistryDocument: any;
  landRentAgreement: any;
  landLeaseDocument: any;
  landTotalArea: string;
  builtUpArea: string;
  buildingPhotos: any[];

  totalArea: string;
  isRentedBuilding: string;
  rentAgreementDocument: any;
  registryDocument: any;
  provisionToConstruct: string;
  accommodationDetails: string;
  accommodationPhoto: any;
  qualityOfBuilding: string;
  latitude: string;
  longitude: string;

  // Step 4: Facilities
  classroomCount: string;
  requiredClassrooms: string;
  accessibleToPublic: string;
  classroomDetails: string;
  securityProblems: string;
  parkingSpace: string;
  neighbourComplaints: string;
  neighbourComplaintsRemarks: string;
  sharedCampus: string;
  sharedCampusArea: string;

  libraryBooksCount: string;
  bookStudentRatio: string;
  libraryBuildingAvailable: string;
  libraryBuildingPhoto: any;
  readingRoomAvailable: string;
  readingRoomDimensions: string;
  readingRoomPhoto: any;
  libraryStaffAvailable: string;
  booksIssuedRegularly: string;
  booksRelevant: string;
  journalsSubscribed: string;
  journalsCount: string;
  latestJournalIssues: string;

  laboratoryRequired: string;
  labs: LabDetail[];
  hospitalAvailability: string;

  sportsFacilityAvailable: string;
  studentPassFailRecord?: string;
  adequateForStudents: string;
  playgroundAvailable: string;
  playgroundPhoto: any;
  outdoorGamesFacility: string;
  outdoorFacilitiesInUse: string;
  sportsConsumablesProvided: string;
  medicalAttendantAvailable: string;
  emergencyMedicineStock: string;
  firstAidFacility: string;
  hostelAvailable: string;
  typeOfHostel: string;
  boysHostelsCount: string;
  girlsHostelsCount: string;
  totalHostelCapacity: string;
  hostels: HostelDetail[];

  // Step 5: Infrastructure (Furniture)
  tablesCount: string;
  chairsCount: string;
  studentDesksCount: string;
  studentBenchesCount: string;
  boardAvailable: string;
  boardQty: string;
  almirahsCount: string;

  // Step 6: Teachers & Institutions
  nonTeachingStaff: NonTeachingStaff[];

  // Step 8: Others
  parkingPhoto: any;
  drinkingWaterAvailable: string;
  waterPurifierAvailable: string;
  waterPurifierPhoto: any;
  cctvAvailable: string;
  transportAvailable: string;
  transportCount: string;
  transportPhotos: any[];
  safetyGuardsAvailable: string;
  fireExtinguishers: string;
  fireAlarmSystem: string;
  rampAvailable: string;
  liftAvailable: string;
  liftPhoto: any;
  accessibleToilet: string;
  accessibleClassroom: string;

  // Step 4: Compliance
  sourceOfFunding: string;
  annualProjectedIncome: string;
  regularBooksMaintained: string;
  accountsAudited: string;

  statutoryConditions: string;
  sessionPermissionGranted: string;
  mpGovtPermission: string;
  mpGovtConditions: string;

  statute28Fulfilled: string;
  endowmentFundDetails: string;
  endowmentFundDeposit: string;
  statutoryNormsAdhered: string;
  feeStructureAdhered: string;
  reservationNormsFollowed: string;
  statutoryNormsRemarks: string;

  // Section 11: Computers
  latestComputers: string;
  oldComputers: string;
  printers: string;
  scanners: string;
  internetAvailable: string;
  internetConnectionType: string;
  computerTrainedStaff: string;
  computerStudentRatio: string;
  workingComputers: string;
  downTime: string;
  licensedSoftwareAvailable: string;
  packagesInUse: string;
  futurePlansComputers: string;

  // Section 12: Equipment & Lab
  labAvailableAsPerNorms: string;
  equipmentLabFloorSpace: string;
  equipmentDescription: string;
  equipmentWorkshopDetails: string;
  equipmentHospitalAvailability: string;
  equipmentFirstAidFacility: string;
  fireFightingFacility: string;
  otherMajorInstrumentsAvailable: string;
  majorInstrumentsDetails: string;

  // Section 13: Miscellaneous
  residentialQuartersAvailable: string;
  residentialQuartersDetails: string;
  quarterDetails: string;
  guestHouseAvailable: string;
  seminarHallAvailable: string;
  objectionToInfoPublic: string;
  transparencyRemarks: string;

  // Document Uploads
  nocDocument: any;
  councilApprovalsDocument: any;
  societyRegistrationDocument: any;
  landDocumentsDocument: any;
  buildingPlanAndSafetyDocument: any;
  amenitiesProofDocument: any;
  photoOfCollegeBuilding: any;
  buildingMap: any;

  // Section 14: Certification & Signatures
  principalName: string;
  dateOfCertification: Date | null;
  principalSignature: any;
  managementSignature: any;
  isDeclared: boolean;
}

const governingBodyMemberSchema = Joi.object({
  memberName: Joi.string()
    .required()
    .messages({ 'string.empty': 'Member Name required' }),
  fathersName: Joi.string().allow('', null),
  age: Joi.string().allow('', null),
  qualification: Joi.string().allow('', null),
  mobileNumber: Joi.string().allow('', null),
  occupationAddress: Joi.string().allow('', null),
});

const existingCourseSchema = Joi.object({
  courseName: Joi.string()
    .required()
    .messages({ 'string.empty': 'Course Name required' }),
  seats: Joi.string().allow('', null),
  class: Joi.string().allow('', null),
  year: Joi.string().allow('', null),
  type: Joi.string().allow('', null),
  conditions: Joi.string().allow('', null),
  statusOfCompliance: Joi.string().allow('', null),
});

const teachingStaffSchema = Joi.object({
  name: Joi.string().required().messages({ 'string.empty': 'Name required' }),
  role: Joi.any().allow('', null),
  status: Joi.any().allow('', null),
  qualification: Joi.any().allow('', null),
  experience: Joi.string().allow('', null),
  joiningDate: Joi.date().allow(null),
  dateOfBirth: Joi.date().allow(null),
  course: Joi.string().allow('', null),
  subject: Joi.string().allow('', null),
});

const additionalInstitutionSchema = Joi.object({
  institutionName: Joi.string()
    .required()
    .messages({ 'string.empty': 'Institution Name required' }),
  address: Joi.string().allow('', null),
  course: Joi.string().allow('', null),
  seats: Joi.string().allow('', null),
  class: Joi.string().allow('', null),
  year: Joi.string().allow('', null),
  type: Joi.any().allow('', null),
  conditions: Joi.string().allow('', null),
  statusOfCompliance: Joi.string().allow('', null),
  institutionPhoto: Joi.any().allow(null),
});

const labSchema = Joi.object({
  labType: Joi.string()
    .required()
    .messages({ 'string.empty': 'Lab Type required' }),
  labFloorSpace: Joi.string().allow('', null),
  labExclusive: Joi.string().allow('', null),
  lightAirConditions: Joi.string().allow('', null),
  labEquipmentDetails: Joi.string().allow('', null),
  labPhoto: Joi.any().allow(null),
});

const hostelSchema = Joi.object({
  hostelType: Joi.string()
    .required()
    .messages({ 'string.empty': 'Hostel Type required' }),
  hostelName: Joi.string().allow('', null),
  capacity: Joi.string().allow('', null),
  roomsCount: Joi.string().allow('', null),
  wardenName: Joi.string().allow('', null),
});

const nonTeachingStaffSchema = Joi.object({
  name: Joi.string().required().messages({ 'string.empty': 'Name required' }),
  designation: Joi.string().allow('', null),
  status: Joi.any().allow('', null),
  joiningDate: Joi.date().allow(null),
});

const schema = validation.create<ProfileDetailsFormData>(o => ({
  affiliationType: o
    .any()
    .required()
    .messages({ 'string.empty': 'Affiliation Type is required' }),
  collegeName: o
    .string()
    .required()
    .messages({ 'string.empty': 'College Name required' }),
  societyName: o.string().allow('', null),
  yearOfFoundationCollege: o.string().allow('', null),
  yearOfFoundationSociety: o.string().allow('', null),
  corporateOfficeAddress: o.string().allow('', null),
  collegeAddress: o.string().allow('', null),
  anyOtherAddress: o.string().allow('', null),

  collegeType: o.string().allow('', null),
  collegeEmail: o.string().allow('', null),
  principalDirectorName: o.string().allow('', null),
  principalMobileNo: o.string().allow('', null),
  principalEmail: o.string().allow('', null),
  stateName: o.string().allow('', null),
  districtName: o.string().allow('', null),
  blockTehsil: o.string().allow('', null),
  pinCode: o.string().allow('', null),

  ownershipEntityName: o
    .string()
    .required()
    .messages({ 'string.empty': 'Entity Name required' }),

  chairmanName: o
    .string()
    .required()
    .messages({ 'string.empty': 'Chairman Name required' }),
  chairmanFathersName: o
    .string()
    .required()
    .messages({ 'string.empty': "Father's Name required" }),
  chairmanAge: o
    .string()
    .required()
    .messages({ 'string.empty': 'Age required' }),
  chairmanQualification: o
    .string()
    .required()
    .messages({ 'string.empty': 'Qualification required' }),
  chairmanMobileNumber: o
    .string()
    .required()
    .messages({ 'string.empty': 'Mobile Number required' }),
  chairmanOccupationAddress: o
    .string()
    .required()
    .messages({ 'string.empty': 'Address required' }),

  executiveName: o.string().allow('', null),
  executiveAge: o.string().allow('', null),
  executiveQualification: o.string().allow('', null),
  executiveMobileNumber: o.string().allow('', null),
  executiveOccupationAddress: o.string().allow('', null),

  governingBodyMembers: Joi.array().items(governingBodyMemberSchema),

  existingCourses: Joi.array().items(existingCourseSchema),
  teachingStaff: Joi.array().items(teachingStaffSchema),
  additionalInstitutions: Joi.array().items(additionalInstitutionSchema),

  landNormsFulfilled: o.string().allow('', null),
  landType: o.string().allow('', null),
  landRegistryDocument: o.any().allow(null),
  landRentAgreement: o.any().allow(null),
  landLeaseDocument: o.any().allow(null),
  landTotalArea: o.string().allow('', null),
  builtUpArea: o.string().allow('', null),
  buildingPhotos: o.any().allow(null),

  totalArea: o.string().allow('', null),
  isRentedBuilding: o.string().allow('', null),
  rentAgreementDocument: o.any().allow(null),
  registryDocument: o.any().allow(null),
  provisionToConstruct: o.string().allow('', null),
  accommodationDetails: o.string().allow('', null),
  accommodationPhoto: o.any().allow(null),
  qualityOfBuilding: o.string().allow('', null),
  latitude: o.string().allow('', null),
  longitude: o.string().allow('', null),

  classroomCount: o.string().allow('', null),
  requiredClassrooms: o.string().allow('', null),
  accessibleToPublic: o.string().allow('', null),
  classroomDetails: o.string().allow('', null),
  securityProblems: o.string().allow('', null),
  parkingSpace: o.string().allow('', null),
  neighbourComplaints: o.string().allow('', null),
  neighbourComplaintsRemarks: o.string().allow('', null),
  sharedCampus: o.string().allow('', null),
  sharedCampusArea: o.string().allow('', null),

  libraryBooksCount: o.string().allow('', null),
  bookStudentRatio: o.string().allow('', null),
  libraryBuildingAvailable: o.string().allow('', null),
  libraryBuildingPhoto: o.any().allow(null),
  readingRoomAvailable: o.string().allow('', null),
  readingRoomDimensions: o.string().allow('', null),
  readingRoomPhoto: o.any().allow(null),
  libraryStaffAvailable: o.string().allow('', null),
  booksIssuedRegularly: o.string().allow('', null),
  booksRelevant: o.string().allow('', null),
  journalsSubscribed: o.string().allow('', null),
  journalsCount: o.string().allow('', null),
  latestJournalIssues: o.string().allow('', null),

  laboratoryRequired: o.string().allow('', null),
  labs: Joi.array().items(labSchema),
  hospitalAvailability: o.string().allow('', null),

  sportsFacilityAvailable: o.string().allow('', null),
  studentPassFailRecord: o.string().allow('', null),
  adequateForStudents: o.string().allow('', null),
  playgroundAvailable: o.string().allow('', null),
  playgroundPhoto: o.any().allow(null),
  outdoorGamesFacility: o.string().allow('', null),
  outdoorFacilitiesInUse: o.string().allow('', null),
  sportsConsumablesProvided: o.string().allow('', null),
  medicalAttendantAvailable: o.string().allow('', null),
  emergencyMedicineStock: o.string().allow('', null),
  firstAidFacility: o.string().allow('', null),
  hostelAvailable: o.string().allow('', null),
  typeOfHostel: o.string().allow('', null),
  boysHostelsCount: o.string().allow('', null),
  girlsHostelsCount: o.string().allow('', null),
  totalHostelCapacity: o.string().allow('', null),
  hostels: Joi.array().items(hostelSchema),

  tablesCount: o.string().allow('', null),
  chairsCount: o.string().allow('', null),
  studentDesksCount: o.string().allow('', null),
  studentBenchesCount: o.string().allow('', null),
  boardAvailable: o.string().allow('', null),
  boardQty: o.string().allow('', null),
  almirahsCount: o.string().allow('', null),

  nonTeachingStaff: Joi.array().items(nonTeachingStaffSchema),

  parkingPhoto: o.any().allow(null),
  drinkingWaterAvailable: o.string().allow('', null),
  waterPurifierAvailable: o.string().allow('', null),
  waterPurifierPhoto: o.any().allow(null),
  cctvAvailable: o.string().allow('', null),
  transportAvailable: o.string().allow('', null),
  transportCount: o.string().allow('', null),
  transportPhotos: o.any().allow(null),
  safetyGuardsAvailable: o.string().allow('', null),
  fireExtinguishers: o.string().allow('', null),
  fireAlarmSystem: o.string().allow('', null),
  rampAvailable: o.string().allow('', null),
  liftAvailable: o.string().allow('', null),
  liftPhoto: o.any().allow(null),
  accessibleToilet: o.string().allow('', null),
  accessibleClassroom: o.string().allow('', null),

  sourceOfFunding: o.string().allow('', null),
  annualProjectedIncome: o.string().allow('', null),
  regularBooksMaintained: o.string().allow('', null),
  accountsAudited: o.string().allow('', null),

  statutoryConditions: o.string().allow('', null),
  sessionPermissionGranted: o.string().allow('', null),
  mpGovtPermission: o.string().allow('', null),
  mpGovtConditions: o.string().allow('', null),

  statute28Fulfilled: o.string().allow('', null),
  endowmentFundDetails: o.string().allow('', null),
  endowmentFundDeposit: o.string().allow('', null),
  statutoryNormsAdhered: o.string().allow('', null),
  feeStructureAdhered: o.string().allow('', null),
  reservationNormsFollowed: o.string().allow('', null),
  statutoryNormsRemarks: o.string().allow('', null),

  latestComputers: o.string().allow('', null),
  oldComputers: o.string().allow('', null),
  printers: o.string().allow('', null),
  scanners: o.string().allow('', null),
  internetAvailable: o.string().allow('', null),
  internetConnectionType: o.string().allow('', null),
  computerTrainedStaff: o.string().allow('', null),
  computerStudentRatio: o.string().allow('', null),
  workingComputers: o.string().allow('', null),
  downTime: o.string().allow('', null),
  licensedSoftwareAvailable: o.string().allow('', null),
  packagesInUse: o.string().allow('', null),
  futurePlansComputers: o.string().allow('', null),

  labAvailableAsPerNorms: o.string().allow('', null),
  equipmentLabFloorSpace: o.string().allow('', null),
  equipmentDescription: o.string().allow('', null),
  equipmentWorkshopDetails: o.string().allow('', null),
  equipmentHospitalAvailability: o.string().allow('', null),
  equipmentFirstAidFacility: o.string().allow('', null),
  fireFightingFacility: o.string().allow('', null),
  otherMajorInstrumentsAvailable: o.string().allow('', null),
  majorInstrumentsDetails: o.string().allow('', null),

  residentialQuartersAvailable: o.string().allow('', null),
  residentialQuartersDetails: o.string().allow('', null),
  quarterDetails: o.string().allow('', null),
  guestHouseAvailable: o.string().allow('', null),
  seminarHallAvailable: o.string().allow('', null),
  objectionToInfoPublic: o.string().allow('', null),
  transparencyRemarks: o.string().allow('', null),

  nocDocument: o.any().allow(null),
  councilApprovalsDocument: o.any().allow(null),
  societyRegistrationDocument: o.any().allow(null),
  landDocumentsDocument: o.any().allow(null),
  buildingPlanAndSafetyDocument: o.any().allow(null),
  amenitiesProofDocument: o.any().allow(null),
  photoOfCollegeBuilding: o.any().allow(null),
  buildingMap: o.any().allow(null),

  principalName: o.string().allow('', null),
  dateOfCertification: o.any().allow(null),
  principalSignature: o.any().allow(null),
  managementSignature: o.any().allow(null),
  isDeclared: o.boolean().allow(null, false),
}));

export function useProfileDetailsForm() {
  // Pre-fill from the submitted College Registration form (static prototype).
  const saved = getCollegeRegistration();

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
  } = useAppForm<ProfileDetailsFormData>({
    resolver: validation.resolver(schema),
    mode: 'onChange',
    defaultValues: {
      affiliationType: '',
      collegeName: saved?.collegeName || 'Global Institute of Technology',
      collegeType: saved?.collegeType || 'Private',
      collegeEmail: saved?.collegeEmail || 'admin@globalinstitute.edu',
      principalDirectorName:
        saved?.principalDirectorName || 'Dr. Rajesh Sharma',
      principalMobileNo: saved?.principalMobileNo || '9876543210',
      principalEmail:
        saved?.principalEmail || 'rajesh.sharma@globalinstitute.edu',
      stateName: saved?.stateName || 'Madhya Pradesh',
      districtName: saved?.districtName || 'Indore',
      blockTehsil: saved?.blockTehsil || 'Indore',
      pinCode: saved?.pinCode || '452001',
      collegeAddress:
        saved?.collegeAddress || '123 Education Lane, Knowledge Park, Phase 1',
      societyName: 'Global Education Society',
      yearOfFoundationCollege: '2010',
      yearOfFoundationSociety: '2005',
      corporateOfficeAddress:
        '123, Tech Park Avenue, Scheme No. 78, Indore, MP 452010',
      anyOtherAddress: 'N/A',
      ownershipEntityName: '',
      chairmanName: '',
      chairmanFathersName: '',
      chairmanAge: '',
      chairmanQualification: '',
      chairmanMobileNumber: '',
      chairmanOccupationAddress: '',
      executiveName: '',
      executiveAge: '',
      executiveQualification: '',
      executiveMobileNumber: '',
      executiveOccupationAddress: '',
      governingBodyMembers: [],
      existingCourses: [],
      teachingStaff: [],
      additionalInstitutions: [],
      landNormsFulfilled: '',
      landType: '',
      landRegistryDocument: null,
      landRentAgreement: null,
      landLeaseDocument: null,
      landTotalArea: '',
      builtUpArea: '',
      buildingPhotos: [],

      totalArea: '',
      isRentedBuilding: '',
      rentAgreementDocument: null,
      registryDocument: null,
      provisionToConstruct: '',
      accommodationDetails: '',
      accommodationPhoto: null,
      qualityOfBuilding: '',
      latitude: '',
      longitude: '',

      classroomCount: '',
      requiredClassrooms: '',
      accessibleToPublic: '',
      classroomDetails: '',
      securityProblems: '',
      parkingSpace: '',
      neighbourComplaints: '',
      neighbourComplaintsRemarks: '',
      sharedCampus: '',
      sharedCampusArea: '',
      libraryBooksCount: '',
      bookStudentRatio: '',
      libraryBuildingAvailable: '',
      libraryBuildingPhoto: null,
      readingRoomAvailable: '',
      readingRoomDimensions: '',
      readingRoomPhoto: null,
      libraryStaffAvailable: '',
      booksIssuedRegularly: '',
      booksRelevant: '',
      journalsSubscribed: '',
      journalsCount: '',
      latestJournalIssues: '',
      laboratoryRequired: '',
      labs: [],
      hospitalAvailability: '',
      sportsFacilityAvailable: '',
      studentPassFailRecord: '',
      adequateForStudents: '',
      playgroundAvailable: '',
      playgroundPhoto: null,
      outdoorGamesFacility: '',
      outdoorFacilitiesInUse: '',
      sportsConsumablesProvided: '',
      medicalAttendantAvailable: '',
      emergencyMedicineStock: '',
      firstAidFacility: '',
      hostelAvailable: '',
      boysHostelsCount: '',
      girlsHostelsCount: '',
      totalHostelCapacity: '',
      hostels: [],
      tablesCount: '',
      chairsCount: '',
      studentDesksCount: '',
      studentBenchesCount: '',
      boardAvailable: '',
      boardQty: '',
      almirahsCount: '',
      nonTeachingStaff: [],
      parkingPhoto: null,
      drinkingWaterAvailable: '',
      waterPurifierAvailable: '',
      waterPurifierPhoto: null,
      cctvAvailable: '',
      transportAvailable: '',
      transportCount: '',
      transportPhotos: [],
      safetyGuardsAvailable: '',
      fireExtinguishers: '',
      fireAlarmSystem: '',
      rampAvailable: '',
      liftAvailable: '',
      liftPhoto: null,
      accessibleToilet: '',
      accessibleClassroom: '',
      sourceOfFunding: '',
      annualProjectedIncome: '',
      regularBooksMaintained: '',
      accountsAudited: '',
      statutoryConditions: '',
      sessionPermissionGranted: '',
      mpGovtPermission: '',
      mpGovtConditions: '',
      statute28Fulfilled: '',
      endowmentFundDetails: '',
      endowmentFundDeposit: '',
      statutoryNormsAdhered: '',
      feeStructureAdhered: '',
      reservationNormsFollowed: '',
      statutoryNormsRemarks: '',
      latestComputers: '',
      oldComputers: '',
      printers: '',
      scanners: '',
      internetAvailable: '',
      internetConnectionType: '',
      computerTrainedStaff: '',
      computerStudentRatio: '',
      workingComputers: '',
      downTime: '',
      licensedSoftwareAvailable: '',
      packagesInUse: '',
      futurePlansComputers: '',
      labAvailableAsPerNorms: '',
      equipmentLabFloorSpace: '',
      equipmentDescription: '',
      equipmentWorkshopDetails: '',
      equipmentHospitalAvailability: '',
      equipmentFirstAidFacility: '',
      fireFightingFacility: '',
      otherMajorInstrumentsAvailable: '',
      majorInstrumentsDetails: '',
      residentialQuartersAvailable: '',
      residentialQuartersDetails: '',
      objectionToInfoPublic: '',
      transparencyRemarks: '',

      nocDocument: null,
      councilApprovalsDocument: null,
      societyRegistrationDocument: null,
      landDocumentsDocument: null,
      buildingPlanAndSafetyDocument: null,
      amenitiesProofDocument: null,
      photoOfCollegeBuilding: null,
      buildingMap: null,
      principalName: 'Dr. Aryan Patel',
      dateOfCertification: null,
      principalSignature: null,
      managementSignature: null,
      isDeclared: false,
    },
  });

  const governingBodyMembersArray = useFieldArray({
    control,
    name: 'governingBodyMembers',
  });
  const existingCoursesArray = useFieldArray({
    control,
    name: 'existingCourses',
  });
  const teachingStaffArray = useFieldArray({ control, name: 'teachingStaff' });
  const additionalInstitutionsArray = useFieldArray({
    control,
    name: 'additionalInstitutions',
  });
  const labsArray = useFieldArray({ control, name: 'labs' });
  const hostelsArray = useFieldArray({ control, name: 'hostels' });
  const nonTeachingStaffArray = useFieldArray({
    control,
    name: 'nonTeachingStaff',
  });

  return {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
    governingBodyMembersArray,
    existingCoursesArray,
    teachingStaffArray,
    additionalInstitutionsArray,
    labsArray,
    hostelsArray,
    nonTeachingStaffArray,
  };
}
