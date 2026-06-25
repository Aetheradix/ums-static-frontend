import { ToastService } from 'services';
import { useCreateEmployeeGroupMutation } from '../queries';
import EmployeeGroupForm from './EmployeeGroupForm';

interface CreateEmployeeGroupProps {
  onClose: () => void;
}

export default function CreateEmployeeGroup({
  onClose,
}: CreateEmployeeGroupProps) {
  const { mutateAsync, isPending } = useCreateEmployeeGroupMutation();

  async function handleSubmit(data: Master.Employee.EmployeeGroupForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Employee group created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create employee group.');
    }
  }

  return <EmployeeGroupForm onSubmit={handleSubmit} isSaving={isPending} />;
}
