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

  // Return a rich preview object containing data from the mock list + dummy detailed fields
  return {
    data: {
      registrationId: Number(id) || 0,
      collegeName: approvalItem?.collegeName || 'Unknown College',
      applicationNumber: approvalItem?.applicationNumber || 'APP-000',
      status: approvalItem?.approvalStatus || 1,
      collegeCode: 'COL' + id,
      establishmentYearId: '2005',
      districtName: 'Bhopal',
      collegeAddress: '123 University Road, Bhopal, MP',
      telephoneNo: '0755-2123456',
      collegeEmail:
        'admin@' +
        (approvalItem?.collegeName.toLowerCase().replace(/\s/g, '') ||
          'college') +
        '.edu.in',
      collegeCategoryId: approvalItem?.collegeCategoryId || 1,
      collegeTypeId: 'Co-Ed',
      collegeArea: 'Urban',
      accommodationType: 'Boys & Girls',
      numberOfClassRooms: 24,
      deficiencyEarlierRaisedByCommittee: false,
      availableFacilities: ['Library', 'Cafeteria', 'Computer Lab'],
      otherDetail: {
        principalDirectorName: 'Dr. Ramesh Kumar',
        principalMobileNo: '9876543210',
        principalEmail: 'principal@college.edu.in',
        societyName: 'Education Foundation Society',
        secretaryName: 'Mr. Arvind Singh',
        societyRegistrationNo: 'SOC/4521/1998',
        societyRegistrationDate: '1998-05-15T00:00:00Z',
        isOtherInstitutionRunning: true,
      },
      courseDetails: [
        {
          collegeCourseDetailId: 1,
          programmeFeesMappingId: 101,
          totalAmount: 25000,
          isFeePaid: true,
        },
        {
          collegeCourseDetailId: 2,
          programmeFeesMappingId: 102,
          totalAmount: 18000,
          isFeePaid: true,
        },
      ],
      documents: [
        {
          collegeAffiliationDocumentId: 1,
          documentType: 'NOC Document',
          documentId: 'DOC-NOC-123',
        },
        {
          collegeAffiliationDocumentId: 2,
          documentType: 'Affidavit',
          documentId: 'DOC-AFF-456',
        },
      ],
    } as unknown as AffiliationManagementSystem.CollegeRegistrationPreview,
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
