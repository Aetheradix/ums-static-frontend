import { ToastService } from 'services';
import { useCreateTravelPurposeMutation } from '../queries';
import TravelPurposeForm from './TravelPurposeForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateTravelPurpose({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateTravelPurposeMutation();

  async function handleSubmit(data: Master.Employee.TravelPurposeForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Travel purpose created successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to create travel purpose.');
    }
  }

  return <TravelPurposeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
