import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useActionOptionReasonQuery,
  useUpdateActionOptionReasonMutation,
} from '../queries';
import ActionOptionReasonForm from './ActionOptionReasonForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditActionOptionReason({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateActionOptionReasonMutation(id);

  const { data, isLoading } = useActionOptionReasonQuery(id);

  const DEFAULT: Master.Employee.ActionOptionReasonForm = {
    actionOptionId: 0,
    actionOptionName: '',
    name: '',
    description: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.ActionOptionReasonForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Action option reason updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update action option reason.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ActionOptionReasonForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
