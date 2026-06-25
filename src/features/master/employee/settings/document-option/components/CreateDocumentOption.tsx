import { ToastService } from 'services';
import { useCreateDocumentOptionMutation } from '../queries';
import DocumentOptionForm from './DocumentOptionForm';

interface CreateProps {
  onClose: () => void;
}

export default function CreateDocumentOption({ onClose }: CreateProps) {
  const { mutateAsync, isPending } = useCreateDocumentOptionMutation();

  async function handleSubmit(data: Master.Employee.DocumentOptionsForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Document option created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create document option.');
    }
  }

  return <DocumentOptionForm onSubmit={handleSubmit} isSaving={isPending} />;
}
