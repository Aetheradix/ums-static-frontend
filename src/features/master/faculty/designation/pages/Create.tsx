import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DesignationForm from '../components/DesignationForm';
import { useCreateDesignationMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateDesignationMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.designation.root);
  }, [navigate]);

  async function handleSubmit(data: Master.DesignationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Designation created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create designation');
    }
  }

  return (
    <FormPage
      title="Create Designation"
      description="Fill in the details to add a new designation."
    >
      <FormCard title="Designation Details">
        <DesignationForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
