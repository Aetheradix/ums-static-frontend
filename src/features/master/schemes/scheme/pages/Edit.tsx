import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeUrls } from '../urls';
import SchemeForm from '../components/SchemeForm';
import { useSchemeQuery, useUpdateSchemeMutation } from '../queries';

const schemeUrl = schemeUrls('/master/schemes');

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const schemeId = parseInt(id || '0', 10);

  const { data: formData } = useSchemeQuery(schemeId);
  const { mutateAsync, isPending } = useUpdateSchemeMutation(schemeId);

  const handleBack = useCallback(() => {
    navigate(schemeUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update scheme');
    }
  }

  const fetchData = async (): Promise<Master.Scheme.SchemeForm> => {
    if (formData) {
      return { ...formData, isActive: formData.isActive ?? true };
    }
    return {
      name: '',
      code: '',
      schemeTypeId: 0,
      schemeCategoryId: 0,
      isActive: true,
    };
  };

  return (
    <FormPage title="Edit Scheme" description="Update the scheme details.">
      <FormCard title="Scheme Details">
        <SchemeForm
          onSubmit={handleSubmit}
          fetchData={fetchData}
          isSaving={isPending}
          isEditMode={true}
        />
      </FormCard>
    </FormPage>
  );
}
