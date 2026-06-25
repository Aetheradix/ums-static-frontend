import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import GrantTypeForm from '../components/GrantTypeForm';
import { useCreateGrantTypeMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateGrantTypeMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.grantType.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Grant.GrantTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Type created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create grant type');
    }
  }

  return (
    <FormPage
      title="Create Grant Type"
      description="Fill in the details to add a new grant type."
    >
      <FormCard title="Grant Type Details">
        <GrantTypeForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
