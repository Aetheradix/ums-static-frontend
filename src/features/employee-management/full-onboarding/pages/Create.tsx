import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FormPage } from 'shared/new-components';
import FullOnboardingForm from '../components/FullOnboardingForm';

export default function Create() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const handleBack = useCallback(() => {
    navigate('/employee-management/manage-employees');
  }, [navigate]);

  async function handleSubmit(_data: EmployeeManagement.FullOnboardingForm) {
    try {
      setIsPending(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      ToastService.success('Employee onboarded successfully.');
      handleBack();
    } catch (err) {
      ToastService.error(
        err instanceof Error ? err.message : 'Failed to register employee.'
      );
    } finally {
      setIsPending(false);
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
