import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useDesignationTypeQuery,
  useUpdateDesignationTypeMutation,
} from '../queries';
import DesignationTypeForm from './DesignationTypeForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditDesignationType({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateDesignationTypeMutation(id);
  const { data, isLoading } = useDesignationTypeQuery(id);
  const DEFAULT: Master.HR.DesignationTypeForm = {
    name: '',
    code: '',
    isActive: true,
  };

  async function handleSubmit(formData: Master.HR.DesignationTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Designation Type updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update designation type.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DesignationTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
