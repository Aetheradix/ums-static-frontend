import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useProgrammeSpecializationStructureQuery,
  useUpdateProgrammeSpecializationStructureMutation,
} from '../queries';
import ProgrammeSpecializationStructureForm from './ProgrammeSpecializationStructureForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditProgrammeSpecializationStructure({
  id,
  onClose,
}: EditProps) {
  const { mutateAsync, isPending } =
    useUpdateProgrammeSpecializationStructureMutation(id);
  const { data, isLoading } = useProgrammeSpecializationStructureQuery(id);
  const DEFAULT: Master.SubjectMaster.ProgrammeSpecializationStructureForm = {
    programmeId: 0,
    specializationId: 0,
    modeOfEducationId: 0,
    semesterName: '',
    subjectId: 0,
    lectureStructure: 0,
    tutorialStructure: 0,
    practicalStructure: 0,
    totalCredits: 0,
    isActive: true,
  };

  async function handleSubmit(
    formData: Master.SubjectMaster.ProgrammeSpecializationStructureForm
  ) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success(
          'Programme Specialization Structure updated successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error(
        'Failed to update programme specialization structure.'
      );
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ProgrammeSpecializationStructureForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
