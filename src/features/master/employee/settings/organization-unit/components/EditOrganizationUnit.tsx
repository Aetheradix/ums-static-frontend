import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetOrganizationUnitByIdQuery,
  useUpdateOrganizationUnitMutation,
} from '../queries';
import OrganizationUnitForm from './OrganizationUnitForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditOrganizationUnit({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateOrganizationUnitMutation(id);

  const { data, isLoading } = useGetOrganizationUnitByIdQuery(id);

  const DEFAULT: Master.Employee.OrganizationUnitForm = {
    name: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Employee.OrganizationUnitForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Organization unit updated successfully.');

        onClose();
      }
    } catch {
      ToastService.error('Failed to update organization unit.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <OrganizationUnitForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
