/**
 * Static sample data for the User Management module.
 *
 * This is a static/prototype screen — there is no API layer or React Query.
 * All screens read from these fixed arrays. Create / Edit / Delete actions
 * only show a confirmation toast; they do not mutate this data.
 *
 * Roles, hierarchy and access follow the University ERP "RBAC Ladder"
 * (University → Faculty → Department → College → Student → External).
 * Permission rule of thumb: leadership roles consume information (read-heavy),
 * operational roles enter it (read + write).
 */

/* ── Users ── */
export const USERS: UserManagement.UserList[] = [
  {
    id: '1',
    userName: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@university.edu',
    isActive: true,
  },
  {
    id: '2',
    userName: 'vikram.nair',
    firstName: 'Vikram',
    lastName: 'Nair',
    email: 'vikram.nair@university.edu',
    isActive: true,
  },
  {
    id: '3',
    userName: 'arjun.sharma',
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun.sharma@university.edu',
    isActive: true,
  },
  {
    id: '4',
    userName: 'priya.verma',
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.verma@university.edu',
    isActive: true,
  },
  {
    id: '5',
    userName: 'sneha.iyer',
    firstName: 'Sneha',
    lastName: 'Iyer',
    email: 'sneha.iyer@university.edu',
    isActive: true,
  },
  {
    id: '6',
    userName: 'ananya.rao',
    firstName: 'Ananya',
    lastName: 'Rao',
    email: 'ananya.rao@university.edu',
    isActive: true,
  },
  {
    id: '7',
    userName: 'rohit.mishra',
    firstName: 'Rohit',
    lastName: 'Mishra',
    email: 'rohit.mishra@university.edu',
    isActive: true,
  },
  {
    id: '8',
    userName: 'karthik.menon',
    firstName: 'Karthik',
    lastName: 'Menon',
    email: 'karthik.menon@university.edu',
    isActive: true,
  },
  {
    id: '9',
    userName: 'divya.pillai',
    firstName: 'Divya',
    lastName: 'Pillai',
    email: 'divya.pillai@university.edu',
    isActive: true,
  },
];

/* ── Roles (University ERP RBAC Ladder) ── */
export const ROLES: UserManagement.UserRoleList[] = [
  {
    id: '1',
    name: 'Super Admin',
    description:
      'System / ERP administrator — user provisioning, role management, and full system configuration. Sits outside the academic hierarchy.',
    isActive: true,
  },
  {
    id: '2',
    name: 'Vice-Chancellor',
    description:
      'Chief executive of the university — policy, budgets, and senior appointments. Primarily consumes dashboards and reports.',
    isActive: true,
  },
  {
    id: '3',
    name: 'Registrar',
    description:
      'Chief administrative officer — records, correspondence, and approvals. Most operational workflows terminate here.',
    isActive: true,
  },
  {
    id: '4',
    name: 'Controller of Examinations',
    description:
      'Owns the examination system — question papers, evaluation, results, and degree eligibility.',
    isActive: true,
  },
  {
    id: '5',
    name: 'Finance Officer',
    description:
      'Independent finance authority — budgets, payroll, fees, and audit. Not under the Registrar.',
    isActive: true,
  },
  {
    id: '6',
    name: 'Dean',
    description:
      'Academic head over a faculty — curriculum, policy, and cross-department coordination.',
    isActive: true,
  },
  {
    id: '7',
    name: 'HOD',
    description:
      'Head of Department — faculty allocation, timetables, and department-level student records.',
    isActive: true,
  },
  {
    id: '8',
    name: 'Faculty',
    description:
      'Teaching staff — access limited to own classes, students, and grades.',
    isActive: true,
  },
  {
    id: '9',
    name: 'College Admin',
    description:
      'Affiliated / constituent college administrator — local records, admissions, and day-to-day operations.',
    isActive: true,
  },
  {
    id: '10',
    name: 'Student',
    description:
      'Student self-service — courses, semester registration, results, and fees.',
    isActive: true,
  },
  {
    id: '11',
    name: 'Applicant',
    description: 'Prospective student — application and admission access only.',
    isActive: true,
  },
  {
    id: '12',
    name: 'Parent',
    description: "Guardian — limited view of a ward's progress and fees.",
    isActive: true,
  },
  {
    id: '13',
    name: 'Alumni',
    description: 'Former student — alumni self-service and limited access.',
    isActive: true,
  },
];

