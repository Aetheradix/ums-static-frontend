import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { affiliationManagementSystemUrls } from 'features/affiliation-management-system/urls';
import AvailableFacilityForm from '../components/AvailableFacilityForm';
import { useCreateAvailableFacilityMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateAvailableFacilityMutation();

  const handleBack = useCallback(() => {
    navigate(affiliationManagementSystemUrls.availableFacility.root);
  }, [navigate]);

  async function handleSubmit(data: CollegeMaster.AvailableFacilityForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Available Facility created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create Available Facility');
    }
  }

  return (
    <FormPage
      title="Create Available Facility"
      description="Fill in the details to add a new Available Facility."
    >
      <FormCard title="Available Facility Details">
        <AvailableFacilityForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
