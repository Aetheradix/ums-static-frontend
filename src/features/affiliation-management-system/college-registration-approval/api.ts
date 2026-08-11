let mockApprovals: AffiliationManagementSystem.CollegeRegistrationApprovalItem[] =
  [
    {
      collegeRegistrationId: 101,
      collegeName: 'Global Institute of Technology',
      collegeCategoryId: 1,
      applicationNumber: 'APP-92837',
      createdOn: '2026-06-20T10:30:00Z',
      approvalStatus: 1, // Pending
      collegeTypeId: 1,
      collegeArea: 'Urban',
      isActive: true,
    },
    {
      collegeRegistrationId: 102,
      collegeName: 'National College of Arts',
      collegeCategoryId: 4,
      applicationNumber: 'APP-54129',
      createdOn: '2026-06-21T14:15:00Z',
      approvalStatus: 2, // Approved
      collegeTypeId: 1,
      collegeArea: 'Urban',
      isActive: true,
    },
    {
      collegeRegistrationId: 103,
      collegeName: 'Sunrise Medical College',
      collegeCategoryId: 2,
      applicationNumber: 'APP-76342',
      createdOn: '2026-06-22T09:45:00Z',
      approvalStatus: 3, // Rejected
      rejectionReason: 'Incomplete documents provided for land ownership.',
      collegeTypeId: 1,
      collegeArea: 'Urban',
      isActive: true,
    },
    {
      collegeRegistrationId: 104,
      collegeName: 'Apex Business School',
      collegeCategoryId: 3,
      applicationNumber: 'APP-22984',
      createdOn: '2026-06-24T11:20:00Z',
      approvalStatus: 1, // Pending
      collegeTypeId: 1,
      collegeArea: 'Urban',
      isActive: true,
    },
    {
      collegeRegistrationId: 105,
      collegeName: 'Pioneer College of Education',
      collegeCategoryId: 5,
      applicationNumber: 'APP-88432',
      createdOn: '2026-06-25T08:10:00Z',
      approvalStatus: 1, // Pending
      collegeTypeId: 1,
      collegeArea: 'Urban',
      isActive: true,
    },
  ];

export async function getCollegeRegistrationApprovals() {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
  return mockApprovals;
}

