import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<EmployeeManagement.FullOnboardingForm>(o => ({
  // ── Step 1: Quick Core ──
  salutation: o.any().required().label('Salutation'),
  firstName: o.any().required().label('First Name'),
  middleName: o.any().label('Middle Name'),
  lastName: o.any().required().label('Last Name'),
  gender: o.any().required().label('Gender'),
  casteId: o.any().required().label('Caste'),
  mobileNumber: o.any().required().label('Mobile Number'),
  officialEmail: o.any().required().label('Official Email'),
  dateOfBirth: o.any().required().label('Date of Birth'),
  employeeType: o.any().required().label('Employee Type'),
  employeeNatureId: o.any().required().label('Nature of Employment'),
  organizationUnitId: o.any().required().label('Organization Unit'),
  postId: o.any().required().label('Post'),
  designationId: o.any().required().label('Designation'),
  subjectSpecializationId: o.any().required().label('Subject Specialization'),
  seniorityRank: o.any().label('Seniority Rank'),
  employeeCode: o.any().required().label('Employee Code'),
  dateOfJoining: o.any().required().label('Date of Joining'),

  // ── Step 2: Extended ──
  bloodGroup: o.any().label('Blood Group'),
  maritalStatus: o.any().label('Marital Status'),
  nationalityId: o.any().required().label('Nationality'),
  religionId: o.any().required().label('Religion'),
  isPersonWithDisability: o.any().required().label('PwBD Status'),
  fatherName: o.any().label("Father's Name"),
  motherName: o.any().label("Mother's Name"),
  personalEmail: o.any().label('Personal Email'),
  alternateMobileNumber: o.any().label('Alternate Mobile'),
  officePhoneNumber: o.any().label('Office Phone'),
  emergencyContactName: o.any().required().label('Emergency Contact Name'),
  emergencyRelation: o.any().required().label('Emergency Relation'),
  emergencyPhoneNumber: o.any().required().label('Emergency Mobile'),
  personalWebsite: o.any().label('Personal Website'),
  bioNote: o.any().label('Bio Note'),
  aadharNumber: o.any().required().label('Aadhaar Number'),
  panNumber: o.any().label('PAN Number'),
  uanNumber: o.any().label('UAN Number'),
  drivingLicense: o.any().label('Driving License'),
  passportNumber: o.any().label('Passport Number'),
  passportValidity: o.any().label('Passport Validity'),

  // ── Step 3: Address ──
  currentAddress: o.any().required(),
  permanentAddress: o.any().required(),
  isSameAsCurrentAddress: o.any(),

  // ── Step 4: Qualifications ──
  qualificationLevelId: o.any().required().label('Highest Qualification'),
  qualifications: o.any().required().label('Qualifications'),
}));

const emptyQualification: EmployeeManagement.QualificationForm = {
  qualificationId: 0,
  university: '',
  board: '',
  yearOfPassing: 0,
  percentage: 0,
  grade: '',
};

export function useFullOnboardingForm(
  submitCallback: Forms.SubmitFunc<EmployeeManagement.FullOnboardingForm>,
  fetchData?: Forms.FetchDataFunc<EmployeeManagement.FullOnboardingForm>
) {
  const { register, handleSubmit, reset, setValue, watch, trigger } =
    useAppForm<EmployeeManagement.FullOnboardingForm>({
      defaultValues: fetchData || {
        isPersonWithDisability: false,
        isSameAsCurrentAddress: false,
        currentAddress: {
          addressType: 'Current',
        } as EmployeeManagement.AddressForm,
        permanentAddress: {
          addressType: 'Permanent',
        } as EmployeeManagement.AddressForm,
        qualifications: [{ ...emptyQualification }],
      },

      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
    watch,
    trigger,
  };
}

export { emptyQualification };
