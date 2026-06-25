import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DistrictForm from '../components/DistrictForm';
import { useCreateDistrictMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateDistrictMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.district.root);
  }, [navigate]);

  async function handleSubmit(data: Master.DistrictForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('District created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create district');
    }
  }

  return (
    <FormPage
      title="Create District"
      description="Fill in the details to add a new district."
    >
      <FormCard title="District Details">
        <DistrictForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
