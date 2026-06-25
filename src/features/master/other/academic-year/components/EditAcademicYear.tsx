import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetAcademicYearByIdQuery,
  useUpdateAcademicYearMutation,
} from '../queries';
import AcademicYearForm from './AcademicYearForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditAcademicYear({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateAcademicYearMutation(id);
  const { data, isLoading } = useGetAcademicYearByIdQuery(id);

  const DEFAULT: Master.Other.AcademicYearForm = {
    name: '',
    session: '',
    isActive: true,
  };

  async function handleSubmit(data: Master.Other.AcademicYearForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Academic year updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update academic year.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <AcademicYearForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
