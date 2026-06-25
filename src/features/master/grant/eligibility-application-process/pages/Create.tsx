import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import EligibilityApplicationProcessForm from '../components/EligibilityApplicationProcessForm';
import { useCreateEligibilityApplicationProcessMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } =
    useCreateEligibilityApplicationProcessMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.eligibilityApplicationProcess.root);
  }, [navigate]);

  async function handleSubmit(
    data: Master.Grant.EligibilityApplicationProcessForm
  ) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success(
          'Eligibility Application Process created successfully.'
        );
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create eligibility application process');
    }
  }

  return (
    <FormPage
      title="Create Eligibility Application Process"
      description="Fill in the details to add a new eligibility application process."
    >
      <FormCard title="Eligibility Application Process Details">
        <EligibilityApplicationProcessForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
