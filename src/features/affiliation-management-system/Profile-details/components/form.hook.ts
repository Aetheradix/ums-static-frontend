import Joi from 'joi';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

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
  role: string;
  status: string;
  qualification: string;
  experience: string;
  joiningDate: Date | null;
  dateOfBirth: Date | null;
  subject: string;
}

export interface AdditionalInstitution {
  institutionName: string;
  address: string;
  course: string;
  seats: string;
  class: string;
  year: string;
  type: string;
  conditions: string;
  statusOfCompliance: string;
}

export interface ProfileDetailsFormData {
  // Step 1: General Info
  applicationNumber: string;
  collegeName: string;
  societyName: string;
  yearOfFoundationCollege: string;
  yearOfFoundationSociety: string;
  corporateOfficeAddress: string;
  collegeAddress: string;
  anyOtherAddress: string;

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

  // Step 3: Infra & Facilities
  totalArea: string;
  isRentedBuilding: string;
  rentAgreementDocument: any;
  provisionToConstruct: string;
  accommodationDetails: string;
  qualityOfBuilding: string;

  photoOfCollegeBuilding: any;
  buildingMap: any;

  // Additional Step 3
  requiredClassrooms: string;
  accessibleToPublic: string;
  classroomDetails: string;
  securityProblems: string;
  parkingSpace: string;
  neighbourComplaints: string;
  neighbourComplaintsRemarks: string;
  sharedCampus: string;

  teachingStaffRecruited: string;
  nonTeachingStaffRecruited: string;
  teachingAids: string;

  libraryBooksCount: string;
  bookStudentRatio: string;
  libraryBuildingAvailable: string;
  readingRoomAvailable: string;
  readingRoomDimensions: string;
  libraryStaffAvailable: string;
  booksIssuedRegularly: string;
  booksRelevant: string;
  journalsSubscribed: string;
  journalsCount: string;
  latestJournalIssues: string;

  studentPassFailRecord: string;

  laboratoryRequired: string;
  labFloorSpace: string;
  labExclusive: string;
  lightAirConditions: string;
  labEquipmentDetails: string;
  workshopDetails: string;
  hospitalAvailability: string;

  sportsFacilityAvailable: string;
  adequateForStudents: string;
  outdoorGamesFacility: string;
  outdoorFacilitiesInUse: string;
  sportsConsumablesProvided: string;
  medicalAttendantAvailable: string;
  emergencyMedicineStock: string;
  firstAidFacility: string;
  hostelAvailable: string;
  accommodationAvailability: string;

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
  feesDeposited: string;
  feeDepositDetails: string;
  endowmentFundDetails: string;
  statutoryNormsAdhered: string;
  approvedFeeStructureAdhered: string;
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
  objectionToInfoPublic: string;
  transparencyRemarks: string;

  // Section 14: Certification & Signatures
  principalName: string;
  dateOfCertification: Date | null;
  managementMemberName: string;
  managementDesignation: string;
  principalSignature: any;
  managementSignature: any;
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
  role: Joi.string().allow('', null),
  status: Joi.string().allow('', null),
  qualification: Joi.string().allow('', null),
  experience: Joi.string().allow('', null),
  joiningDate: Joi.date().allow(null),
  dateOfBirth: Joi.date().allow(null),
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
  type: Joi.string().allow('', null),
  conditions: Joi.string().allow('', null),
  statusOfCompliance: Joi.string().allow('', null),
});

