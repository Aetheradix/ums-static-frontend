import { ToastService } from 'services';
import { TextBox, NumberBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useCreateTimetableEntryMutation } from '../queries';

interface Props {
  sessionId: number;
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

export default function TimetableEntryForm({ sessionId, onClose }: Props) {
  const { mutateAsync: create, isPending } =
    useCreateTimetableEntryMutation(sessionId);
  const { register, handleSubmit, reset } =
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
  const onSubmit = async (data: Examination.TimetableForm) => {
    await create(data);
    ToastService.success('Timetable entry added successfully.');
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
        <TextBox
          label="Exam Date"
          placeholder="YYYY-MM-DD"
          {...register('examDate')}
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
        isEditMode={false}
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
