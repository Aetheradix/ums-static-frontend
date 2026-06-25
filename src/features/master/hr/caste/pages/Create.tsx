import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import CasteForm from '../components/CasteForm';
import { useCreateCasteMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCasteMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.caste.root);
  }, [navigate]);

  async function handleSubmit(data: Master.HR.CasteForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Caste created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create caste');
    }
  }

  return (
    <FormPage
      title="Create Caste"
      description="Fill in the details to add a new caste."
    >
      <FormCard title="Caste Details">
        <CasteForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
