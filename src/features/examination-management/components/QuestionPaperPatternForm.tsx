import { ToastService } from 'services';
import { NumberBox, TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateQuestionPaperPatternMutation,
  useUpdateQuestionPaperPatternMutation,
  useQuestionPaperPatternsQuery,
} from '../queries';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

interface Props {
  id?: number;
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

export default function QuestionPaperPatternForm({ id, onClose }: Props) {
  const isEditMode = !!id;
  const { data: patterns } = useQuestionPaperPatternsQuery();
  const initialData = isEditMode ? patterns?.find(p => p.id === id) : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateQuestionPaperPatternMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateQuestionPaperPatternMutation(id!);
  const isPending = isCreating || isUpdating;

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

  useEffect(() => {
    if (initialData) {
      reset({
        subject: initialData.subject,
        totalMarks: initialData.totalMarks,
        mcq: initialData.mcq,
        short: initialData.short,
        long: initialData.long,
        status: initialData.status as any,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.QuestionPaperPatternForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Pattern updated successfully.');
    } else {
      await create(data);
      ToastService.success('Pattern created successfully.');
    }
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
        isEditMode={isEditMode}
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
