import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useNationalityQuery, useUpdateNationalityMutation } from '../queries';
import NationalityForm from './NationalityForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditNationality({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateNationalityMutation(id);
  const { data, isLoading } = useNationalityQuery(id);

  const DEFAULT = { name: '' };

  async function handleSubmit(formData: Master.Other.NationalityForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Nationality updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update nationality');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <NationalityForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
