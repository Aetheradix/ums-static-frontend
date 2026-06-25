export type ProfileFormState = {
  fullName: string;

  employeeCode?: string;
  role?: string;
  department?: string;
  designation?: string;
  organizationUnit?: string;
  reportingTo?: string;
  employeeType?: string;
  natureOfEmployment?: string;
  dateOfJoining?: string;
  employeeStatus?: string;
  workLocation?: string;

  ugQualification?: string;
  pgQualification?: string;
  councilOrBoard?: string;
  registrationNumber?: string;
  totalExperience?: string;
  specialization?: string;

  nameInHindi?: string;
  gender?: string;
  category?: string;
  pwdStatus?: string;
  bloodGroup?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  weddingDate?: string;
  dateOfBirth?: string;

  officialEmail: string;
  alternateEmail: string;
  officialPhone: string;
  alternatePhone: string;
  emergencyPhone: string;

  permanentAddress: string;
  localAddress: string;
  bio: string;
  profileImage: File | string | null;
};
