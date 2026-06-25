import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetTravelPurposeByIdQuery,
  useUpdateTravelPurposeMutation,
} from '../queries';
import TravelPurposeForm from './TravelPurposeForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditTravelPurpose({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateTravelPurposeMutation(id);

  const { data, isLoading } = useGetTravelPurposeByIdQuery(id);

  const DEFAULT: Master.Employee.TravelPurposeForm = {
    name: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.TravelPurposeForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Travel purpose updated successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to update travel purpose.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <TravelPurposeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
