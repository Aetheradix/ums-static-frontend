import { ToastService } from 'services';
import { useCreateActionOptionMutation } from '../queries';
import ActionOptionForm from './ActionOptionForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateActionOption({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateActionOptionMutation();

  async function handleSubmit(data: Master.Employee.ActionOptionForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Action option created successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to create action option.');
    }
  }

  return <ActionOptionForm onSubmit={handleSubmit} isSaving={isPending} />;
}