/* ── User Assignments (user → role → domain) ── */
export const USER_ASSIGNMENTS: UserManagement.UserAssignmentList[] = [
  { userId: '1', userName: 'admin', roleName: 'Super Admin', domain: 'GLOBAL' },
  {
    userId: '2',
    userName: 'vikram.nair',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
  },
  {
    userId: '3',
    userName: 'arjun.sharma',
    roleName: 'Registrar',
    domain: 'GLOBAL',
  },
  {
    userId: '4',
    userName: 'priya.verma',
    roleName: 'Controller of Examinations',
    domain: 'GLOBAL',
  },
  {
    userId: '5',
    userName: 'sneha.iyer',
    roleName: 'Finance Officer',
    domain: 'GLOBAL',
  },
  {
    userId: '6',
    userName: 'ananya.rao',
    roleName: 'Dean',
    domain: 'GLOBAL',
  },
  // Rohit is a Professor (Faculty) who also holds the HOD assignment —
  // a person's Post and Assignment stack, per the Samarth access model.
  {
    userId: '7',
    userName: 'rohit.mishra',
    roleName: 'HOD',
    domain: 'GLOBAL',
  },
  {
    userId: '7',
    userName: 'rohit.mishra',
    roleName: 'Faculty',
    domain: 'GLOBAL',
  },
  {
    userId: '8',
    userName: 'karthik.menon',
    roleName: 'College Admin',
    domain: 'GLOBAL',
  },
  {
    userId: '9',
    userName: 'divya.pillai',
    roleName: 'Student',
    domain: 'GLOBAL',
  },
];

/* ── Domains ── */
export const DOMAINS: { name: string; value: string }[] = [
  { name: 'GLOBAL', value: 'GLOBAL' },
];

/* ── Institutions (domain tree) ──
 * One University root; UTD, Constituent and Affiliated colleges are its
 * children (siblings of each other). A role is scoped to one of these.
 * The university's reach flows DOWN: full into UTD / Constituent, but only
 * the exam / degree / affiliation / curriculum features cross into an
 * Affiliated college (see AFFILIATED_REACH_FEATURES). */
export const INSTITUTIONS: UserManagement.Domain[] = [
  { id: 'univ', name: 'State University', type: 'University', parentId: null },
  {
    id: 'utd-cs',
    name: 'UTD — School of Computer Science',
    type: 'UTD',
    parentId: 'univ',
  },
  {
    id: 'utd-ims',
    name: 'UTD — Institute of Management Studies',
    type: 'UTD',
    parentId: 'univ',
  },
  {
    id: 'con-gcc',
    name: 'Government Constituent College',
    type: 'Constituent',
    parentId: 'univ',
  },
  {
    id: 'aff-abc',
    name: 'ABC College of Arts & Science',
    type: 'Affiliated',
    parentId: 'univ',
  },
  {
    id: 'aff-def',
    name: 'DEF Institute of Technology',
    type: 'Affiliated',
    parentId: 'univ',
  },
];

/* ── Reach rule ──
 * When a University-level role is scoped to an AFFILIATED college, only these
 * features cross the boundary — exams, student records, degrees, affiliation
 * and curriculum compliance. Everything else (admissions ops, HR, finance,
 * system admin, general masters) stays with the college and is NOT grantable.
 * UTD and Constituent colleges have no such restriction (full reach). */
export const AFFILIATED_REACH_FEATURES: string[] = [
  // Affiliation — the university governs the college's affiliation
  'Affiliation.CollegeRegistration',
  'Affiliation.CollegeRegistrationApproval',
  'Affiliation.ProgrammeFee',
  // Curriculum compliance — university sets syllabus & calendar the college follows
  'Master.Programme',
  'Master.AcademicYear',
  // Exams, results & student records — the core reason affiliation exists
  'SIS.StudentApplicationForm',
  'SIS.StudentAdditionalInformation',
];

/* ── Features (Access Control targets) ──
 * Feature identifiers follow the `Module.FeatureName` convention (PascalCase).
 * This identifier is what the Access Control grid displays, so name === value. */
