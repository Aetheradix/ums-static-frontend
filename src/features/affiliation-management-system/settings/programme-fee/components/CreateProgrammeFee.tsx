import { ToastService } from 'services';
import { useCreateProgrammeFeeMutation } from '../queries';
import ProgrammeFeeForm from './ProgrammeFeeForm';

interface CreateProgrammeFeeProps {
  onClose: () => void;
}

export default function CreateProgrammeFee({
  onClose,
}: CreateProgrammeFeeProps) {
  const { mutateAsync, isPending } = useCreateProgrammeFeeMutation();

  async function handleSubmit(data: AffiliationMaster.ProgrammeFeeForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Programme fee created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create programme fee.');
    }
  }

  return <ProgrammeFeeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
