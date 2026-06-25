import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useSectionQuery, useUpdateSectionMutation } from '../queries';
import SectionForm from './SectionForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditSection({ id, onClose }: EditProps) {
  const { mutateAsync, isPending } = useUpdateSectionMutation(id);
  const { data, isLoading } = useSectionQuery(id);
  const DEFAULT: Master.HR.SectionForm = {
    name: '',
    code: '',
    isActive: true,
  };

  async function handleSubmit(formData: Master.HR.SectionForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Section updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update section.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SectionForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
