import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<EmployeeManagement.FullOnboardingForm>(o => ({
  // ── Step 1: Quick Core ──
  salutation: o.string().required().max(15).label('Salutation'),
  firstName: o.string().required().max(50).label('First Name'),
  middleName: o.string().allow('').max(50).label('Middle Name'),
  lastName: o.string().required().max(50).label('Last Name'),
  gender: o.string().required().label('Gender'),
  casteId: o.number().required().min(1).label('Caste'),
  mobileNumber: o
    .string()
    .required()
    .length(10)
    .pattern(/^\d{10}$/)
    .label('Mobile Number'),
  officialEmail: o
    .string()
    .required()
    .max(100)
    .email({ tlds: false })
    .label('Official Email'),
  dateOfBirth: o.date().required().label('Date of Birth'),
  employeeType: o.string().required().max(50).label('Employee Type'),
  employeeNatureId: o.number().required().min(1).label('Nature of Employment'),
  organizationUnitId: o.number().required().min(1).label('Organization Unit'),
  postId: o.number().required().min(1).label('Post'),
  designationId: o.number().required().min(1).label('Designation'),
  subjectSpecializationId: o
    .number()
    .required()
    .min(1)
    .label('Subject Specialization'),
  seniorityRank: o.string().allow('').max(20).label('Seniority Rank'),
  employeeCode: o.string().required().max(50).label('Employee Code'),
  dateOfJoining: o.date().required().label('Date of Joining'),

  // ── Step 2: Extended ──
  bloodGroup: o.string().allow('').max(15).label('Blood Group'),
  maritalStatus: o.string().allow('').max(30).label('Marital Status'),
  nationalityId: o.number().required().min(1).label('Nationality'),
  religionId: o.number().required().min(1).label('Religion'),
  isPersonWithDisability: o.boolean().required().label('PwBD Status'),
  fatherName: o.string().allow('').max(150).label("Father's Name"),
  motherName: o.string().allow('').max(150).label("Mother's Name"),
  personalEmail: o
    .string()
    .allow('')
    .max(50)
    .email({ tlds: false })
    .label('Personal Email'),
  alternateMobileNumber: o
    .string()
    .allow('')
    .length(10)
    .pattern(/^\d{10}$/)
    .label('Alternate Mobile'),
  officePhoneNumber: o.string().allow('').max(100).label('Office Phone'),
  emergencyContactName: o
    .string()
    .required()
    .max(100)
    .label('Emergency Contact Name'),
  emergencyRelation: o.string().required().max(50).label('Emergency Relation'),
  emergencyPhoneNumber: o
    .string()
    .required()
    .max(100)
    .label('Emergency Mobile'),
  personalWebsite: o.string().allow('').max(255).label('Personal Website'),
  bioNote: o.string().allow('').max(600).label('Bio Note'),
  aadharNumber: o.string().required().length(12).label('Aadhaar Number'),
  panNumber: o.string().allow('').max(10).label('PAN Number'),
  uanNumber: o.string().allow('').max(100).label('UAN Number'),
  drivingLicense: o.string().allow('').max(100).label('Driving License'),
  passportNumber: o.string().allow('').max(100).label('Passport Number'),
  passportValidity: o.date().allow(null).optional().label('Passport Validity'),

  // ── Step 3: Address ──
  currentAddress: o.object().required(),
  permanentAddress: o.object().required(),
  isSameAsCurrentAddress: o.boolean().optional(),

  // ── Step 4: Qualifications ──
  qualificationLevelId: o
    .number()
    .required()
    .min(1)
    .label('Highest Qualification'),
  qualifications: o.array().min(1).required().label('Qualifications'),
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
