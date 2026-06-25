import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { schemeUrls } from '../urls';
import SchemeForm from '../components/SchemeForm';
import { useCreateSchemeMutation } from '../queries';

const schemeUrl = schemeUrls('/master/schemes');

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateSchemeMutation();

  const handleBack = useCallback(() => {
    navigate(schemeUrl.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Scheme.SchemeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create scheme');
    }
  }

  return (
    <FormPage
      title="Create Scheme"
      description="Fill in the details to add a new scheme."
    >
      <FormCard title="Scheme Details">
        <SchemeForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
