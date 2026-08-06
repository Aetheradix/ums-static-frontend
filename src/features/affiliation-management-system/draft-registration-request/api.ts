export async function getDraftRegistration(
  applicationNumber: string,
  establishmentYear: number
) {
  return {
    applicationNumber,
    establishmentYear,
    affiliationTypeId: 1,
    collegeName: 'Mock College for Static Flow',
    collegeEmail: 'mock@college.edu',
    collegeCode: 'MCK001',
    collegeAddress: '123 Mock Street',
    stateId: 1,
    districtId: 1,
    telephoneNo: '1234567890',
    collegeCategoryId: 1,
    collegeTypeId: 1,
    accommodationType: '1',
    collegeArea: 1,
    availableFacilities: [1, 2],
    isSubmitted: false,
    affiliation: {
      principalDirectorName: 'John Doe',
      principalMobileNo: '0987654321',
      principalEmail: 'principal@mock.edu',
      societyName: 'Mock Society',
      secretaryName: 'Jane Doe',
      societyRegistrationNo: 'SOC123',
      societyRegistrationDate: new Date().toISOString(),
      isOtherInstitutionRunning: false,
    },
  } as unknown as AffiliationManagementSystem.DraftRegistrationRequest;
}
