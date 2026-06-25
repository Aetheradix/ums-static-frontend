import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import BlockForm from '../components/BlockForm';
import { useCreateBlockMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateBlockMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.block.root);
  }, [navigate]);

  async function handleSubmit(data: Master.BlockForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Block created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create block');
    }
  }

  return (
    <FormPage
      title="Create Block"
      description="Fill in the details to add a new block."
    >
      <FormCard title="Block Details">
        <BlockForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
