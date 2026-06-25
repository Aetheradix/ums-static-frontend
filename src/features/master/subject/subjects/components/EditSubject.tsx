import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useSubjectQuery, useUpdateSubjectMutation } from '../queries';
import SubjectForm from './SubjectForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditSubject({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateSubjectMutation(id);
  const { data, isLoading } = useSubjectQuery(id);
  const DEFAULT: Master.SubjectMaster.SubjectForm = {
    subjectCode: '',
    subjectName: '',
    categoryId: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.SubjectMaster.SubjectForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Subject updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update subject.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SubjectForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
