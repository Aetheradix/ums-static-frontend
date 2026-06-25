import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<EmployeeManagement.QuickOnboardingForm>(o => ({
  // Employee Information
  employeeType: o.any().required().label('Employee Type'),

  employeeNatureId: o.any().required().label('Nature of Employment'),

  organizationUnitId: o.any().required().label('Organization Unit'),

  postId: o.any().required().label('Post'),

  designationId: o.any().required().label('Designation'),

  seniorityRank: o.any().label('Seniority Rank'),

  subjectSpecializationId: o.any().required().label('Subject Specialization'),

  // Personal Information
  salutation: o.any().required().label('Salutation'),
  firstName: o.any().required().label('First Name'),

  middleName: o.any().label('Middle Name'),

  lastName: o.any().required().label('Last Name'),

  gender: o.any().required().label('Gender'),

  casteId: o.any().required().label('Category'),

  mobileNumber: o.any().required().label('Mobile Number'),

  officialEmail: o.any().required().label('Official Email'),

  dateOfBirth: o.any().required().label('Date of Birth'),

  // Employee Code
  employeeCode: o.any().required().label('Employee Code'),

  dateOfJoining: o.any().required().label('Date of Joining'),
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
