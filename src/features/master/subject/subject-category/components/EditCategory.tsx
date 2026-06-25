import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import SubjectCategoryForm from '../components/SubjectCategoryForm';
import {
  useSubjectCategoryQuery,
  useUpdateSubjectCategoryMutation,
} from '../queries';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditCategory({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateSubjectCategoryMutation(id);
  const { data, isLoading } = useSubjectCategoryQuery(id);

  const DEFAULT: Master.SubjectMaster.SubjectCategoryForm = {
    code: '',
    name: '',
    isActive: true,
  };

  async function handleSubmit(
    formData: Master.SubjectMaster.SubjectCategoryForm
  ) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Subject Category updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update subject category.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SubjectCategoryForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
