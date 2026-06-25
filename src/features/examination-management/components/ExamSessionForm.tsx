import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
import { useCreateExamSessionMutation, useCycleOptionsQuery } from '../queries';
import { ToastService } from 'services';

const SESSION_TYPE_OPTIONS = [
  { label: 'Regular', value: 'Regular' },
  { label: 'Supplementary', value: 'Supplementary' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

interface ExamSessionFormProps {
  onClose: () => void;
}

const schema = validation.create<Examination.ExamSessionForm>(o => ({
  sessionType: o
    .string()
    .required()
    .label('Session Type')
    .valid('Regular', 'Supplementary'),
  academicYearSessionId: o.number().required().label('Academic Year Session'),
  examinationYear: o
    .number()
    .required()
    .label('Examination Year')
    .min(2000)
    .max(2099),
  cycleId: o.number().required().label('Cycle'),
  sessionName: o.string().required().label('Session Name').max(200),
  status: o.string().required().label('Status').valid('Active', 'Inactive'),
}));

export default function ExamSessionForm({ onClose }: ExamSessionFormProps) {
  const { data: cycles } = useCycleOptionsQuery();
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamSessionMutation();
  const isSaving = isCreating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ExamSessionForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        sessionType: 'Regular',
        academicYearSessionId: 0,
        examinationYear: new Date().getFullYear(),
        cycleId: 0,
        sessionName: '',
        status: 'Active',
      },
    });

  const onSubmit = async (data: Examination.ExamSessionForm) => {
    await create(data);
    ToastService.success('Examination session created successfully.');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Session Name"
          placeholder="e.g., End Semester Exam Dec 2025"
          {...register('sessionName')}
          required
        />
        <DropDownList
          label="Session Type"
          data={SESSION_TYPE_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="sessionType"
          required
        />
        <NumberBox
          label="Academic Year Session ID"
          {...register('academicYearSessionId')}
          required
        />
        <NumberBox
          label="Examination Year"
          {...register('examinationYear')}
          required
        />
        <DropDownList
          label="Cycle"
          data={cycles ?? []}
          textField="text"
          valueField="id"
          control={control}
          name="cycleId"
          required
        />
        <DropDownList
          label="Status"
          data={STATUS_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="status"
          required
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
