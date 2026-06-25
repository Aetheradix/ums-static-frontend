import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeTypeUrls } from '../urls';
import SchemeTypeForm from '../components/SchemeTypeForm';
import { useCreateSchemeTypeMutation } from '../queries';

const schemeTypeUrl = schemeTypeUrls('/master/schemes');

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateSchemeTypeMutation();

  const handleBack = useCallback(() => {
    navigate(schemeTypeUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Type created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create scheme type');
    }
  }

  return (
    <FormPage
      title="Create Scheme Type"
      description="Fill in the details to add a new scheme type."
    >
      <FormCard title="Scheme Type Details">
        <SchemeTypeForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
