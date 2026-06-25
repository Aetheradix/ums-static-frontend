import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import ReligionForm from '../components/ReligionForm';
import { useCreateReligionMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateReligionMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.religion.root);
  }, [navigate]);

  async function handleSubmit(data: Master.HR.ReligionForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Religion created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create religion');
    }
  }

  return (
    <FormPage
      title="Create Religion"
      description="Fill in the details to add a new religion."
    >
      <FormCard title="Religion Details">
        <ReligionForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
