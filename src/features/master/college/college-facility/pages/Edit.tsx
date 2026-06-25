import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { affiliationManagementSystemUrls } from 'features/affiliation-management-system/urls';
import CollegeCategoryForm from '../components/AvailableFacilityForm';
import {
  useAvailableFacilityQuery,
  useUpdateAvailableFacilityMutation,
} from '../queries';

const DEFAULT = {
  facilityName: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateAvailableFacilityMutation(id);
  const { data = DEFAULT, isLoading } = useAvailableFacilityQuery(id);

  const handleBack = useCallback(() => {
    navigate(affiliationManagementSystemUrls.availableFacility.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: CollegeMaster.AvailableFacilityForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Available Facility updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update Available Facility');
    }
  }

  return (
    <FormPage
      title="Edit Available Facility"
      description="Update the Available Facility details."
    >
      <FormCard title="Available Facility Details">
        <CollegeCategoryForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
