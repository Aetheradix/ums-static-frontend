import { ToastService } from 'services';
import { useCreateDesignationMutation } from '../queries';
import DesignationForm from './DesignationForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateDesignation({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateDesignationMutation();

  async function handleSubmit(data: Master.HR.DesignationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Designation created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create designation.');
    }
  }

  return <DesignationForm onSubmit={handleSubmit} isSaving={isPending} />;
}
