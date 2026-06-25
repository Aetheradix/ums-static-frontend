import { ToastService } from 'services';
import { useCreateAcademicYearMutation } from '../queries';
import AcademicYearForm from './AcademicYearForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateAcademicYear({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateAcademicYearMutation();

  async function handleSubmit(data: Master.Other.AcademicYearForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Academic year created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create academic year.');
    }
  }

  return <AcademicYearForm onSubmit={handleSubmit} isSaving={isPending} />;
}
