import { ToastService } from 'services';
import { NumberBox, TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useCreateQuestionPaperPatternMutation } from '../queries';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

interface Props {
  onClose: () => void;
}

const schema = validation.create<Examination.QuestionPaperPatternForm>(o => ({
  subject: o.string().required().label('Subject').max(100),
  totalMarks: o.number().required().label('Total Marks').min(10).max(200),
  mcq: o.number().required().label('MCQ Marks').min(0),
  short: o.number().required().label('Short Answer Marks').min(0),
  long: o.number().required().label('Long Answer Marks').min(0),
  status: o.string().required().label('Status').valid('Active', 'Inactive'),
}));

export default function QuestionPaperPatternForm({ onClose }: Props) {
  const { mutateAsync: create, isPending } =
    useCreateQuestionPaperPatternMutation();
  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.QuestionPaperPatternForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        subject: '',
        totalMarks: 100,
        mcq: 20,
        short: 30,
        long: 50,
        status: 'Active',
      },
    });
  const onSubmit = async (data: Examination.QuestionPaperPatternForm) => {
    await create(data);
    ToastService.success('Pattern created successfully.');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Subject"
          placeholder="e.g., Engineering Mathematics"
          {...register('subject')}
          required
        />
        <NumberBox label="Total Marks" {...register('totalMarks')} required />
        <NumberBox label="MCQ Marks" {...register('mcq')} required />
        <NumberBox label="Short Answer Marks" {...register('short')} required />
        <NumberBox label="Long Answer Marks" {...register('long')} required />
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
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
