import { useAppForm } from 'shared/hooks/form';
import type { CaseStatus } from '../../mocks';

export interface CaseFormData {
  caseNumber: string;
  title: string;
  subject: string;
  brief: string;
  courtId: number;
  caseTypeId: number;
  partyTypeId: number;
  advocateId: number;
  filingDate?: Date;
  counterAffidavitDate?: Date;
  disposalDate?: Date;
  status: CaseStatus;
  judgmentDoc?: string;
  remarks?: string;
}

export function useCaseForm(
  submitCallback: Forms.SubmitFunc<CaseFormData>,
  initialData?: Partial<CaseFormData>
) {
  const defaultValues: Partial<CaseFormData> = {
    status: 'Pending',
    ...initialData,
  };

  const { register, handleSubmit, reset, watch, trigger, setValue } =
    useAppForm<CaseFormData>({ defaultValues });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    trigger,
    setValue,
  };
}
