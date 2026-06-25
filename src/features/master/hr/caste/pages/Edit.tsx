import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import CasteForm from '../components/CasteForm';
import { useCasteQuery, useUpdateCasteMutation } from '../queries';

const DEFAULT: Master.HR.CasteForm = {
  name: '',
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateCasteMutation(id);
  const { data = DEFAULT, isLoading } = useCasteQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.caste.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.HR.CasteForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Caste updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update caste');
    }
  }

  return (
    <FormPage title="Edit Caste" description="Update the details of the caste.">
      <FormCard title="Caste Details">
        {isLoading ? (
          <Loader />
        ) : (
          <CasteForm
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
