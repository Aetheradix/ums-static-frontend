import { ToastService } from 'services';
import { useCreateProgrammeModeOfEducationMutation } from '../queries';
import ProgrammeModeOfEducationForm from './ProgrammeModeOfEducationForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateProgrammeModeOfEducation({
  onClose,
}: CreateProps) {
  const { mutateAsync, isPending } =
    useCreateProgrammeModeOfEducationMutation();

  async function handleSubmit(
    data: Master.SubjectMaster.ProgrammeModeOfEducationForm
  ) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success(
          'Programme Mode of Education created successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error('Failed to create Programme Mode of Education');
    }
  }

  return (
    <ProgrammeModeOfEducationForm
      onSubmit={handleSubmit}
      isSaving={isPending}
    />
  );
}
