import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetSubjectSpecializationByIdQuery,
  useUpdateSubjectSpecializationMutation,
} from '../queries';
import SubjectSpecializationForm from './SubjectSpecializationForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditSubjectSpecialization(props: EditProps) {
  const { mutateAsync, isPending } = useUpdateSubjectSpecializationMutation(
    props.id
  );

  const { data, isLoading } = useGetSubjectSpecializationByIdQuery(props.id);

  const DEFAULT: Master.Employee.SubjectSpecializationForm = {
    name: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.SubjectSpecializationForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Subject specialization updated successfully.');

        props.onClose();
      }
    } catch {
      ToastService.error('Failed to update subject specialization.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SubjectSpecializationForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
