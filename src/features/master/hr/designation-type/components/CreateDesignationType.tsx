import { ToastService } from 'services';
import { useCreateDesignationTypeMutation } from '../queries';
import DesignationTypeForm from './DesignationTypeForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateDesignationType({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateDesignationTypeMutation();

  async function handleSubmit(data: Master.HR.DesignationTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Designation Type created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create designation type.');
    }
  }

  return <DesignationTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
