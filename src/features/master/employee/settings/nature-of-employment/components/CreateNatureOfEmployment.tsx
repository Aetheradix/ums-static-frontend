import { ToastService } from 'services';
import { useCreateEmploymentNatureMutation } from '../queries';
import NatureOfEmploymentForm from './NatureOfEmploymentForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateNatureOfEmployment({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateEmploymentNatureMutation();

  async function handleSubmit(data: Master.Employee.EmploymentNatureForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employment nature created successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to create employment nature.');
    }
  }

  return (
    <NatureOfEmploymentForm onSubmit={handleSubmit} isSaving={isPending} />
  );
}
