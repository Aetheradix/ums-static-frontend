import { Loader } from 'shared/components/progress';
import NatureOfEmploymentForm from './NatureOfEmploymentForm';
import { ToastService } from 'services';
import {
  useGetEmploymentNatureByIdQuery,
  useUpdateEmploymentNatureMutation,
} from '../queries';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditNatureOfEmployment({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateEmploymentNatureMutation(id);

  const { data, isLoading } = useGetEmploymentNatureByIdQuery(id);

  const DEFAULT: Master.Employee.EmploymentNatureForm = {
    name: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.EmploymentNatureForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employment nature updated successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to update employment nature.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <NatureOfEmploymentForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
