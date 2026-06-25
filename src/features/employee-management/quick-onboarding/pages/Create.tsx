import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FormPage } from 'shared/new-components';
import QuickOnboardingForm from '../components/QuickOnboardingForm';
import { useCreateQuickOnboardingMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateQuickOnboardingMutation();

  const handleBack = useCallback(() => {
    navigate('/employee-management/manage-employees');
  }, [navigate]);

  async function handleSubmit(data: EmployeeManagement.QuickOnboardingForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employee registered successfully.');
        handleBack();
      }
    } catch (err) {
      ToastService.error(
        err instanceof Error ? err.message : 'Failed to register employee.'
      );
    }
  }

  return (
    <FormPage
      title="Quick Onboarding"
      description="Quick employee onboarding and registration form."
    >
      <QuickOnboardingForm
        onSubmit={handleSubmit}
        onCancel={handleBack}
        isSaving={isPending}
      />
    </FormPage>
  );
}
