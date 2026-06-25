import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import CollegeCategoryForm from '../components/CollegeCategoryForm';
import { useCreateCollegeCategoryMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCollegeCategoryMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.collegeCategory.root);
  }, [navigate]);

  async function handleSubmit(data: CollegeMaster.CollegeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Category created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create college category');
    }
  }

  return (
    <FormPage
      title="Create College Category"
      description="Fill in the details to add a new college category."
    >
      <FormCard title="College Category Details">
        <CollegeCategoryForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
