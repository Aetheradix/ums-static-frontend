import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import TehsilForm from '../components/TehsilForm';
import { useTehsilQuery, useUpdateTehsilMutation } from '../queries';

const DEFAULT: Master.TehsilForm = {
  code: '',
  name: '',
  districtId: 0,
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateTehsilMutation(id);
  const { data = DEFAULT, isLoading } = useTehsilQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.tehsil.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.TehsilForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Tehsil updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update tehsil');
    }
  }

  return (
    <FormPage
      title="Edit Tehsil"
      description="Update the details of the tehsil."
    >
      <FormCard title="Tehsil Details">
        {isLoading ? (
          <Loader />
        ) : (
          <TehsilForm
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
