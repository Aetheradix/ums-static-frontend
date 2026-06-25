import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useDesignationQuery, useUpdateDesignationMutation } from '../queries';
import DesignationForm from './DesignationForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditDesignation({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateDesignationMutation(id);
  const { data, isLoading } = useDesignationQuery(id);
  const DEFAULT: Master.HR.DesignationForm = {
    classId: 0,
    postId: 0,
    designationTypeId: 0,
    name: '',
    code: '',
    sequenceNumber: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.HR.DesignationForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Designation updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update designation.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DesignationForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
