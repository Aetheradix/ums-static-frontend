import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import DistrictForm from '../components/DistrictForm';
import { useDistrictQuery, useUpdateDistrictMutation } from '../queries';

const DEFAULT: Master.DistrictForm = {
  code: '',
  name: '',
  divisionId: 0,
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateDistrictMutation(id);
  const { data = DEFAULT, isLoading } = useDistrictQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.district.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.DistrictForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('District updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update district');
    }
  }

  return (
    <FormPage
      title="Edit District"
      description="Update the details of the district."
    >
      <FormCard title="District Details">
        {isLoading ? (
          <Loader />
        ) : (
          <DistrictForm
            fetchData={data}
            isSaving={isPending}
            isEditMode
            onSubmit={handleSubmit}
          />
        )}
      </FormCard>
    </FormPage>
  );
}
