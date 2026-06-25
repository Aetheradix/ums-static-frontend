import { ToastService } from 'services';
import { useCreateNationalityMutation } from '../queries';
import NationalityForm from './NationalityForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateNationality({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateNationalityMutation();

  async function handleSubmit(data: Master.Other.NationalityForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Nationality created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create nationality.');
    }
  }

  return <NationalityForm onSubmit={handleSubmit} isSaving={isPending} />;
}
