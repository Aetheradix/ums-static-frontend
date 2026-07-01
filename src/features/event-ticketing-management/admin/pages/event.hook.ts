import { useAppForm } from 'shared/hooks/form';
import type { EventStatus, Speaker } from '../../mocks';

export interface EventFormData {
  code: string;
  title: string;
  description: string;
  categoryId: number;
  venueId: number;
  organizer: string;
  startDate?: Date;
  endDate?: Date;
  startTime: string;
  capacity: number;
  ticketTypeId: number;
  status: EventStatus;
  speakers: Speaker[];
  reviewNotes?: string;
}

export function useEventForm(
  submitCallback: Forms.SubmitFunc<EventFormData>,
  initialData?: Partial<EventFormData>
) {
  const defaultValues: Partial<EventFormData> = {
    status: 'Draft',
    speakers: [],
    ...initialData,
  };

  const { register, handleSubmit, reset, watch, trigger, setValue } =
    useAppForm<EventFormData>({ defaultValues });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    trigger,
    setValue,
  };
}
