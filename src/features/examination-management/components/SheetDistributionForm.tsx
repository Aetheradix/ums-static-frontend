import { ToastService } from 'services';
import {
  NumberBox,
  TextBox,
  DropDownList,
  DatePicker,
} from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateSheetDistributionMutation,
  useUpdateSheetDistributionMutation,
  useSheetDistributionsQuery,
} from '../queries';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

interface Props {
  id?: number;
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

export default function SheetDistributionForm({ id, onClose }: Props) {
  const isEditMode = !!id;
  const { data: sheets } = useSheetDistributionsQuery();
  const initialData = isEditMode ? sheets?.find(s => s.id === id) : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateSheetDistributionMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateSheetDistributionMutation(id!);
  const isPending = isCreating || isUpdating;

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

  useEffect(() => {
    if (initialData) {
      reset({
        evaluator: initialData.evaluator,
        subject: initialData.subject,
        totalSheets: initialData.totalSheets,
        assignedDate: initialData.assignedDate,
        status: initialData.status as any,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.SheetDistributionForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Sheet distribution updated successfully.');
    } else {
      await create(data);
      ToastService.success('Sheet distribution created successfully.');
    }
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
        <DatePicker
          label="Assigned Date"
          placeholder="YYYY-MM-DD"
          name="assignedDate"
          control={control}
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
        isEditMode={isEditMode}
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
