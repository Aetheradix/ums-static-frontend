import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeTypeUrls } from '../urls';
import SchemeTypeForm from '../components/SchemeTypeForm';
import { useSchemeTypeQuery, useUpdateSchemeTypeMutation } from '../queries';

const schemeTypeUrl = schemeTypeUrls('/master/schemes');

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const schemeTypeId = parseInt(id || '0', 10);

  const { data: formData } = useSchemeTypeQuery(schemeTypeId);
  const { mutateAsync, isPending } = useUpdateSchemeTypeMutation(schemeTypeId);

  const handleBack = useCallback(() => {
    navigate(schemeTypeUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Type updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update scheme type');
    }
  }

  const fetchData = async (): Promise<Master.Scheme.SchemeTypeForm> => {
    if (formData) {
      return { ...formData, isActive: formData.isActive ?? true };
    }
    return { name: '', isActive: true };
  };

  return (
    <FormPage
      title="Edit Scheme Type"
      description="Update the scheme type details."
    >
      <FormCard title="Scheme Type Details">
        <SchemeTypeForm
          onSubmit={handleSubmit}
          fetchData={fetchData}
          isSaving={isPending}
          isEditMode={true}
        />
      </FormCard>
    </FormPage>
  );
}
