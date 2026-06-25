import { ToastService } from 'services';
import SubjectCategoryForm from '../components/SubjectCategoryForm';
import { useCreateSubjectCategoryMutation } from '../queries';

interface CreateProps {
  onClose: () => void;
}

export default function CreateCategory({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateSubjectCategoryMutation();

  async function handleSubmit(data: Master.SubjectMaster.SubjectCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Subject Category created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create subject category.');
    }
  }

  return <SubjectCategoryForm onSubmit={handleSubmit} isSaving={isPending} />;
}
