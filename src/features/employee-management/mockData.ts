export const mockDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const mockEmployees: any[] = [
  {
    employeeId: 1,
    employeeCode: 'EMP-001',
    salutation: 'Dr.',
    firstName: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    fullName: 'Dr. John A. Doe',
    gender: 'Male',
    employeeNature: 'Permanent',
    organizationUnit: 'Computer Science',
    post: 'Professor',
    subjectSpecialization: 'Artificial Intelligence',
    officialEmail: 'john.doe@university.edu',
    mobileNumber: '9876543210',
    dateOfBirth: '1980-05-15',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    onboardingType: 'Quick Onboarding',
    bankName: 'State Bank of India',
    accountNumber: '100020003000',
    ifscCode: 'SBIN0001234',
    branchName: 'Main Campus Branch',
    accountHolderName: 'John Doe',
    accountType: 'Savings',
  },
  {
    employeeId: 2,
    employeeCode: 'EMP-002',
    salutation: 'Prof.',
    firstName: 'Jane',
    middleName: '',
    lastName: 'Smith',
    fullName: 'Prof. Jane Smith',
    gender: 'Female',
    employeeNature: 'Contract',
    organizationUnit: 'Physics',
    post: 'Associate Professor',
    subjectSpecialization: 'Quantum Mechanics',
    officialEmail: 'jane.smith@university.edu',
    mobileNumber: '9876543211',
    dateOfBirth: '1985-08-22',
    bloodGroup: 'A+',
    maritalStatus: 'Single',
    onboardingType: 'Full Onboarding',
    bankName: 'HDFC Bank',
    accountNumber: '500060007000',
    ifscCode: 'HDFC0004567',
    branchName: 'City Center Branch',
    accountHolderName: 'Jane Smith',
    accountType: 'Savings',
  },
  {
    employeeId: 3,
    employeeCode: 'EMP-003',
    salutation: 'Mr.',
    firstName: 'Alice',
    middleName: 'R.',
    lastName: 'Johnson',
    fullName: 'Mr. Alice R. Johnson',
    gender: 'Other',
    employeeNature: 'Ad-hoc',
    organizationUnit: 'Administration',
    post: 'Clerk',
    subjectSpecialization: 'Financial Accounting',
    officialEmail: 'alice.j@university.edu',
    mobileNumber: '9123456789',
    dateOfBirth: '1990-11-05',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    onboardingType: 'Quick Onboarding',
  },
  {
    employeeId: 4,
    employeeCode: 'EMP-004',
    salutation: 'Dr.',
    firstName: 'Bob',
    middleName: '',
    lastName: 'Williams',
    fullName: 'Dr. Bob Williams',
    gender: 'Male',
    employeeNature: 'Permanent',
    organizationUnit: 'Physics',
    post: 'Professor',
    subjectSpecialization: 'Quantum Mechanics',
    officialEmail: 'bob.w@university.edu',
    mobileNumber: '9988776655',
    dateOfBirth: '1975-03-12',
    bloodGroup: 'AB+',
    maritalStatus: 'Married',
    onboardingType: 'Full Onboarding',
  },
  {
    employeeId: 5,
    employeeCode: 'EMP-005',
    salutation: 'Ms.',
    firstName: 'Charlie',
    middleName: 'M.',
    lastName: 'Brown',
    fullName: 'Ms. Charlie M. Brown',
    gender: 'Female',
    employeeNature: 'Contract',
    organizationUnit: 'Computer Science',
    post: 'Assistant Professor',
    subjectSpecialization: 'Artificial Intelligence',
    officialEmail: 'charlie.b@university.edu',
    mobileNumber: '9876501234',
    dateOfBirth: '1992-07-19',
    bloodGroup: 'O+',
    maritalStatus: 'Divorced',
    onboardingType: 'Full Onboarding',
  },
  {
    employeeId: 6,
    employeeCode: 'EMP-006',
    salutation: 'Prof.',
    firstName: 'David',
    middleName: '',
    lastName: 'Davis',
    fullName: 'Prof. David Davis',
    gender: 'Male',
    employeeNature: 'Permanent',
    organizationUnit: 'Administration',
    post: 'Dean',
    subjectSpecialization: 'Financial Accounting',
    officialEmail: 'david.d@university.edu',
    mobileNumber: '9871122334',
    dateOfBirth: '1965-12-01',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    onboardingType: 'Quick Onboarding',
  },
  {
    employeeId: 7,
    employeeCode: 'EMP-007',
    salutation: 'Dr.',
    firstName: 'Eve',
    middleName: 'L.',
    lastName: 'Miller',
    fullName: 'Dr. Eve L. Miller',
    gender: 'Female',
    employeeNature: 'Contract',
    organizationUnit: 'Physics',
    post: 'Assistant Professor',
    subjectSpecialization: 'Quantum Mechanics',
    officialEmail: 'eve.m@university.edu',
    mobileNumber: '9122334455',
    dateOfBirth: '1988-09-30',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    onboardingType: 'Full Onboarding',
  },
];

