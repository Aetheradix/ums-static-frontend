import { ToastService } from 'services';
import { useCreateOrganizationUnitMutation } from '../queries';
import OrganizationUnitForm from './OrganizationUnitForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateOrganizationUnit({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateOrganizationUnitMutation();

  async function handleSubmit(data: Master.Employee.OrganizationUnitForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Organization unit created successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to create organization unit.');
    }
  }

  return <OrganizationUnitForm onSubmit={handleSubmit} isSaving={isPending} />;
}
