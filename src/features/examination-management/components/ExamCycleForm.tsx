import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
import {
  useCreateExamCycleMutation,
  useUpdateExamCycleMutation,
} from '../queries';
import { ToastService } from 'services';

const MONTH_OPTIONS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Published', value: 'Published' },
];

interface ExamCycleFormProps {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.ExamCycleForm>(o => ({
  name: o.string().required().label('Name').max(100),
  month: o.number().required().label('Month').min(1).max(12),
  year: o.number().required().label('Year').min(2000).max(2099),
  sortOrder: o.number().required().label('Sort Order').min(0),
  status: o.string().required().label('Status').valid('Published', 'Draft'),
}));

export default function ExamCycleForm({ id, onClose }: ExamCycleFormProps) {
  const isEdit = !!id;
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamCycleMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateExamCycleMutation(id!);
  const isSaving = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ExamCycleForm>({
      resolver: validation.resolver(schema),
      defaultValues: async () => {
        if (!id)
          return {
            name: '',
            month: 1,
            year: new Date().getFullYear(),
            sortOrder: 0,
            status: 'Draft',
          };
        const { getExamCycles } = await import('../apis');
        const items = await getExamCycles();
        const item = items.find(x => x.id === id);
        return (
          item ?? {
            name: '',
            month: 1,
            year: new Date().getFullYear(),
            sortOrder: 0,
            status: 'Draft',
          }
        );
      },
    });

  const onSubmit = async (data: Examination.ExamCycleForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Exam cycle updated successfully.');
    } else {
      await create(data);
      ToastService.success('Exam cycle created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          placeholder="e.g., December 2025"
          {...register('name')}
          required
        />
        <DropDownList
          label="Month"
          data={MONTH_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="month"
          required
        />
        <NumberBox label="Year" {...register('year')} required />
        <DropDownList
          label="Status"
          data={STATUS_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="status"
          required
        />
        <NumberBox label="Sort Order" {...register('sortOrder')} required />
      </FormGrid>
      <FormActions
        isEditMode={isEdit}
        isLoading={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
