import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import StateForm from '../components/StateForm';
import { useCreateStateMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateStateMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.state.root);
  }, [navigate]);

  async function handleSubmit(data: Master.StateForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('State created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create state');
    }
  }

  return (
    <FormPage
      title="Create State"
      description="Fill in the details to add a new state."
    >
      <FormCard
        title="State Details"
        subtitle="Provide the basic information for the new state."
        icon="map"
      >
        <StateForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