const schema = validation.create<ProfileDetailsFormData>(o => ({
  applicationNumber: o
    .string()
    .required()
    .messages({ 'string.empty': 'Application Number required' }),
  collegeName: o
    .string()
    .required()
    .messages({ 'string.empty': 'College Name required' }),
  societyName: o.string().allow('', null),
  yearOfFoundationCollege: o.string().allow('', null),
  yearOfFoundationSociety: o.string().allow('', null),
  corporateOfficeAddress: o
    .string()
    .required()
    .messages({ 'string.empty': 'Address required' }),
  collegeAddress: o.string().allow('', null),
  anyOtherAddress: o.string().allow('', null),

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

  executiveName: o
    .string()
    .required()
    .messages({ 'string.empty': 'Executive Name required' }),
  executiveAge: o
    .string()
    .required()
    .messages({ 'string.empty': 'Age required' }),
  executiveQualification: o
    .string()
    .required()
    .messages({ 'string.empty': 'Qualification required' }),
  executiveMobileNumber: o
    .string()
    .required()
    .messages({ 'string.empty': 'Mobile Number required' }),
  executiveOccupationAddress: o
    .string()
    .required()
    .messages({ 'string.empty': 'Address required' }),

  governingBodyMembers: Joi.array().items(governingBodyMemberSchema),

  existingCourses: Joi.array().items(existingCourseSchema),
  teachingStaff: Joi.array().items(teachingStaffSchema),
  additionalInstitutions: Joi.array().items(additionalInstitutionSchema),

  totalArea: o.string().allow('', null),
  isRentedBuilding: o.string().allow('', null),
  rentAgreementDocument: o.any().allow(null),
  provisionToConstruct: o.string().allow('', null),
  accommodationDetails: o.string().allow('', null),
  qualityOfBuilding: o.string().allow('', null),

  photoOfCollegeBuilding: o.any().allow(null),
  buildingMap: o.any().allow(null),

  requiredClassrooms: o.string().allow('', null),
  accessibleToPublic: o.string().allow('', null),
  classroomDetails: o.string().allow('', null),
  securityProblems: o.string().allow('', null),
  parkingSpace: o.string().allow('', null),
  neighbourComplaints: o.string().allow('', null),
  neighbourComplaintsRemarks: o.string().allow('', null),
  sharedCampus: o.string().allow('', null),

  teachingStaffRecruited: o.string().allow('', null),
  nonTeachingStaffRecruited: o.string().allow('', null),
  teachingAids: o.string().allow('', null),

  libraryBooksCount: o.string().allow('', null),
  bookStudentRatio: o.string().allow('', null),
  libraryBuildingAvailable: o.string().allow('', null),
  readingRoomAvailable: o.string().allow('', null),
  readingRoomDimensions: o.string().allow('', null),
  libraryStaffAvailable: o.string().allow('', null),
  booksIssuedRegularly: o.string().allow('', null),
  booksRelevant: o.string().allow('', null),
  journalsSubscribed: o.string().allow('', null),
  journalsCount: o.string().allow('', null),
  latestJournalIssues: o.string().allow('', null),

  studentPassFailRecord: o.string().allow('', null),

  laboratoryRequired: o.string().allow('', null),
  labFloorSpace: o.string().allow('', null),
  labExclusive: o.string().allow('', null),
  lightAirConditions: o.string().allow('', null),
  labEquipmentDetails: o.string().allow('', null),
  workshopDetails: o.string().allow('', null),
  hospitalAvailability: o.string().allow('', null),

  sportsFacilityAvailable: o.string().allow('', null),
  adequateForStudents: o.string().allow('', null),
  outdoorGamesFacility: o.string().allow('', null),
  outdoorFacilitiesInUse: o.string().allow('', null),
  sportsConsumablesProvided: o.string().allow('', null),
  medicalAttendantAvailable: o.string().allow('', null),
  emergencyMedicineStock: o.string().allow('', null),
  firstAidFacility: o.string().allow('', null),
  hostelAvailable: o.string().allow('', null),
  accommodationAvailability: o.string().allow('', null),

  sourceOfFunding: o.string().allow('', null),
  annualProjectedIncome: o.string().allow('', null),
  regularBooksMaintained: o.string().allow('', null),
  accountsAudited: o.string().allow('', null),

  statutoryConditions: o.string().allow('', null),
  sessionPermissionGranted: o.string().allow('', null),
  mpGovtPermission: o.string().allow('', null),
  mpGovtConditions: o.string().allow('', null),

  statute28Fulfilled: o.string().allow('', null),
  feesDeposited: o.string().allow('', null),
  feeDepositDetails: o.string().allow('', null),
  endowmentFundDetails: o.string().allow('', null),
  statutoryNormsAdhered: o.string().allow('', null),
  approvedFeeStructureAdhered: o.string().allow('', null),
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
  objectionToInfoPublic: o.string().allow('', null),
  transparencyRemarks: o.string().allow('', null),

  principalName: o.string().allow('', null),
  dateOfCertification: o.any().allow(null),
  managementMemberName: o.string().allow('', null),
  managementDesignation: o.string().allow('', null),
  principalSignature: o.any().allow(null),
  managementSignature: o.any().allow(null),
}));

