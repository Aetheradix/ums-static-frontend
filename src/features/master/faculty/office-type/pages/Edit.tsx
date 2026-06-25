import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import OfficeTypeForm from '../components/OfficeTypeForm';
import { useOfficeTypeQuery, useUpdateOfficeTypeMutation } from '../queries';

const DEFAULT = {
  code: '',
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateOfficeTypeMutation(id);
  const { data = DEFAULT, isLoading } = useOfficeTypeQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.officeType.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Office Type updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update office type');
    }
  }

  return (
    <FormPage
      title="Edit Office Type"
      description="Update the details of the office type."
    >
      <FormCard title="Office Type Details">
        {isLoading ? (
          <Loader />
        ) : (
          <OfficeTypeForm
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
