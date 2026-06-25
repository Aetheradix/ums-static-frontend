import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DivisionForm from '../components/DivisionForm';
import { useCreateDivisionMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateDivisionMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.division.root);
  }, [navigate]);

  async function handleSubmit(data: Master.DivisionForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Division created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create division');
    }
  }

  return (
    <FormPage
      title="Create Division"
      description="Fill in the details to add a new division."
    >
      <FormCard title="Division Details">
        <DivisionForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
