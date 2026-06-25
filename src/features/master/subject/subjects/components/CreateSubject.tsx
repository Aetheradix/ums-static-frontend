import { ToastService } from 'services';
import { useCreateSubjectMutation } from '../queries';
import SubjectForm from './SubjectForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateSubject({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateSubjectMutation();

  async function handleSubmit(data: Master.SubjectMaster.SubjectForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Subject created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create subject.');
    }
  }

  return <SubjectForm onSubmit={handleSubmit} isSaving={isPending} />;
}
