import { ToastService } from 'services';
import { useCreateActionOptionReasonMutation } from '../queries';
import ActionOptionReasonForm from './ActionOptionReasonForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateActionOptionReason({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateActionOptionReasonMutation();

  async function handleSubmit(data: Master.Employee.ActionOptionReasonForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Action option reason created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create action option reason.');
    }
  }

  return (
    <ActionOptionReasonForm onSubmit={handleSubmit} isSaving={isPending} />
  );
}
