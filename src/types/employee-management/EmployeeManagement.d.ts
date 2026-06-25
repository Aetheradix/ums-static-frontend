declare namespace EmployeeManagement {
  interface QuickOnboardingBase {
    employeeType: string;
    seniorityRank: string;
    salutation: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    casteId: number;
    mobileNumber: string;
    officialEmail: string;
    dateOfBirth: Date;
    employeeCode: string;
  }

  interface QuickOnboardingForm extends QuickOnboardingBase {
    employeeNatureId: number;
    organizationUnitId: number;
    postId: number;
    designationId: number;
    subjectSpecializationId: number;
  }

  interface QuickOnboardingItem extends QuickOnboardingBase {
    employeeId: number;
    fullName: string;
    employeeNature: string;
    organizationUnit: string;
    post: string;
    subjectSpecialization: string;
    isActive: boolean;
  }

  // ── Full Onboarding Types ──

  interface AddressForm {
    addressType: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateId: number;
    divisionId: number;
    districtId: number;
    tehsilId: number;
    blockId: number;
    pinCode: string;
  }

  interface QualificationForm {
    qualificationId: number;
    university: string;
    board: string;
    yearOfPassing: number;
    percentage: number;
    grade: string;
  }

  interface FullOnboardingBase {
    // Quick Core fields
    employeeType: string;
    seniorityRank: string;
    salutation: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    casteId: number;
    mobileNumber: string;
    officialEmail: string;
    dateOfBirth: Date;
    employeeCode: string;
    dateOfJoining: Date;

    // Extended Personal & Statutory
    bloodGroup: string;
    maritalStatus: string;
    isPersonWithDisability: boolean;
    fatherName: string;
    motherName: string;
    personalEmail: string;
    alternateMobileNumber: string;
    officePhoneNumber: string;
    emergencyContactName: string;
    emergencyRelation: string;
    emergencyPhoneNumber: string;
    personalWebsite: string;
    bioNote: string;
    aadharNumber: string;
    panNumber: string;
    uanNumber: string;
    drivingLicense: string;
    passportNumber: string;
    passportValidity: Date;
  }

  interface FullOnboardingForm extends FullOnboardingBase {
    employeeId?: number;
    employeeNatureId: number;
    organizationUnitId: number;
    postId: number;
    designationId: number;
    subjectSpecializationId: number;
    nationalityId: number;
    religionId: number;
    qualificationLevelId: number;
    qualifications: QualificationForm[];
    currentAddress: AddressForm;
    permanentAddress: AddressForm;
    isSameAsCurrentAddress: boolean;
  }

  interface FullOnboardingItem extends FullOnboardingBase {
    employeeId: number;
    fullName: string;
    employeeNatureName: string;
    organizationUnitName: string;
    postName: string;
    designationName: string;
    subjectSpecializationName: string;
    nationalityName: string;
    religionName: string;
    qualificationLevelName: string;
    isActive: boolean;
  }
}