export async function getCollegeRegistrationById(id: number) {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

  const approvalItem = mockApprovals.find(a => a.collegeRegistrationId === id);

  return {
    data: {
      registrationId: Number(id) || 0,
      collegeName: approvalItem?.collegeName || 'Unknown College',
      applicationNumber: approvalItem?.applicationNumber || 'APP-000',
      status: approvalItem?.approvalStatus || 1,
      collegeTypeId: approvalItem?.collegeTypeId || 2, // Default to Private
      collegeEmail:
        'admin@' +
        (approvalItem?.collegeName.toLowerCase().replace(/\s/g, '') ||
          'college') +
        '.edu.in',
      collegeAddress: '123 University Road, Bhopal, MP',
      districtName: 'Bhopal',
      blockTehsil: 'Huzur',
      pinCode: '462001',

      // Principal / Affiliation Details
      principalDirectorName: 'Dr. Ramesh Kumar',
      principalMobileNo: '9876543210',
      principalEmail: 'principal@college.edu.in',

      // Ownership & Management
      ownershipEntityName: 'Education Foundation Trust',
      chairmanName: 'Mr. Arvind Singh',
      chairmanFathersName: 'Late Sh. Ram Singh',
      chairmanAge: '52',
      chairmanQualification: 'Post Graduate',
      chairmanMobileNumber: '9826012345',
      chairmanOccupationAddress: 'Tech Tower, Scheme 54, Indore, MP',

      executiveName: 'Mrs. Neha Singh',
      executiveAge: '48',
      executiveQualification: 'Graduate',
      executiveMobileNumber: '9826054321',
      executiveOccupationAddress: 'Tech Tower, Scheme 54, Indore, MP',

      governingBodyMembers: [
        {
          memberName: 'Dr. S. K. Gupta',
          fathersName: 'Mr. R. C. Gupta',
          age: '58',
          qualification: 'Ph.D.',
          mobileNumber: '9425011223',
          occupationAddress: 'Indore',
        },
        {
          memberName: 'Prof. Anil Sharma',
          fathersName: 'Mr. M. P. Sharma',
          age: '45',
          qualification: 'Post Graduate',
          mobileNumber: '9893012345',
          occupationAddress: 'Bhopal',
        },
      ],

      // Academics & Ecosystem
      existingCourses: [
        {
          courseName: 'Bachelor of Computer Applications (BCA)',
          seats: '60',
          class: '1st Year',
          year: '2025',
          type: 'Regular',
          conditions: 'NIL',
          statusOfCompliance: 'Complied',
        },
        {
          courseName: 'Bachelor of Business Administration (BBA)',
          seats: '60',
          class: '1st Year',
          year: '2025',
          type: 'Regular',
          conditions: 'NIL',
          statusOfCompliance: 'Complied',
        },
      ],

      teachingStaff: [
        {
          name: 'Mr. Rajesh Joshi',
          role: 'Assistant Professor',
          status: 'Full Time',
          qualification: 'MCA, M.Tech',
          experience: '8 Years',
        },
        {
          name: 'Dr. Preeti Mishra',
          role: 'Associate Professor',
          status: 'Full Time',
          qualification: 'Ph.D. in Computer Science',
          experience: '12 Years',
        },
      ],

      additionalInstitutions: [
        {
          institutionName: 'Pioneer International School',
          address: 'Airport Road, Indore',
          course: 'Primary/Secondary Education',
          seats: '500',
          class: 'N/A',
          year: '2015',
          type: 'Regular',
          conditions: 'N/A',
          statusOfCompliance: 'Complied',
        },
      ],

      // Infrastructure & Facilities
      totalArea: '5.2 Acres',
      isRentedBuilding: 'Owned',
      provisionToConstruct: 'Yes',
      qualityOfBuilding: 'Excellent (CC Construction)',
      requiredClassrooms: '12 Classrooms',
      accessibleToPublic: 'Yes',
      classroomDetails:
        'All classrooms are ventilated, equipped with smart projectors and green boards.',
      parkingSpace: 'Available (capacity of 50 cars, 150 two-wheelers)',
      neighbourComplaints: 'No',
      neighbourComplaintsRemarks: 'No complaints received from surroundings.',
      sharedCampus: 'No',

      libraryBooksCount: '5200 Books',
      bookStudentRatio: '1:10',
      libraryBuildingAvailable: 'Yes',
      readingRoomAvailable: 'Yes',
      readingRoomDimensions: '1200 Sq. Ft.',
      libraryStaffAvailable: 'Yes',
      booksIssuedRegularly: 'Yes',
      booksRelevant: 'Yes',
      journalsSubscribed: 'Yes',
      journalsCount: '15 Journals',
      latestJournalIssues: 'Yes',

      laboratoryRequired: 'Yes',
      labFloorSpace: '2400 Sq. Ft.',
      labExclusive: 'Yes',
      lightAirConditions: 'Good',
      labEquipmentDetails:
        'Equipped with 60 high-end computers, LAN connectivity, and server setup.',
      workshopDetails: 'N/A',
      hospitalAvailability: 'Tie-up with local hospital for emergency',

      sportsFacilityAvailable: 'Yes',
      adequateForStudents: 'Yes',
      outdoorGamesFacility: 'Cricket, Volleyball, Basketball',
      outdoorFacilitiesInUse: 'Yes',
      sportsConsumablesProvided: 'Yes',
      medicalAttendantAvailable: 'Yes',
      emergencyMedicineStock: 'Yes',
      firstAidFacility: 'Yes',

      hostelAvailable: 'Yes',
      typeOfHostel: 'Separate Boys & Girls Hostels',
      accommodationAvailability: 'Yes',
      boysHostelsCount: '1',
      girlsHostelsCount: '1',
      totalHostelCapacity: '150 Seats',

      // Compliance
      sourceOfFunding: 'Trust Corpus Funds & Tuition Fees',
      annualProjectedIncome: '₹ 1.2 Crores',
      regularBooksMaintained: 'Yes (Audited annually)',
      accountsAudited: 'Yes',
      statutoryConditions: 'Met all statutory guidelines',
      sessionPermissionGranted: 'Yes',
      mpGovtPermission: 'Granted via Order No. MP-4829-EDU',
      mpGovtConditions: 'NIL',
      statute28Fulfilled: 'Yes (Governing body constituted)',
      endowmentFundDetails: '₹ 15 Lakhs deposited in Joint Account',
      statutoryNormsAdhered: 'Yes',
      reservationNormsFollowed: 'Yes',
      statutoryNormsRemarks: 'Fully compliant.',

      // Documents List (indicators)
      nocDocument: 'NOC-Approved-2026.pdf',
      councilApprovalsDocument: 'AICTE-Approval-2026.pdf',
      societyRegistrationDocument: 'Trust-Reg-Certificate.pdf',
      landDocumentsDocument: 'Registry-Khasra.pdf',
      buildingPlanAndSafetyDocument: 'Building-Safety-Cert.pdf',
      amenitiesProofDocument: 'Fire-Safety-Water-Cert.pdf',
      photoOfCollegeBuilding: 'Building-Front-View.jpg',
      buildingMap: 'Approved-Architect-Map.pdf',
    } as any,
  };
}

export async function updateCollegeRegistrationApprovalStatus(
  id: number,
  status: number,
  rejectionReason?: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

  mockApprovals = mockApprovals.map(approval => {
    if (approval.collegeRegistrationId === id) {
      return {
        ...approval,
        approvalStatus: status,
        rejectionReason: status === 3 ? rejectionReason : undefined,
      };
    }
    return approval;
  });

  return true;
}