export const FEATURES: UserManagement.FeatureItem[] = [
  {
    name: 'UserManagement.UserRegistration',
    value: 'UserManagement.UserRegistration',
  },
  { name: 'UserManagement.RoleMasters', value: 'UserManagement.RoleMasters' },
  {
    name: 'UserManagement.AccessControl',
    value: 'UserManagement.AccessControl',
  },
  {
    name: 'UserManagement.UserRoleAssignment',
    value: 'UserManagement.UserRoleAssignment',
  },
  { name: 'Master.State', value: 'Master.State' },
  { name: 'Master.Division', value: 'Master.Division' },
  { name: 'Master.District', value: 'Master.District' },
  { name: 'Master.Tehsil', value: 'Master.Tehsil' },
  { name: 'Master.Block', value: 'Master.Block' },
  { name: 'Master.Department', value: 'Master.Department' },
  { name: 'Master.Designation', value: 'Master.Designation' },
  { name: 'Master.Faculty', value: 'Master.Faculty' },
  { name: 'Master.Caste', value: 'Master.Caste' },
  { name: 'Master.Post', value: 'Master.Post' },
  { name: 'Master.Qualification', value: 'Master.Qualification' },
  { name: 'Master.CollegeType', value: 'Master.CollegeType' },
  { name: 'Master.CollegeCategory', value: 'Master.CollegeCategory' },
  { name: 'Master.Programme', value: 'Master.Programme' },
  { name: 'Master.AcademicYear', value: 'Master.AcademicYear' },
  { name: 'Master.GrantType', value: 'Master.GrantType' },
  { name: 'Master.Schemes', value: 'Master.Schemes' },
  {
    name: 'EmployeeManagement.QuickOnboarding',
    value: 'EmployeeManagement.QuickOnboarding',
  },
  {
    name: 'EmployeeManagement.FullOnboarding',
    value: 'EmployeeManagement.FullOnboarding',
  },
  {
    name: 'EmployeeManagement.ManageEmployees',
    value: 'EmployeeManagement.ManageEmployees',
  },
  {
    name: 'CareerAdvancement.AparApplication',
    value: 'CareerAdvancement.AparApplication',
  },
  {
    name: 'CareerAdvancement.SessionsManagement',
    value: 'CareerAdvancement.SessionsManagement',
  },
  {
    name: 'CareerAdvancement.EmployeeSelfAssessment',
    value: 'CareerAdvancement.EmployeeSelfAssessment',
  },
  {
    name: 'SIS.StudentApplicationForm',
    value: 'SIS.StudentApplicationForm',
  },
  {
    name: 'SIS.StudentAdditionalInformation',
    value: 'SIS.StudentAdditionalInformation',
  },
  { name: 'SIS.StudentFeeApproval', value: 'SIS.StudentFeeApproval' },
  {
    name: 'Affiliation.CollegeRegistration',
    value: 'Affiliation.CollegeRegistration',
  },
  {
    name: 'Affiliation.CollegeRegistrationApproval',
    value: 'Affiliation.CollegeRegistrationApproval',
  },
  { name: 'Affiliation.ProgrammeFee', value: 'Affiliation.ProgrammeFee' },
];

/* ── Access Rights ── */
export const RIGHTS: UserManagement.RightItem[] = [
  { name: 'Read', value: 'read' },
  { name: 'Write', value: 'write' },
];

/* ── Role Permissions (Access Control matrix) ──
 * Each (role, feature) has a SINGLE action. Read and Write are mutually
 * exclusive: 'write' already implies read (granted by the backend), so a
 * feature is either read-only or write — never both.
 * Leadership roles (VC) are read-only; operational roles get write on the
 * areas they own. Roles omitted below (e.g. Alumni) have no permissions yet. */
