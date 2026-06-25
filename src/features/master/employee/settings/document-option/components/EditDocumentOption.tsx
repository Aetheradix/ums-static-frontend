import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import {
  useGetDocumentOptionByIdQuery,
  useUpdateDocumentOptionMutation,
} from '../queries';
import DocumentOptionForm from './DocumentOptionForm';

interface EditProps {
  id: number;
  onClose: () => void;
}

export default function EditDocumentOption({ id, onClose }: EditProps) {
  const { data, isLoading } = useGetDocumentOptionByIdQuery(id);
  const { mutateAsync, isPending } = useUpdateDocumentOptionMutation(id);

  async function handleSubmit(dataForm: Master.Employee.DocumentOptionsForm) {
    try {
      const ok = await mutateAsync(dataForm);

      if (ok) {
        ToastService.success('Document option updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update document option.');
    }
  }

  if (isLoading || !data) return <Loader />;

  return (
    <DocumentOptionForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode
      fetchData={async () => ({
        name: data.name,
        isActive: data.isActive,
      })}
    />
  );
}
