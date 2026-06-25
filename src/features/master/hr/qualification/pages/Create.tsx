import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import QualificationForm from '../components/QualificationForm';
import { useCreateQualificationMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateQualificationMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.qualification.root);
  }, [navigate]);

  async function handleSubmit(data: Master.HR.QualificationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Qualification created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create qualification');
    }
  }

  return (
    <FormPage
      title="Create Qualification"
      description="Fill in the details to add a new qualification."
    >
      <FormCard title="Qualification Details">
        <QualificationForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
