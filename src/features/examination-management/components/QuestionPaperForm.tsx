import { ToastService } from 'services';
import { TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useCreateQuestionPaperMutation } from '../queries';

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Approved', value: 'Approved' },
];

interface Props {
  onClose: () => void;
}

const schema = validation.create<Examination.QuestionPaperForm>(o => ({
  examType: o.string().required().label('Exam Type').max(50),
  subject: o.string().required().label('Subject').max(100),
  course: o.string().required().label('Course').max(100),
  semester: o.string().required().label('Semester').max(20),
  year: o.string().required().label('Year').max(10),
  status: o.string().required().label('Status').valid('Draft', 'Approved'),
}));

export default function QuestionPaperForm({ onClose }: Props) {
  const { mutateAsync: create, isPending } = useCreateQuestionPaperMutation();
  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.QuestionPaperForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        examType: '',
        subject: '',
        course: '',
        semester: '',
        year: '',
        status: 'Draft',
      },
    });
  const onSubmit = async (data: Examination.QuestionPaperForm) => {
    await create(data);
    ToastService.success('Question paper added successfully.');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Exam Type"
          placeholder="e.g., Mid Semester"
          {...register('examType')}
          required
        />
        <TextBox
          label="Subject"
          placeholder="e.g., Data Structures"
          {...register('subject')}
          required
        />
        <TextBox
          label="Course"
          placeholder="e.g., B.Tech CSE"
          {...register('course')}
          required
        />
        <TextBox
          label="Semester"
          placeholder="e.g., 3"
          {...register('semester')}
          required
        />
        <TextBox
          label="Year"
          placeholder="e.g., 2024"
          {...register('year')}
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
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
