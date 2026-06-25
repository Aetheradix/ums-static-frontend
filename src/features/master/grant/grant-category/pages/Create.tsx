import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import GrantCategoryForm from '../components/GrantCategoryForm';
import { useCreateGrantCategoryMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateGrantCategoryMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.grantCategory.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Grant.GrantCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Category created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create grant category');
    }
  }

  return (
    <FormPage
      title="Create Grant Category"
      description="Fill in the details to add a new grant category."
    >
      <FormCard title="Grant Category Details">
        <GrantCategoryForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
