import { useAppForm } from 'shared/hooks/form';
import type { SessionStatus } from '../../mocks';

export interface SetupFormData {
  name: string;
  code: string;
  academicYear: string;
  startDate?: Date;
  endDate?: Date;
  periodsPerDay: number;
  examWindowStart?: Date;
  examWindowEnd?: Date;
  status: SessionStatus;
  remarks?: string;
}

export function useSetupForm(
  submitCallback: Forms.SubmitFunc<SetupFormData>,
  initialData?: Partial<SetupFormData>
) {
  const defaultValues: Partial<SetupFormData> = {
    status: 'Draft',
    periodsPerDay: 8,
    ...initialData,
  };

  const { register, handleSubmit, reset, watch, trigger, setValue } =
    useAppForm<SetupFormData>({ defaultValues });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    trigger,
    setValue,
  };
}
