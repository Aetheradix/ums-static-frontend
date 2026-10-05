export interface InspectionMemberItem {
  id: number;
  name: string;
  designation: string;
  department: string;
  mobileNumber: string;
}

export interface GoverningBodyMemberItem {
  memberName: string;
  qualification: string;
  age: string | number;
  mobileNumber: string;
  address: string;
}

export interface AdditionalInstitutionItem {
  institutionName: string;
  programme: string;
  seats: string | number;
  year: string | number;
  affiliationType: string;
  address: string;
}

export interface CourseFeeItem {
  courseName: string;
  seats: string | number;
  class: string | number;
  academicYear: string;
  type: string;
  status: string;
  conditions: string;
}

export interface StaffMemberItem {
  name: string;
  role: string;
  qualification: string;
  department: string;
  experience: string;
  mobileNumber?: string;
}

export interface CollegeProfileDetails {
  collegeName: string;
  applicationNumber: string;
  verifiedDate: string;
  inspectionStatus: string;
  inspectionScheduledDate: string;
  inspectionOrderDocName: string;
  inspectionTeam: InspectionMemberItem[];

  // Step 1: College Registration Details
  collegeType: string;
  collegeEmail: string;
  principalName: string;
  principalMobileNumber: string;
  principalEmailId: string;
  state: string;
  district: string;
  blockTehsil: string;
  pinCode: string;
  collegeAddress: string;

  // Step 2: General Info
  ownershipEntityName: string;
  chairmanName: string;
  chairmanQualification: string;
  chairmanMobile: string;
  executiveName: string;
  executiveMobile: string;
  ownershipDocument: string;
  governingBodyMembers: GoverningBodyMemberItem[];
  additionalInstitutions: AdditionalInstitutionItem[];

  // Step 3: Course Registration
  courses: CourseFeeItem[];

  // Step 4: Land & Building Details
  landType: string;
  buildingType: string;
  landTotalArea: string;
  totalBuildingArea: string;
  buildingBuiltUpArea: string;
  qualityOfBuilding: string;
  landNormsFulfilled: string;
  accommodationDetails: string;
  sharedCampus: string;
  sharedCampusArea: string;
  latitudeLongitude: string;
  documents: {
    landDocument: string;
    otherLandDocument: string;
    buildingDocument: string;
    otherBuildingDocument: string;
    buildingMap: string;
    buildingPlanSafety: string;
    councilApprovals: string;
  };

  // Step 5: Academic Facilities
  totalClassrooms: string | number;
  classroomsAsPerNorms: string;
  accessibleToPublic: string;
  libraryBuildingAvailable: string;
  totalBooks: string | number;
  readingRoomAvailable: string;

  // Step 6: Computers & Equipment
  latestComputers: string | number;
  workingComputers: string | number;
  internetAvailability: string;
  printersScanners: string;
  computerStudentRatio: string;
  computerTrainedStaff: string;
  studentDesksBenches: string;
  tablesChairs: string;
  boardAvailable: string;

  // Step 7: Teaching & Non-Teaching Staff
  staff: StaffMemberItem[];

  // Step 8: Compliance
  annualProjectedIncome: string;
  sourceOfFunding: string;
  regularBooksMaintained: string;
  accountsAudited: string;
  mpGovtPermission: string;
  sessionPermissionGranted: string;
  statutoryConditions: string;
  stateGovtConditions: string;
  statuteFulfilled: string;
  statutoryNormsAdhered: string;
  feeStructureAdhered: string;
  reservationNormsFollowed: string;

  // Step 9: Others
  parkingSpace: string;
  firstAidFacility: string;
  drinkingWater: string;
  cctvSurveillance: string;
  transportFacility: string;
  safetyGuards: string;
  fireSafety: string;
  medicalAttendant: string;
  rampLiftFacility: string;

  // Step 10: Signature & Declaration
  principalSignatory: string;
  dateOfCertification: string;
  declarationStatus: string;
  principalSignature: string;
  managementSignature: string;
}

