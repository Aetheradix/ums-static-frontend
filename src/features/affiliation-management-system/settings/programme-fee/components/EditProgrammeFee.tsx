import { ToastService } from 'services';
import Loader from 'shared/components/progress/Loader';
import {
  useProgrammeFeeQuery,
  useUpdateProgrammeFeeMutation,
} from '../queries';
import ProgrammeFeeForm from './ProgrammeFeeForm';

interface EditProgrammeFeeProps {
  programmeFeeId: number;
  onClose: () => void;
}

export default function EditProgrammeFee({
  programmeFeeId,
  onClose,
}: EditProgrammeFeeProps) {
  const { mutateAsync, isPending } =
    useUpdateProgrammeFeeMutation(programmeFeeId);

  const { data, isLoading } = useProgrammeFeeQuery(programmeFeeId);

  const DEFAULT: AffiliationMaster.ProgrammeFeeForm = {
    programmeId: 0,
    programmeName: '',
    securityDepositAmount: 0,
    affiliationFee: 0,
    inspectionFee: 0,
    otherFee: 0,
    isActive: true,
  };

  async function handleSubmit(data: AffiliationMaster.ProgrammeFeeForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Programme fee updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update programme fee.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ProgrammeFeeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
