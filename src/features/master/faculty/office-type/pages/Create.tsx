import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import OfficeTypeForm from '../components/OfficeTypeForm';
import { useCreateOfficeTypeMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateOfficeTypeMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.officeType.root);
  }, [navigate]);

  async function handleSubmit(data: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Office Type created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create office type');
    }
  }

  return (
    <FormPage
      title="Create Office Type"
      description="Fill in the details to add a new office type."
    >
      <FormCard title="Office Type Details">
        <OfficeTypeForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
