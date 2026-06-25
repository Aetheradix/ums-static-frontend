import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useProgrammeModeOfEducationQuery,
  useUpdateProgrammeModeOfEducationMutation,
} from '../queries';
import ProgrammeModeOfEducationForm from './ProgrammeModeOfEducationForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditProgrammeModeOfEducation({
  id,
  onClose,
}: EditProps) {
  const { mutateAsync, isPending } =
    useUpdateProgrammeModeOfEducationMutation(id);
  const { data, isLoading } = useProgrammeModeOfEducationQuery(id);
  const DEFAULT: Master.SubjectMaster.ProgrammeModeOfEducationForm = {
    code: '',
    name: '',
    isActive: true,
  };
  async function handleSubmit(
    formData: Master.SubjectMaster.ProgrammeModeOfEducationForm
  ) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success(
          'Programme Mode of Education updated successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error('Failed to update Programme Mode of Education');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ProgrammeModeOfEducationForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
