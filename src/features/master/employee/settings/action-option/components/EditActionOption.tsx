import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetActionOptionByIdQuery,
  useUpdateActionOptionMutation,
} from '../queries';
import ActionOptionForm from './ActionOptionForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditActionOption({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateActionOptionMutation(id);

  const { data, isLoading } = useGetActionOptionByIdQuery(id);

  const DEFAULT: Master.Employee.ActionOptionForm = {
    name: '',
    description: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.ActionOptionForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Action option updated successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to update action option.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ActionOptionForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