export const mockSalutations = [
  { id: 'Mr.', name: 'Mr.' },
  { id: 'Ms.', name: 'Ms.' },
  { id: 'Dr.', name: 'Dr.' },
  { id: 'Prof.', name: 'Prof.' },
];

export const mockGenders = [
  { id: 'Male', name: 'Male' },
  { id: 'Female', name: 'Female' },
  { id: 'Other', name: 'Other' },
];

export const mockCastes = [
  { id: 1, name: 'General' },
  { id: 2, name: 'OBC' },
  { id: 3, name: 'SC' },
  { id: 4, name: 'ST' },
];

export const mockNatureOfEmployment = [
  { id: 1, name: 'Permanent' },
  { id: 2, name: 'Contract' },
  { id: 3, name: 'Ad-hoc' },
];

export const mockOrgUnits = [
  { id: 1, name: 'Computer Science Dept' },
  { id: 2, name: 'Physics Dept' },
  { id: 3, name: 'Administration' },
];

export const mockPosts = [
  { id: 1, name: 'Professor' },
  { id: 2, name: 'Associate Professor' },
  { id: 3, name: 'Assistant Professor' },
];

export const mockDesignations = [
  { id: 1, name: 'Head of Department' },
  { id: 2, name: 'Dean' },
  { id: 3, name: 'Faculty' },
];

export const mockServiceCadres = [
  { id: 'Teaching', name: 'Teaching' },
  { id: 'Non-Teaching', name: 'Non-Teaching' },
];

export const mockSpecializations = [
  { id: 1, name: 'Artificial Intelligence' },
  { id: 2, name: 'Quantum Mechanics' },
];

export const mockBloodGroups = [
  { id: 'A+', name: 'A+' },
  { id: 'O+', name: 'O+' },
  { id: 'B+', name: 'B+' },
  { id: 'AB+', name: 'AB+' },
];

export const mockMaritalStatus = [
  { id: 'Single', name: 'Single' },
  { id: 'Married', name: 'Married' },
  { id: 'Divorced', name: 'Divorced' },
];

export const mockNationalities = [
  { id: 1, name: 'Indian' },
  { id: 2, name: 'NRI' },
  { id: 3, name: 'Foreign National' },
];

export const mockReligions = [
  { id: 1, name: 'Hinduism' },
  { id: 2, name: 'Islam' },
  { id: 3, name: 'Sikhism' },
  { id: 4, name: 'Christianity' },
];

export const mockYesNo = [
  { id: true, name: 'Yes' },
  { id: false, name: 'No' },
];

export const mockRelationships = [
  { id: 'Father', name: 'Father' },
  { id: 'Mother', name: 'Mother' },
  { id: 'Spouse', name: 'Spouse' },
];

export const mockStates = [
  { id: 1, name: 'Madhya Pradesh' },
  { id: 2, name: 'Maharashtra' },
];

export const mockDivisions = [
  { id: 1, name: 'Bhopal Division' },
  { id: 2, name: 'Indore Division' },
];

export const mockDistricts = [
  { id: 1, name: 'Bhopal' },
  { id: 2, name: 'Indore' },
];

export const mockTehsils = [
  { id: 1, name: 'Huzur' },
  { id: 2, name: 'Berasia' },
];

export const mockBlocks = [
  { id: 1, name: 'Block A' },
  { id: 2, name: 'Block B' },
];

export const mockDegreeLevels = [
  { id: 1, name: 'Bachelor' },
  { id: 2, name: 'Master' },
  { id: 3, name: 'Doctorate' },
];

export async function mockGetBasicEmployees() {
  await mockDelay(1000);
  return mockEmployees;
}

export async function mockGetEmployeeById(id: number) {
  await mockDelay(1000);
  return mockEmployees.find(e => e.employeeId === id) || null;
}
