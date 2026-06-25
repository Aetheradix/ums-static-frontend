import { ToastService } from 'services';
import { useCreateSubjectSpecializationMutation } from '../queries';
import SubjectSpecializationForm from './SubjectSpecializationForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateSubjectSpecialization(props: CreateProps) {
  const { mutateAsync, isPending } = useCreateSubjectSpecializationMutation();

  async function handleSubmit(data: Master.Employee.SubjectSpecializationForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Subject specialization created successfully.');

        props.onClose();
      }
    } catch {
      ToastService.error('Failed to create subject specialization.');
    }
  }

  return (
    <SubjectSpecializationForm onSubmit={handleSubmit} isSaving={isPending} />
  );
}
