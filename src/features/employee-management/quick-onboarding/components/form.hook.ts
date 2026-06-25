import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<EmployeeManagement.QuickOnboardingForm>(o => ({
  // Employee Information
  employeeType: o.string().required().max(50).label('Employee Type'),

  employeeNatureId: o.number().required().min(1).label('Nature of Employment'),

  organizationUnitId: o.number().required().min(1).label('Organization Unit'),

  postId: o.number().required().min(1).label('Post'),

  designationId: o.number().required().min(1).label('Designation'),

  seniorityRank: o.string().required().max(20).label('Seniority Rank'),

  subjectSpecializationId: o
    .number()
    .required()
    .min(1)
    .label('Subject Specialization'),

  // Personal Information
  salutation: o.string().required().max(15).label('Salutation'),

  firstName: o.string().required().max(50).label('First Name'),

  middleName: o
    .string()
    .allow('', null)
    .optional()
    .max(50)
    .label('Middle Name'),

  lastName: o.string().required().max(50).label('Last Name'),

  gender: o.string().required().label('Gender'),

  casteId: o.number().required().min(1).label('Category'),

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

  // Employee Code
  employeeCode: o.string().required().max(50).label('Employee Code'),
}));

export function useQuickOnboardingForm(
  submitCallback: Forms.SubmitFunc<EmployeeManagement.QuickOnboardingForm>,
  fetchData?: Forms.FetchDataFunc<EmployeeManagement.QuickOnboardingForm>
) {
  const { register, handleSubmit, reset, setValue, watch } =
    useAppForm<EmployeeManagement.QuickOnboardingForm>({
      defaultValues: fetchData,

      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
    watch,
  };
}
