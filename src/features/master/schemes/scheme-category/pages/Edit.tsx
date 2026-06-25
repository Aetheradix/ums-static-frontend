import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeCategoryUrls } from '../urls';
import SchemeCategoryForm from '../components/SchemeCategoryForm';
import {
  useSchemeCategoryQuery,
  useUpdateSchemeCategoryMutation,
} from '../queries';

const schemeCategoryUrl = schemeCategoryUrls('/master/schemes');

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const schemeCategoryId = parseInt(id || '0', 10);

  const { data: formData } = useSchemeCategoryQuery(schemeCategoryId);
  const { mutateAsync, isPending } =
    useUpdateSchemeCategoryMutation(schemeCategoryId);

  const handleBack = useCallback(() => {
    navigate(schemeCategoryUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Category updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update scheme category');
    }
  }

  const fetchData = async (): Promise<Master.Scheme.SchemeCategoryForm> => {
    if (formData) {
      return { ...formData, isActive: formData.isActive ?? true };
    }
    return { name: '', schemeTypeId: 0, isActive: true };
  };

  return (
    <FormPage
      title="Edit Scheme Category"
      description="Update the scheme category details."
    >
      <FormCard title="Scheme Category Details">
        <SchemeCategoryForm
          onSubmit={handleSubmit}
          fetchData={fetchData}
          isSaving={isPending}
          isEditMode={true}
        />
      </FormCard>
    </FormPage>
  );
}
