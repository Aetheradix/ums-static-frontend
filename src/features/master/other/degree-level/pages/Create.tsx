import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DegreeLevelForm from '../components/DegreeLevelForm';
import { useCreateDegreeLevelMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateDegreeLevelMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.degreeLevel.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Other.DegreeLevelForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Degree level created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create degree level.');
    }
  }

  return (
    <FormPage
      title="Create Degree Level"
      description="Fill in the details to add a new degree level."
    >
      <FormCard title="Degree Level Details">
        <DegreeLevelForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
