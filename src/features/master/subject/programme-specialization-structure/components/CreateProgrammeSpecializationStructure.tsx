import { ToastService } from 'services';
import { useCreateProgrammeSpecializationStructureMutation } from '../queries';
import ProgrammeSpecializationStructureForm from './ProgrammeSpecializationStructureForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateProgrammeSpecializationStructure({
  onClose,
}: CreateProps) {
  const { mutateAsync, isPending } =
    useCreateProgrammeSpecializationStructureMutation();

  async function handleSubmit(
    data: Master.SubjectMaster.ProgrammeSpecializationStructureForm
  ) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success(
          'Programme Specialization Structure created successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error(
        'Failed to create programme specialization structure.'
      );
    }
  }

  return (
    <ProgrammeSpecializationStructureForm
      onSubmit={handleSubmit}
      isSaving={isPending}
    />
  );
}
