import { ToastService } from 'services';
import { NumberBox, TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useCreateSheetDistributionMutation } from '../queries';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

interface Props {
  onClose: () => void;
}

const schema = validation.create<Examination.SheetDistributionForm>(o => ({
  evaluator: o.string().required().label('Evaluator').max(100),
  subject: o.string().required().label('Subject').max(100),
  totalSheets: o.number().required().label('Total Sheets').min(1),
  assignedDate: o.string().required().label('Assigned Date'),
  status: o
    .string()
    .required()
    .label('Status')
    .valid('Pending', 'In Progress', 'Completed'),
}));

export default function SheetDistributionForm({ onClose }: Props) {
  const { mutateAsync: create, isPending } =
    useCreateSheetDistributionMutation();
  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.SheetDistributionForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        evaluator: '',
        subject: '',
        totalSheets: 0,
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      },
    });
  const onSubmit = async (data: Examination.SheetDistributionForm) => {
    await create(data);
    ToastService.success('Sheet distribution created successfully.');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Evaluator"
          placeholder="e.g., Dr. Rajesh Kumar"
          {...register('evaluator')}
          required
        />
        <TextBox
          label="Subject"
          placeholder="e.g., Data Structures"
          {...register('subject')}
          required
        />
        <NumberBox label="Total Sheets" {...register('totalSheets')} required />
        <TextBox
          label="Assigned Date"
          placeholder="YYYY-MM-DD"
          {...register('assignedDate')}
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
