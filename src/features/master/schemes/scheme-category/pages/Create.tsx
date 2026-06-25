import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeCategoryUrls } from '../urls';
import SchemeCategoryForm from '../components/SchemeCategoryForm';
import { useCreateSchemeCategoryMutation } from '../queries';

const schemeCategoryUrl = schemeCategoryUrls('/master/schemes');

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateSchemeCategoryMutation();

  const handleBack = useCallback(() => {
    navigate(schemeCategoryUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Category created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create scheme category');
    }
  }

  return (
    <FormPage
      title="Create Scheme Category"
      description="Fill in the details to add a new scheme category."
    >
      <FormCard title="Scheme Category Details">
        <SchemeCategoryForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
