import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import GrantTypeForm from '../components/GrantTypeForm';
import { useGrantTypeQuery, useUpdateGrantTypeMutation } from '../queries';

const DEFAULT = {
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateGrantTypeMutation(id);
  const { data = DEFAULT, isLoading } = useGrantTypeQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.grantType.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: Master.Grant.GrantTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Type updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update grant type');
    }
  }

  return (
    <FormPage
      title="Edit Grant Type"
      description="Update the grant type details."
    >
      <FormCard title="Grant Type Details">
        <GrantTypeForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
