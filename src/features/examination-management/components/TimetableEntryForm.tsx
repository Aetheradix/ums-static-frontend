import { ToastService } from 'services';
import { TextBox, NumberBox, DatePicker } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateTimetableEntryMutation,
  useUpdateTimetableEntryMutation,
  useTimetableQuery,
} from '../queries';

interface Props {
  sessionId: number;
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.TimetableForm>(o => ({
  subjectCode: o.string().required().label('Subject Code').max(20),
  subjectName: o.string().required().label('Subject Name').max(100),
  examDate: o.string().required().label('Exam Date'),
  slotId: o.number().required().label('Time Slot'),
  startTime: o.string().required().label('Start Time').max(10),
  endTime: o.string().required().label('End Time').max(10),
  centerId: o.number().required().label('Center'),
}));

export default function TimetableEntryForm({ sessionId, id, onClose }: Props) {
  const isEditMode = !!id;
  const { data: timetable } = useTimetableQuery(sessionId);
  const initialData = isEditMode
    ? timetable?.find(t => t.id === id)
    : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateTimetableEntryMutation(sessionId);
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateTimetableEntryMutation(sessionId, id!);
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.TimetableForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        subjectCode: '',
        subjectName: '',
        examDate: '',
        slotId: 1,
        startTime: '09:00',
        endTime: '12:00',
        centerId: 1,
      },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        subjectCode: initialData.subjectCode,
        subjectName: initialData.subjectName,
        examDate: initialData.examDate,
        slotId: initialData.slotId,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        centerId: initialData.centerId,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.TimetableForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Timetable entry updated successfully.');
    } else {
      await create(data);
      ToastService.success('Timetable entry added successfully.');
    }
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Subject Code"
          placeholder="e.g., CS301"
          {...register('subjectCode')}
          required
        />
        <TextBox
          label="Subject Name"
          placeholder="e.g., Data Structures"
          {...register('subjectName')}
          required
        />
        <DatePicker
          label="Exam Date"
          placeholder="YYYY-MM-DD"
          name="examDate"
          control={control}
          required
        />
        <NumberBox label="Time Slot ID" {...register('slotId')} required />
        <TextBox
          label="Start Time"
          placeholder="09:00"
          {...register('startTime')}
          required
        />
        <TextBox
          label="End Time"
          placeholder="12:00"
          {...register('endTime')}
          required
        />
        <NumberBox label="Center ID" {...register('centerId')} required />
      </FormGrid>
      <FormActions
        isEditMode={isEditMode}
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