export function useProfileDetailsForm() {
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
      applicationNumber: 'APP-2026-9021',
      collegeName: 'Global Institute of Technology',
      societyName: 'Global Education Society',
      yearOfFoundationCollege: '2010',
      yearOfFoundationSociety: '2005',
      corporateOfficeAddress:
        '123, Tech Park Avenue, Scheme No. 78, Indore, MP 452010',
      collegeAddress: 'Knowledge Village, Airport Road, Indore, MP 452005',
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
      governingBodyMembers: [
        {
          memberName: '',
          fathersName: '',
          age: '',
          qualification: '',
          mobileNumber: '',
          occupationAddress: '',
        },
      ],
      existingCourses: [
        {
          courseName: '',
          seats: '',
          class: '',
          year: '',
          type: '',
          conditions: '',
          statusOfCompliance: '',
        },
      ],
      teachingStaff: [
        {
          name: '',
          role: '',
          status: '',
          qualification: '',
          experience: '',
          joiningDate: null,
          dateOfBirth: null,
          subject: '',
        },
      ],
      additionalInstitutions: [
        {
          institutionName: '',
          address: '',
          course: '',
          seats: '',
          class: '',
          year: '',
          type: '',
          conditions: '',
          statusOfCompliance: '',
        },
      ],
      totalArea: '',
      isRentedBuilding: '',
      rentAgreementDocument: null,
      provisionToConstruct: '',
      accommodationDetails: '',
      qualityOfBuilding: '',
      photoOfCollegeBuilding: null,
      buildingMap: null,
      requiredClassrooms: '',
      accessibleToPublic: '',
      classroomDetails: '',
      securityProblems: '',
      parkingSpace: '',
      neighbourComplaints: '',
      neighbourComplaintsRemarks: '',
      sharedCampus: '',
      teachingStaffRecruited: '',
      nonTeachingStaffRecruited: '',
      teachingAids: '',
      libraryBooksCount: '',
      bookStudentRatio: '',
      libraryBuildingAvailable: '',
      readingRoomAvailable: '',
      readingRoomDimensions: '',
      libraryStaffAvailable: '',
      booksIssuedRegularly: '',
      booksRelevant: '',
      journalsSubscribed: '',
      journalsCount: '',
      latestJournalIssues: '',
      studentPassFailRecord: '',
      laboratoryRequired: '',
      labFloorSpace: '',
      labExclusive: '',
      lightAirConditions: '',
      labEquipmentDetails: '',
      workshopDetails: '',
      hospitalAvailability: '',
      sportsFacilityAvailable: '',
      adequateForStudents: '',
      outdoorGamesFacility: '',
      outdoorFacilitiesInUse: '',
      sportsConsumablesProvided: '',
      medicalAttendantAvailable: '',
      emergencyMedicineStock: '',
      firstAidFacility: '',
      hostelAvailable: '',
      accommodationAvailability: '',
      sourceOfFunding: '',
      annualProjectedIncome: '',
      regularBooksMaintained: '',
      accountsAudited: '',
      statutoryConditions: '',
      sessionPermissionGranted: '',
      mpGovtPermission: '',
      mpGovtConditions: '',
      statute28Fulfilled: '',
      feesDeposited: '',
      feeDepositDetails: '',
      endowmentFundDetails: '',
      statutoryNormsAdhered: '',
      approvedFeeStructureAdhered: '',
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
      principalName: '',
      dateOfCertification: null,
      managementMemberName: '',
      managementDesignation: '',
      principalSignature: null,
      managementSignature: null,
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
  };
}
