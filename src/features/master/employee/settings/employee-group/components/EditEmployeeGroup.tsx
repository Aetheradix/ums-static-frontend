import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetEmployeeGroupByIdQuery,
  useUpdateEmployeeGroupMutation,
} from '../queries';
import EmployeeGroupForm from './EmployeeGroupForm';

interface EditEmployeeGroupProps {
  id: number;
  onClose: () => void;
}

export default function EditEmployeeGroup({
  id,
  onClose,
}: EditEmployeeGroupProps) {
  const { mutateAsync, isPending } = useUpdateEmployeeGroupMutation(id);

  const { data, isLoading } = useGetEmployeeGroupByIdQuery(id);

  const DEFAULT: Master.Employee.EmployeeGroupForm = {
    name: '',
    description: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.EmployeeGroupForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employee group updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update employee group.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <EmployeeGroupForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
