import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetSeparationReasonTypeByIdQuery,
  useUpdateSeparationReasonTypeMutation,
} from '../queries';
import SeparationReasonTypeForm from './SeparationReasonTypeForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditSeparationReasonType({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateSeparationReasonTypeMutation(id);

  const { data, isLoading } = useGetSeparationReasonTypeByIdQuery(id);

  const DEFAULT: Master.Employee.SeparationReasonTypeForm = {
    name: '',
    type: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.SeparationReasonTypeForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Separation reason updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update separation reason.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SeparationReasonTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