export const DUMMY_COLLEGE_PROFILES: Record<string, CollegeProfileDetails> = {
  // Bhopal Science - NCE260740649 (matches screenshots 1 to 7)
  NCE260740649: {
    collegeName: 'Bhopal Science',
    applicationNumber: 'NCE260740649',
    verifiedDate: '30-09-2026',
    inspectionStatus: 'Assigned',
    inspectionScheduledDate: '31/10/2026',
    inspectionOrderDocName: 'Inspection_Order_NCE260740649.pdf',
    inspectionTeam: [
      {
        id: 1,
        name: 'Dr. Rajiv Ranjan',
        designation: 'Professor',
        department: 'Computer Science',
        mobileNumber: '9826012456',
      },
      {
        id: 2,
        name: 'Dr. Meenakshi Sundaram',
        designation: 'Professor',
        department: 'Computer Science & Engg',
        mobileNumber: '9425034567',
      },
      {
        id: 3,
        name: 'Prof. Alok Verma',
        designation: 'Associate Professor',
        department: 'Information Technology',
        mobileNumber: '9893045678',
      },
      {
        id: 4,
        name: 'Dr. Deepak Joshi',
        designation: 'HOD',
        department: 'Computer Science',
        mobileNumber: '9755012389',
      },
    ],

    // Step 1
    collegeType: 'Private',
    collegeEmail: 'CollegeBhopal@gmail.com',
    principalName: 'Principal Name Z',
    principalMobileNumber: '9879789781',
    principalEmailId: 'PrincipalBhopal@gmail.com',
    state: 'MADHYA PRADESH',
    district: 'BHOPAL',
    blockTehsil: 'Block',
    pinCode: '462023',
    collegeAddress:
      '28–Sector A, Kasturba Nagar, Chetak Bridge, Bhopal–462023, India',

    // Step 2
    ownershipEntityName: 'Bhopal Science & Research Foundation Society',
    chairmanName: 'Dr. Surendra Mohan Sharma',
    chairmanQualification: 'Post Graduate (M.Tech, Ph.D.)',
    chairmanMobile: '9826014589',
    executiveName: 'Shri Rajeshwar Dayal',
    executiveMobile: '9826055441',
    ownershipDocument: 'Society_Registration_Deed_Bhopal_Science.pdf',
    governingBodyMembers: [
      {
        memberName: 'Dr. Surendra Mohan Sharma',
        qualification: 'Ph.D. Computer Science',
        age: 56,
        mobileNumber: '9826014589',
        address: 'E-5 Arera Colony, Bhopal',
      },
      {
        memberName: 'Prof. Ramesh Chandra Gupta',
        qualification: 'M.Sc., M.Phil',
        age: 52,
        mobileNumber: '9789789789',
        address: 'Malviya Nagar, Bhopal',
      },
    ],
    additionalInstitutions: [
      {
        institutionName: 'Bhopal College of Polytechnic',
        programme: 'Diploma Engg',
        seats: 120,
        year: 2022,
        affiliationType: 'Permanent',
        address: 'Kasturba Nagar, Bhopal MP',
      },
      {
        institutionName: 'Bhopal Institute of Technology & Science',
        programme: 'BCA / B.Sc',
        seats: 80,
        year: 2023,
        affiliationType: 'Permanent',
        address: 'Chetak Bridge, Bhopal MP',
      },
    ],

    // Step 3
    courses: [
      {
        courseName: 'B.Tech (Computer Science & Engineering)',
        seats: 60,
        class: 20,
        academicYear: '2026-27',
        type: 'New Affiliation',
        status: 'Complete',
        conditions:
          'Subject to approval of AICTE & appointment of regular cadre faculty',
      },
      {
        courseName: 'Master of Technology (M.Tech)',
        seats: 20,
        class: 20,
        academicYear: '2026-27',
        type: 'New Affiliation',
        status: 'Complete',
        conditions:
          'Subject to setting up advanced research lab & library PG titles',
      },
    ],

    // Step 4
    landType: 'Self Owned (Registry Registered)',
    buildingType: 'Pucca RCC Multi-storey Campus',
    landTotalArea: '5.25 Acres',
    totalBuildingArea: '35,000 Sq.Ft',
    buildingBuiltUpArea: '30,000 Sq.Ft',
    qualityOfBuilding: 'First Class Construction with Modern Facilities',
    landNormsFulfilled: 'Yes (Fulfills AICTE & UGC Norms)',
    accommodationDetails:
      '24 Classrooms, 6 Labs, Admin Block, Staff Rooms & Seminar Hall',
    sharedCampus: 'No (Independent Exclusive Campus)',
    sharedCampusArea: '0 Sq.Ft',
    latitudeLongitude: '23.269600 / 77.388200',
    documents: {
      landDocument: 'Land_Title_Registry_Doc.pdf',
      otherLandDocument: 'Nazul_NOC_Document.pdf',
      buildingDocument: 'Building_Completion_Cert.pdf',
      otherBuildingDocument: 'Structural_Safety_Certificate.pdf',
      buildingMap: 'Sanctioned_Architect_Map.pdf',
      buildingPlanSafety: 'Fire_Safety_Evacuation_Plan.pdf',
      councilApprovals: 'AICTE_Approval_Order_2026.pdf',
    },

    // Step 5
    totalClassrooms: 24,
    classroomsAsPerNorms: 'Yes (Well-ventilated with AV Projectors)',
    accessibleToPublic: 'Yes (Wide Entrance & Paved Approach Road)',
    libraryBuildingAvailable: 'Yes (Air-Conditioned Central Library)',
    totalBooks: 8500,
    readingRoomAvailable: 'Yes (120 Student Seating Capacity)',

    // Step 6: Computers & Equipment
    latestComputers: 80,
    workingComputers: 76,
    internetAvailability: 'Available (100 Mbps High-Speed Leased Line)',
    printersScanners: '6 Heavy-Duty Printers / 4 Scanners',
    computerStudentRatio: '1:8 (Exceeds Norms)',
    computerTrainedStaff: '4 Full-time Lab Technicians',
    studentDesksBenches: '450 Dual Desks / Benches',
    tablesChairs: '120 Faculty Tables / 250 Chairs',
    boardAvailable: 'Yes (Interactive Smart Boards & Green Boards)',

    // Step 7: Teaching & Non-Teaching Staff
    staff: [
      {
        name: 'Dr. Anand K. Mishra',
        role: 'Professor & HOD',
        qualification: 'Ph.D. Computer Science',
        department: 'Computer Science',
        experience: '15 Years',
        mobileNumber: '9826011442',
      },
      {
        name: 'Dr. Rashmi Tiwari',
        role: 'Associate Professor',
        qualification: 'Ph.D. Information Technology',
        department: 'Computer Science',
        experience: '10 Years',
        mobileNumber: '9893022553',
      },
      {
        name: 'Prof. Sandeep Patel',
        role: 'Assistant Professor',
        qualification: 'M.Tech (CSE), NET Qualified',
        department: 'Computer Science',
        experience: '6 Years',
        mobileNumber: '9425033664',
      },
      {
        name: 'Mr. Dinesh Verma',
        role: 'Senior Technical Assistant',
        qualification: 'BCA, Hardware Diploma',
        department: 'IT / Lab Maintenance',
        experience: '8 Years',
        mobileNumber: '9755044775',
      },
    ],

    // Step 8: Compliance
    annualProjectedIncome: '₹ 1.45 Crores',
    sourceOfFunding: 'Trust Corpus Fund & Tuition Fees',
    regularBooksMaintained: 'Yes (Audited Annually)',
    accountsAudited: 'Yes (Statutory CA Audit Complete for 2025-26)',
    mpGovtPermission: 'Granted (Order No. HE/2026/1042)',
    sessionPermissionGranted: 'Granted for Academic Session 2026-27',
    statutoryConditions: 'All Statutory Guidelines Satisfied',
    stateGovtConditions: 'Complied as per Higher Education Norms',
    statuteFulfilled: 'Yes (Statute 28 Governing Body Constituted)',
    statutoryNormsAdhered: 'Yes (All AICTE & UGC Norms Met)',
    feeStructureAdhered: 'Yes (AFRC Approved Fee Matrix Applied)',
    reservationNormsFollowed: 'Yes (State Government Roster Implemented)',

    // Step 9: Others
    parkingSpace: 'Yes (Dedicated Parking for 80 Two-Wheelers & 30 Cars)',
    firstAidFacility: 'Yes (Medical First-Aid Room with Essential Kits)',
    drinkingWater: 'Yes (Commercial RO Purification Plant with Coolers)',
    cctvSurveillance: 'Yes (24 HD CCTV Cameras Active & Monitored)',
    transportFacility: 'Yes (2 College Buses Operational for Students)',
    safetyGuards: 'Yes (24x7 Uniformed Security Guards at Campus Gate)',
    fireSafety: 'Yes (ISI Certified Fire Extinguishers & Smoke Detectors)',
    medicalAttendant: 'Yes (On-call Doctor & Full-time Qualified Nurse)',
    rampLiftFacility: 'Yes (Wheelchair Ramps & Tactile Paths Available)',

    // Step 10: Signature & Declaration
    principalSignatory: 'Dr. R. K. Shrivastava',
    dateOfCertification: '28-09-2026',
    declarationStatus: 'Yes (Verified & Complied)',
    principalSignature: 'Verified (Signed Digitally)',
    managementSignature: 'Verified (Signed Digitally)',
  },

  // Science College Bhopal - PAL260557224
  PAL260557224: {
    collegeName: 'Science College Bhopal',
    applicationNumber: 'PAL260557224',
    verifiedDate: '25-09-2026',
    inspectionStatus: 'Assigned',
    inspectionScheduledDate: '28/10/2026',
    inspectionOrderDocName: 'Inspection_Order_PAL260557224.pdf',
    inspectionTeam: [
      {
        id: 1,
        name: 'Dr. Vivek Sharma',
        designation: 'Professor',
        department: 'Physics',
        mobileNumber: '9826011223',
      },
      {
        id: 2,
        name: 'Dr. Neeta Verma',
        designation: 'Associate Professor',
        department: 'Chemistry',
        mobileNumber: '9425033445',
      },
      {
        id: 3,
        name: 'Prof. S. K. Jain',
        designation: 'Professor',
        department: 'Mathematics',
        mobileNumber: '9893055667',
      },
      {
        id: 4,
        name: 'Dr. Arvind Sen',
        designation: 'HOD',
        department: 'Botany',
        mobileNumber: '9755077889',
      },
    ],

    // Step 1
    collegeType: 'Private Aided',
    collegeEmail: 'sciencecollegebhopal@gmail.com',
    principalName: 'Dr. H. P. Trivedi',
    principalMobileNumber: '9827012345',
    principalEmailId: 'principal.scbhopal@gmail.com',
    state: 'MADHYA PRADESH',
    district: 'BHOPAL',
    blockTehsil: 'Huzur',
    pinCode: '462003',
    collegeAddress: 'Hoshangabad Road, Near Habibganj, Bhopal–462003, MP',

    // Step 2
    ownershipEntityName: 'Bhopal Educational Development Society',
    chairmanName: 'Shri Rameshwar Dayal',
    chairmanQualification: 'Post Graduate (M.Sc.)',
    chairmanMobile: '9425012389',
    executiveName: 'Smt. Sarita Dayal',
    executiveMobile: '9425012390',
    ownershipDocument: 'Trust_Deed_Registration_SCB.pdf',
    governingBodyMembers: [
      {
        memberName: 'Dr. R. K. Saxena',
        qualification: 'Ph.D. Physics',
        age: 58,
        mobileNumber: '9826033441',
        address: 'Arera Colony, Bhopal',
      },
      {
        memberName: 'Shri Manoj Agrawal',
        qualification: 'Chartered Accountant',
        age: 49,
        mobileNumber: '9893044552',
        address: 'MP Nagar, Bhopal',
      },
    ],
    additionalInstitutions: [
      {
        institutionName: 'Bhopal Institute of Management',
        programme: 'MBA',
        seats: 120,
        year: 2021,
        affiliationType: 'Permanent',
        address: 'Bhopal, MP',
      },
    ],

    // Step 3
    courses: [
      {
        courseName: 'B.Sc. (Computer Science)',
        seats: 120,
        class: 3,
        academicYear: '2026-27',
        type: 'Permanent Affiliation',
        status: 'Complete',
        conditions: 'Subject to annual lab audit',
      },
      {
        courseName: 'M.Sc. (Chemistry)',
        seats: 40,
        class: 2,
        academicYear: '2026-27',
        type: 'New Affiliation',
        status: 'Complete',
        conditions:
          'Subject to certified chemical fume hood & lab safety norms',
      },
    ],

    // Step 4
    landType: 'Self Owned',
    buildingType: 'RCC Multi-storey',
    landTotalArea: '5.5 Acres',
    totalBuildingArea: '45,000 Sq.Ft',
    buildingBuiltUpArea: '38,000 Sq.Ft',
    qualityOfBuilding: 'First Class RCC Construction with Modern Amenities',
    landNormsFulfilled: 'Yes',
    accommodationDetails:
      '30 classrooms, 6 laboratories, auditorium, seminar halls and faculty rooms',
    sharedCampus: 'no',
    sharedCampusArea: '0',
    latitudeLongitude: '23.233200 / 77.434300',
    documents: {
      landDocument: 'Land_Registry_Habibganj.pdf',
      otherLandDocument: 'Nazul_Clearance_2026.pdf',
      buildingDocument: 'Municipal_Corporation_Bhopal_Permit.pdf',
      otherBuildingDocument: 'Structural_Audit_Report.pdf',
      buildingMap: 'Approved_Blue_Print_2025.pdf',
      buildingPlanSafety: 'Fire_NOC_Valid_2027.pdf',
      councilApprovals: 'UGC_Section_2f_12b_Approval.pdf',
    },

    // Step 5
    totalClassrooms: 30,
    classroomsAsPerNorms: 'Yes',
    accessibleToPublic: 'Yes',
    libraryBuildingAvailable: 'Yes',
    totalBooks: 18500,
    readingRoomAvailable: 'Yes',

    // Step 6: Computers & Equipment
    latestComputers: 60,
    workingComputers: 58,
    internetAvailability: 'Available (100 Mbps Leased Line)',
    printersScanners: '6 Printers / 3 Scanners',
    computerStudentRatio: '1:10',
    computerTrainedStaff: '4 Staff Members',
    studentDesksBenches: '600 Desks / 600 Benches',
    tablesChairs: '150 Tables / 300 Chairs',
    boardAvailable: 'Yes (Smart Interactive Boards)',

    // Step 7: Teaching & Non-Teaching Staff
    staff: [
      {
        name: 'Dr. Vivek Sharma',
        role: 'Professor & HOD',
        qualification: 'Ph.D. Physics',
        department: 'Physics',
        experience: '18 Years',
        mobileNumber: '9826011223',
      },
      {
        name: 'Dr. Neeta Verma',
        role: 'Associate Professor',
        qualification: 'Ph.D. Chemistry',
        department: 'Chemistry',
        experience: '12 Years',
        mobileNumber: '9425033445',
      },
    ],

    // Step 8: Compliance
    annualProjectedIncome: '₹ 1.80 Crores',
    sourceOfFunding: 'State Aid & Fee Receipts',
    regularBooksMaintained: 'Yes',
    accountsAudited: 'Yes',
    mpGovtPermission: 'Yes (Order No. HE/2026/894)',
    sessionPermissionGranted: 'Granted for 2026-27',
    statutoryConditions: 'Complied fully',
    stateGovtConditions: 'Complied',
    statuteFulfilled: 'Yes',
    statutoryNormsAdhered: 'Yes',
    feeStructureAdhered: 'Yes',
    reservationNormsFollowed: 'Yes',

    // Step 9: Others
    parkingSpace: 'Yes (Dedicated Parking for 100 Vehicles)',
    firstAidFacility: 'Yes',
    drinkingWater: 'Yes (RO Purifiers Installed)',
    cctvSurveillance: 'Yes (24 CCTV Cameras Active)',
    transportFacility: 'Yes (2 College Buses)',
    safetyGuards: 'Yes (24x7 Security Guards)',
    fireSafety: 'Yes (Fire Extinguishers & Alarm Fitted)',
    medicalAttendant: 'Yes (Visiting Doctor & Nurse)',
    rampLiftFacility: 'Yes (Ramps & Elevators Available)',

    // Step 10: Signature & Declaration
    principalSignatory: 'Dr. H. P. Trivedi',
    dateOfCertification: '24-09-2026',
    declarationStatus: 'Yes',
    principalSignature: 'Verified (Signed Digitally)',
    managementSignature: 'Verified (Signed Digitally)',
  },
};

