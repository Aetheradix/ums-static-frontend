import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import BlockForm from '../components/BlockForm';
import { useBlockQuery, useUpdateBlockMutation } from '../queries';

const DEFAULT: Master.BlockForm = {
  code: '',
  name: '',
  districtId: 0,
  tehsilId: 0,
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateBlockMutation(id);
  const { data = DEFAULT, isLoading } = useBlockQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.block.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.BlockForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Block updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update block');
    }
  }

  return (
    <FormPage title="Edit Block" description="Update the details of the block.">
      <FormCard title="Block Details">
        {isLoading ? (
          <Loader />
        ) : (
          <BlockForm
            fetchData={data}
            isSaving={isPending}
            isEditMode
            onSubmit={handleSubmit}
          />
        )}
      </FormCard>
    </FormPage>
  );
}
