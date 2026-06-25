import { ToastService } from 'services';
import { useCreateClassMutation } from '../queries';
import ClassForm from './ClassForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateClass({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateClassMutation();

  async function handleSubmit(data: Master.HR.ClassForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Class created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create class.');
    }
  }

  return <ClassForm onSubmit={handleSubmit} isSaving={isPending} />;
}