export const ROLE_PERMISSIONS: UserManagement.RolePermissionList[] = [
  // ── Super Admin — write (implies read) across the board ──
  {
    id: '1',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'UserManagement.UserRegistration',
    action: 'write',
  },
  {
    id: '2',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'UserManagement.RoleMasters',
    action: 'write',
  },
  {
    id: '3',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'UserManagement.AccessControl',
    action: 'write',
  },
  {
    id: '4',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'UserManagement.UserRoleAssignment',
    action: 'write',
  },
  {
    id: '5',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'EmployeeManagement.ManageEmployees',
    action: 'write',
  },
  {
    id: '6',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'Master.State',
    action: 'write',
  },
  {
    id: '7',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'write',
  },

  // ── Vice-Chancellor — read-only (consumes dashboards) ──
  {
    id: '8',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
    feature: 'UserManagement.UserRegistration',
    action: 'read',
  },
  {
    id: '9',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
    feature: 'EmployeeManagement.ManageEmployees',
    action: 'read',
  },
  {
    id: '10',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.AparApplication',
    action: 'read',
  },
  {
    id: '11',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'read',
  },
  {
    id: '12',
    roleName: 'Vice-Chancellor',
    domain: 'GLOBAL',
    feature: 'Master.State',
    action: 'read',
  },

  // ── Registrar — operational records & administration ──
  {
    id: '13',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'UserManagement.UserRegistration',
    action: 'write',
  },
  {
    id: '14',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'UserManagement.UserRoleAssignment',
    action: 'write',
  },
  {
    id: '15',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'Master.State',
    action: 'write',
  },
  {
    id: '16',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'Master.Programme',
    action: 'write',
  },
  {
    id: '17',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'SIS.StudentAdditionalInformation',
    action: 'write',
  },
  {
    id: '18',
    roleName: 'Registrar',
    domain: 'GLOBAL',
    feature: 'EmployeeManagement.ManageEmployees',
    action: 'read',
  },

  // ── Controller of Examinations — exam & results ──
  {
    id: '19',
    roleName: 'Controller of Examinations',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'write',
  },
  {
    id: '20',
    roleName: 'Controller of Examinations',
    domain: 'GLOBAL',
    feature: 'SIS.StudentAdditionalInformation',
    action: 'write',
  },
  {
    id: '21',
    roleName: 'Controller of Examinations',
    domain: 'GLOBAL',
    feature: 'SIS.StudentFeeApproval',
    action: 'read',
  },
  {
    id: '22',
    roleName: 'Controller of Examinations',
    domain: 'GLOBAL',
    feature: 'Master.AcademicYear',
    action: 'read',
  },

  // ── Finance Officer — budgets, fees, grants ──
  {
    id: '23',
    roleName: 'Finance Officer',
    domain: 'GLOBAL',
    feature: 'SIS.StudentFeeApproval',
    action: 'write',
  },
  {
    id: '24',
    roleName: 'Finance Officer',
    domain: 'GLOBAL',
    feature: 'Affiliation.ProgrammeFee',
    action: 'write',
  },
  {
    id: '25',
    roleName: 'Finance Officer',
    domain: 'GLOBAL',
    feature: 'Master.GrantType',
    action: 'write',
  },
  {
    id: '26',
    roleName: 'Finance Officer',
    domain: 'GLOBAL',
    feature: 'EmployeeManagement.ManageEmployees',
    action: 'read',
  },

  // ── Dean — faculty-level academics ──
  {
    id: '27',
    roleName: 'Dean',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.AparApplication',
    action: 'write',
  },
  {
    id: '28',
    roleName: 'Dean',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.SessionsManagement',
    action: 'write',
  },
  {
    id: '29',
    roleName: 'Dean',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.EmployeeSelfAssessment',
    action: 'read',
  },
  {
    id: '30',
    roleName: 'Dean',
    domain: 'GLOBAL',
    feature: 'Master.Programme',
    action: 'read',
  },

  // ── HOD — department scoped ──
  {
    id: '31',
    roleName: 'HOD',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.EmployeeSelfAssessment',
    action: 'write',
  },
  {
    id: '32',
    roleName: 'HOD',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.AparApplication',
    action: 'write',
  },
  {
    id: '33',
    roleName: 'HOD',
    domain: 'GLOBAL',
    feature: 'Master.Department',
    action: 'read',
  },
  {
    id: '34',
    roleName: 'HOD',
    domain: 'GLOBAL',
    feature: 'EmployeeManagement.ManageEmployees',
    action: 'read',
  },

  // ── Faculty — own classes & self-assessment ──
  {
    id: '35',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.EmployeeSelfAssessment',
    action: 'write',
  },
  {
    id: '36',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: 'CareerAdvancement.AparApplication',
    action: 'read',
  },
  {
    id: '37',
    roleName: 'Faculty',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'read',
  },

  // ── College Admin — college registration & affiliation ──
  {
    id: '38',
    roleName: 'College Admin',
    domain: 'GLOBAL',
    feature: 'Affiliation.CollegeRegistration',
    action: 'write',
  },
  {
    id: '39',
    roleName: 'College Admin',
    domain: 'GLOBAL',
    feature: 'Affiliation.CollegeRegistrationApproval',
    action: 'read',
  },
  {
    id: '40',
    roleName: 'College Admin',
    domain: 'GLOBAL',
    feature: 'Master.CollegeType',
    action: 'read',
  },
  {
    id: '41',
    roleName: 'College Admin',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'read',
  },

  // ── Student — self-service (read-only) ──
  {
    id: '42',
    roleName: 'Student',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'read',
  },
  {
    id: '43',
    roleName: 'Student',
    domain: 'GLOBAL',
    feature: 'SIS.StudentAdditionalInformation',
    action: 'read',
  },
  {
    id: '44',
    roleName: 'Student',
    domain: 'GLOBAL',
    feature: 'SIS.StudentFeeApproval',
    action: 'read',
  },

  // ── Applicant — application only ──
  {
    id: '45',
    roleName: 'Applicant',
    domain: 'GLOBAL',
    feature: 'SIS.StudentApplicationForm',
    action: 'read',
  },

  // ── Parent — ward fees (read-only) ──
  {
    id: '46',
    roleName: 'Parent',
    domain: 'GLOBAL',
    feature: 'SIS.StudentFeeApproval',
    action: 'read',
  },
];
