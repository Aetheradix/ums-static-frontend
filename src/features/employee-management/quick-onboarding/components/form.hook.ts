import { useAppForm } from 'shared/hooks/form';

export function useQuickOnboardingForm(
  submitCallback: Forms.SubmitFunc<EmployeeManagement.QuickOnboardingForm>,
  fetchData?: Forms.FetchDataFunc<EmployeeManagement.QuickOnboardingForm>
) {
  const { register, handleSubmit, reset, setValue, watch } =
    useAppForm<EmployeeManagement.QuickOnboardingForm>({
      defaultValues: fetchData,
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
    watch,
  };
}
