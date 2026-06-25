import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import StateForm from '../components/StateForm';
import { useStateQuery, useUpdateStateMutation } from '../queries';

const DEFAULT: Master.StateForm = {
  code: '',
  name: '',
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateStateMutation(id);
  const { data = DEFAULT, isLoading } = useStateQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.state.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.StateForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('State updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update state');
    }
  }

  return (
    <FormPage title="Edit State" description="Update the details of the state.">
      <FormCard title="State Details">
        {isLoading ? (
          <Loader />
        ) : (
          <StateForm
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
