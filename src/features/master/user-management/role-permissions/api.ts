const STATIC_FEATURES: UserManagement.FeatureItem[] = [
  { name: 'User Management — Users', value: '@user-management/users' },
  { name: 'User Management — Roles', value: '@user-management/roles' },
  {
    name: 'User Management — Role Permissions',
    value: '@user-management/role-permissions',
  },
  {
    name: 'User Management — User Assignment',
    value: '@user-management/user-assignment',
  },
  { name: 'Master — State', value: '@master/State' },
  { name: 'Master — Division', value: '@master/Division' },
  { name: 'Master — District', value: '@master/District' },
  { name: 'Master — Tehsil', value: '@master/Tehsil' },
  { name: 'Master — Block', value: '@master/Block' },
  {
    name: 'Master — Faculties / Department',
    value: '@master/Faculties/Department',
  },
  {
    name: 'Master — Faculties / Designation',
    value: '@master/Faculties/Designation',
  },
  { name: 'Master — Faculties / Faculty', value: '@master/Faculties/Faculty' },
  { name: 'Master — HR / Caste', value: '@master/HR/Caste' },
  { name: 'Master — HR / Post', value: '@master/HR/Post' },
  { name: 'Master — HR / Qualification', value: '@master/HR/Qualification' },
  {
    name: 'Master — College / College Type',
    value: '@master/College/CollegeType',
  },
  {
    name: 'Master — College / Category',
    value: '@master/College/CollegeCategory',
  },
  { name: 'Master — Other / Programme', value: '@master/Other/Programme' },
  {
    name: 'Master — Other / Academic Year',
    value: '@master/Other/AcademicYear',
  },
  {
    name: 'Master — Grant / Grant Type',
    value: '@master/Grant/GrantType',
  },
  { name: 'Master — Scheme / Schemes', value: '@master/Scheme/Schemes' },
  {
    name: 'Employee Management — Quick Onboarding',
    value: '@employee-management/quick-onboarding',
  },
  {
    name: 'Employee Management — Full Onboarding',
    value: '@employee-management/full-onboarding',
  },
  {
    name: 'Employee Management — Manage Employees',
    value: '@employee-management/manage-employees',
  },
  {
    name: 'Career Advancement — APAR Application',
    value: '@CareerAdvancement/AparApplication',
  },
  {
    name: 'Career Advancement — Sessions Management',
    value: '@CareerAdvancement/SessionsManagement',
  },
  {
    name: 'Career Advancement — Employee Self Assessment',
    value: '@CareerAdvancement/EmployeeSelfAssessment',
  },
  {
    name: 'SIS — Student Application Form',
    value: '@sis/StudentApplicationForm',
  },
  {
    name: 'SIS — Student Additional Information',
    value: '@sis/StudentAdditionalInformation',
  },
  { name: 'SIS — Fee Payment Approval', value: '@sis/StudentFeeApproval' },
  {
    name: 'Affiliation — College Registration',
    value: '@affiliation/CollegeRegistration',
  },
  {
    name: 'Affiliation — Registration Approval',
    value: '@collegeaffiliation/collegeregistrationapproval',
  },
  {
    name: 'Affiliation — Programme Fee',
    value: '@master/Affiliation/ProgrammeFee',
  },
];

const STATIC_RIGHTS: UserManagement.RightItem[] = [
  { name: 'Read', value: 'read' },
  { name: 'Write', value: 'write' },
];

let nextPermId = 100;

let permissions: UserManagement.RolePermissionList[] = [
  // Super Admin — full access
  {
    id: '1',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/users',
    action: 'read',
  },
  {
    id: '2',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/users',
    action: 'write',
  },
  {
    id: '3',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/roles',
    action: 'read',
  },
  {
    id: '4',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/roles',
    action: 'write',
  },
  {
    id: '5',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/role-permissions',
    action: 'read',
  },
  {
    id: '6',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/role-permissions',
    action: 'write',
  },
  {
    id: '7',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/user-assignment',
    action: 'read',
  },
  {
    id: '8',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@user-management/user-assignment',
    action: 'write',
  },
  {
    id: '9',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@employee-management/manage-employees',
    action: 'read',
  },
  {
    id: '10',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@employee-management/manage-employees',
    action: 'write',
  },
  {
    id: '11',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@CareerAdvancement/AparApplication',
    action: 'read',
  },
  {
    id: '12',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@CareerAdvancement/AparApplication',
    action: 'write',
  },
  {
    id: '13',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@sis/StudentApplicationForm',
    action: 'read',
  },
  {
    id: '14',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: '@sis/StudentApplicationForm',
    action: 'write',
  },
  // Admin
  {
    id: '15',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@user-management/users',
    action: 'read',
  },
  {
    id: '16',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@user-management/users',
    action: 'write',
  },
  {
    id: '17',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@employee-management/manage-employees',
    action: 'read',
  },
  {
    id: '18',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@employee-management/manage-employees',
    action: 'write',
  },
  {
    id: '19',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@master/State',
    action: 'read',
  },
  {
    id: '20',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@master/State',
    action: 'write',
  },
  {
    id: '21',
    roleName: 'Admin',
    domain: 'GLOBAL',
    feature: '@sis/StudentApplicationForm',
    action: 'read',
  },
  // Registrar
  {
    id: '22',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@sis/StudentApplicationForm',
    action: 'read',
  },
  {
    id: '23',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@sis/StudentApplicationForm',
    action: 'write',
  },
  {
    id: '24',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@sis/StudentAdditionalInformation',
    action: 'read',
  },
  {
    id: '25',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@sis/StudentAdditionalInformation',
    action: 'write',
  },
  {
    id: '26',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@sis/StudentFeeApproval',
    action: 'read',
  },
  {
    id: '27',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: '@master/Other/Programme',
    action: 'read',
  },
  // Faculty
  {
    id: '28',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: '@CareerAdvancement/EmployeeSelfAssessment',
    action: 'read',
  },
  {
    id: '29',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: '@CareerAdvancement/EmployeeSelfAssessment',
    action: 'write',
  },
  {
    id: '30',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: '@CareerAdvancement/AparApplication',
    action: 'read',
  },
];

export async function getFeatures(): Promise<UserManagement.FeatureItem[]> {
  return STATIC_FEATURES;
}

export async function getRights(): Promise<UserManagement.RightItem[]> {
  return STATIC_RIGHTS;
}

export async function getRolePermissions(): Promise<
  UserManagement.RolePermissionList[]
> {
  return [...permissions];
}

export async function getRolePermissionByPolicy(
  roleName: string,
  domain: string,
  feature: string,
  action: string
): Promise<UserManagement.RolePermissionList> {
  return permissions.find(
    p =>
      p.roleName === roleName &&
      p.domain === domain &&
      p.feature === feature &&
      p.action === action
  )!;
}

export async function createRolePermission(
  data: UserManagement.RolePermissionCreate
) {
  const exists = permissions.some(
    p =>
      p.roleName === data.roleName &&
      p.domain === data.domain &&
      p.feature === data.feature &&
      p.action === data.action
  );
  const newEntry: UserManagement.RolePermissionList = {
    id: String(nextPermId++),
    ...data,
  };
  if (!exists) {
    permissions = [...permissions, newEntry];
  }
  return newEntry;
}

export async function updateRolePermission(
  data: UserManagement.RolePermissionUpdate
): Promise<boolean> {
  permissions = permissions.map(p => {
    if (
      p.roleName === data.roleName &&
      p.domain === data.domain &&
      p.feature === data.feature &&
      p.action === data.oldAction
    ) {
      return { ...p, action: data.newAction };
    }
    return p;
  });
  return true;
}
