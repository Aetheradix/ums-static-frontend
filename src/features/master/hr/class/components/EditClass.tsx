import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useClassQuery, useUpdateClassMutation } from '../queries';
import ClassForm from './ClassForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditClass({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateClassMutation(id);
  const { data, isLoading } = useClassQuery(id);
  const DEFAULT: Master.HR.ClassForm = {
    name: '',
    code: '',
    isActive: true,
  };

  async function handleSubmit(formData: Master.HR.ClassForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Class updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update class.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ClassForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
