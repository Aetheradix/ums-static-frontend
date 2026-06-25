import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FormPage } from 'shared/new-components';
import FullOnboardingForm from '../components/FullOnboardingForm';
import { useCreateFullOnboardingMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateFullOnboardingMutation();

  const handleBack = useCallback(() => {
    navigate('/employee-management/manage-employees');
  }, [navigate]);

  async function handleSubmit(data: EmployeeManagement.FullOnboardingForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employee onboarded successfully.');
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
      title="Full Onboarding"
      description="Complete employee onboarding and registration form."
    >
      <FullOnboardingForm onSubmit={handleSubmit} isSaving={isPending} />
    </FormPage>
  );
}
