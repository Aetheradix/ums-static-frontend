import { useAppForm } from 'shared/hooks/form';

export const emptyQualification: EmployeeManagement.QualificationForm = {
  qualificationId: 0,
  university: '',
  board: '',
  yearOfPassing: 0,
  percentage: 0,
  grade: '',
};

export function useFullOnboardingForm(
  submitCallback: Forms.SubmitFunc<EmployeeManagement.FullOnboardingForm>,
  initialData?: Partial<EmployeeManagement.FullOnboardingForm>
) {
  const defaultValues: Partial<EmployeeManagement.FullOnboardingForm> = {
    isPersonWithDisability: false,
    currentAddress: {
      addressType: 'Current',
    } as EmployeeManagement.AddressForm,
    qualifications: [{ ...emptyQualification }],
    ...initialData,
  };

  const { register, handleSubmit, reset, setValue, watch, trigger } =
    useAppForm<EmployeeManagement.FullOnboardingForm>({
      defaultValues,
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
