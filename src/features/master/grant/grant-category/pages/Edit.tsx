import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import GrantCategoryForm from '../components/GrantCategoryForm';
import {
  useGrantCategoryQuery,
  useUpdateGrantCategoryMutation,
} from '../queries';

const DEFAULT = {
  name: '',
  grantTypeId: 0,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateGrantCategoryMutation(id);
  const { data = DEFAULT, isLoading } = useGrantCategoryQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.grantCategory.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: Master.Grant.GrantCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Category updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update grant category');
    }
  }

  return (
    <FormPage
      title="Edit Grant Category"
      description="Update the grant category details."
    >
      <FormCard title="Grant Category Details">
        <GrantCategoryForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
