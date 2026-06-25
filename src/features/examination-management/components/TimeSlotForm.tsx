import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
import {
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
} from '../queries';
import { ToastService } from 'services';

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Published', value: 'Published' },
];

interface TimeSlotFormProps {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.TimeSlotForm>(o => ({
  shiftName: o.string().required().label('Shift Name').max(50),
  reportingTime: o
    .string()
    .required()
    .label('Reporting Time')
    .pattern(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  startTime: o
    .string()
    .required()
    .label('Start Time')
    .pattern(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  endTime: o
    .string()
    .required()
    .label('End Time')
    .pattern(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  sortOrder: o.number().required().label('Sort Order').min(0),
  status: o.string().required().label('Status').valid('Published', 'Draft'),
}));

export default function TimeSlotForm({ id, onClose }: TimeSlotFormProps) {
  const isEdit = !!id;
  const { mutateAsync: create, isPending: isCreating } =
    useCreateTimeSlotMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateTimeSlotMutation(id!);
  const isSaving = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.TimeSlotForm>({
      resolver: validation.resolver(schema),
      defaultValues: async () => {
        if (!id)
          return {
            shiftName: '',
            reportingTime: '',
            startTime: '',
            endTime: '',
            sortOrder: 0,
            status: 'Draft',
          };
        const { getTimeSlots } = await import('../apis');
        const items = await getTimeSlots();
        const item = items.find(x => x.id === id);
        return (
          item ?? {
            shiftName: '',
            reportingTime: '',
            startTime: '',
            endTime: '',
            sortOrder: 0,
            status: 'Draft',
          }
        );
      },
    });

  const onSubmit = async (data: Examination.TimeSlotForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Time slot updated successfully.');
    } else {
      await create(data);
      ToastService.success('Time slot created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Shift Name"
          placeholder="e.g., Morning"
          {...register('shiftName')}
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
        <TextBox
          label="Reporting Time"
          placeholder="HH:mm (e.g., 08:30)"
          {...register('reportingTime')}
          required
        />
        <TextBox
          label="Start Time"
          placeholder="HH:mm (e.g., 09:00)"
          {...register('startTime')}
          required
        />
        <TextBox
          label="End Time"
          placeholder="HH:mm (e.g., 12:00)"
          {...register('endTime')}
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
