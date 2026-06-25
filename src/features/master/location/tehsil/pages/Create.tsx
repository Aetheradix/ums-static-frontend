import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import TehsilForm from '../components/TehsilForm';
import { useCreateTehsilMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTehsilMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.tehsil.root);
  }, [navigate]);

  async function handleSubmit(data: Master.TehsilForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Tehsil created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create tehsil');
    }
  }

  return (
    <FormPage
      title="Create Tehsil"
      description="Fill in the details to add a new tehsil."
    >
      <FormCard title="Tehsil Details">
        <TehsilForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
