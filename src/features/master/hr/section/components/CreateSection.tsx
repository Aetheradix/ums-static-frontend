import { ToastService } from 'services';
import { useCreateSectionMutation } from '../queries';
import SectionForm from './SectionForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateSection({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateSectionMutation();

  async function handleSubmit(data: Master.HR.SectionForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Section created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create section.');
    }
  }

  return <SectionForm onSubmit={handleSubmit} isSaving={isPending} />;
}
