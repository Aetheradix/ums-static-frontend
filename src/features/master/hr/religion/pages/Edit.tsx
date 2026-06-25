import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import ReligionForm from '../components/ReligionForm';
import { useReligionQuery, useUpdateReligionMutation } from '../queries';

const DEFAULT: Master.HR.ReligionForm = {
  name: '',
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateReligionMutation(id);
  const { data = DEFAULT, isLoading } = useReligionQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.religion.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.HR.ReligionForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Religion updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update religion');
    }
  }

  return (
    <FormPage
      title="Edit Religion"
      description="Update the details of the religion."
    >
      <FormCard title="Religion Details">
        {isLoading ? (
          <Loader />
        ) : (
          <ReligionForm
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
