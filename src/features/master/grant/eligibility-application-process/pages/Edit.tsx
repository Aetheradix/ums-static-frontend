import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import EligibilityApplicationProcessForm from '../components/EligibilityApplicationProcessForm';
import {
  useEligibilityApplicationProcessQuery,
  useUpdateEligibilityApplicationProcessMutation,
} from '../queries';

const DEFAULT = {
  grantTypeId: 0,
  grantCategoryId: 0,
  eligibilityText: '',
  applicationProcessText: '',
  approvalProcessText: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } =
    useUpdateEligibilityApplicationProcessMutation(id);
  const { data = DEFAULT, isLoading } =
    useEligibilityApplicationProcessQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.eligibilityApplicationProcess.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(
    data: Master.Grant.EligibilityApplicationProcessForm
  ) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success(
          'Eligibility Application Process updated successfully.'
        );
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update eligibility application process');
    }
  }

  return (
    <FormPage
      title="Edit Eligibility Application Process"
      description="Update the eligibility application process details."
    >
      <FormCard title="Eligibility Application Process Details">
        <EligibilityApplicationProcessForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
