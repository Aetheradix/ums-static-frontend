import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import DivisionForm from '../components/DivisionForm';
import { useDivisionQuery, useUpdateDivisionMutation } from '../queries';

const DEFAULT: Master.DivisionForm = {
  code: '',
  name: '',
  stateId: 0,
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateDivisionMutation(id);
  const { data = DEFAULT, isLoading } = useDivisionQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.division.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.DivisionForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Division updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update division');
    }
  }

  return (
    <FormPage
      title="Edit Division"
      description="Update the details of the division."
    >
      <FormCard title="Division Details">
        {isLoading ? (
          <Loader />
        ) : (
          <DivisionForm
            fetchData={data}
            isSaving={isPending}
            isEditMode
            onSubmit={handleSubmit}
          />
        )}
      </FormCard>
    </FormPage>
  );
}