/**
 * Returns college profile data matching the application number or college name,
 * falling back gracefully to realistic detailed data.
 */
export function getCollegeProfileData(
  applicationNo: string,
  collegeName: string
): CollegeProfileDetails {
  if (DUMMY_COLLEGE_PROFILES[applicationNo]) {
    return DUMMY_COLLEGE_PROFILES[applicationNo];
  }

  // Fallback template configured with provided college name & application number
  const base = DUMMY_COLLEGE_PROFILES['NCE260740649'];
  return {
    ...base,
    collegeName: collegeName || base.collegeName,
    applicationNumber: applicationNo || base.applicationNumber,
    collegeEmail: `contact@${(collegeName || 'college').toLowerCase().replace(/\s+/g, '')}.edu.in`,
  };
}

export const INITIAL_MEETINGS = [
  {
    id: 1,
    collegeId: 101,
    collegeName: 'Bhopal Science',
    applicationNo: 'NCE260740649',
    meetingDate: new Date('2026-10-28'),
    membersAvailable:
      'Dr. Rajiv Ranjan, Dr. Meenakshi Sundaram, Prof. Alok Verma, Dr. Deepak Joshi',
    meetingStatus: 'Scheduled',
    remarks:
      'Review physical inspection report, laboratory facilities, and land registry documents before final decision.',
  },
  {
    id: 2,
    collegeId: 102,
    collegeName: 'Science College Bhopal',
    applicationNo: 'PAL260557224',
    meetingDate: new Date('2026-10-14'),
    membersAvailable: 'Dr. Vivek Sharma, Dr. Neeta Verma, Prof. S. K. Jain',
    meetingStatus: 'Scheduled',
    remarks:
      'Scrutiny of teacher-student ratio, library books inventory, and fire safety NOC compliance.',
  },
  {
    id: 3,
    collegeId: 102,
    collegeName: 'Science College Bhopal',
    applicationNo: 'PAL260557224',
    meetingDate: new Date('2026-10-01'),
    membersAvailable: 'Dr. Vivek Sharma, Dr. Arvind Sen, Prof. L. Verma',
    meetingStatus: 'Scheduled',
    remarks:
      'Preliminary hearing conducted. College directed to submit updated governing body affidavit.',
  },
  {
    id: 4,
    collegeId: 1,
    collegeName: 'Global Institute of Technology',
    applicationNo: 'APP-74921',
    meetingDate: new Date('2026-08-15'),
    membersAvailable: 'Dr. R. K. Sen, Dr. A. Sharma, Prof. K. Singh',
    meetingStatus: 'Scheduled',
    remarks:
      'Committee will verify classroom counts, building security parameters, and hostel capacity certificates.',
  },
  {
    id: 5,
    collegeId: 2,
    collegeName: 'National Science College',
    applicationNo: 'APP-18239',
    meetingDate: new Date('2026-08-10'),
    membersAvailable: 'Dr. R. K. Sen, Prof. L. Verma',
    meetingStatus: 'Completed',
    remarks:
      'Discussed land ownership titles. Resolved to seek clarified affidavit documents in next hearing.',
  },
];

export const DUMMY_COLLEGES = [
  { id: 101, name: 'Bhopal Science', applicationNo: 'NCE260740649' },
  { id: 102, name: 'Science College Bhopal', applicationNo: 'PAL260557224' },
  { id: 1, name: 'Global Institute of Technology', applicationNo: 'APP-74921' },
  { id: 2, name: 'National Science College', applicationNo: 'APP-18239' },
  { id: 3, name: 'Sunrise Commerce Academy', applicationNo: 'APP-90234' },
  { id: 4, name: 'Pioneer Engineering College', applicationNo: 'APP-48231' },
  { id: 5, name: 'Govt Engineering College', applicationNo: 'APP-33921' },
];
