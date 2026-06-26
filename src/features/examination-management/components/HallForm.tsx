import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import {
  TextBox,
  NumberBox,
  Switch,
  DropDownList,
} from 'shared/components/forms';
import {
  useCreateHallMutation,
  useUpdateHallMutation,
  useHallsQuery,
} from '../queries';
import { ToastService } from 'services';

const HALL_TYPE_OPTIONS = [
  { label: 'Classroom', value: 'Classroom' },
  { label: 'Lecture Hall', value: 'Lecture Hall' },
  { label: 'Auditorium', value: 'Auditorium' },
  { label: 'Lab', value: 'Lab' },
  { label: 'Other', value: 'Other' },
];

interface HallFormProps {
  centerId: number;
  id?: number;
  onClose: () => void;
}

const DEFAULT_VALUES: Examination.HallForm = {
  centerId: 0, // This will be set by the parent component
  hallCode: '',
  hallName: '',
  floor: '',
  capacity: 0,
  hallType: 'Classroom',
  isActive: true,
};

const schema = validation.create<Examination.HallForm>(o => ({
  centerId: o.number().required().label('Center ID'),
  hallCode: o.string().required().label('Hall Code').max(20),
  hallName: o.string().required().label('Hall Name').max(100),
  floor: o.string().optional().allow('').label('Floor').max(50),
  capacity: o.number().required().label('Capacity').min(1),
  hallType: o
    .string()
    .required()
    .label('Hall Type')
    .valid('Classroom', 'Lecture Hall', 'Auditorium', 'Lab', 'Other'),
  isActive: o.boolean().optional(),
}));

export default function HallForm({ centerId, id, onClose }: HallFormProps) {
  const isEdit = !!id;
  const { data: items } = useHallsQuery(centerId);
  const { mutateAsync: create, isPending: isCreating } =
    useCreateHallMutation();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateHallMutation(
    id!
  );
  const isSaving = isCreating || isUpdating;

  const editItem = isEdit && items ? items.find(x => x.id === id) : undefined;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.HallForm>({
      resolver: validation.resolver(schema),
      defaultValues: { ...(editItem ?? DEFAULT_VALUES), centerId },
    });

  const onSubmit = async (data: Examination.HallForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Hall updated successfully.');
    } else {
      await create(data);
      ToastService.success('Hall created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Hall Code"
          placeholder="e.g., H-101"
          {...register('hallCode')}
          required
        />
        <TextBox
          label="Hall Name"
          placeholder="e.g., Ground Floor Classroom"
          {...register('hallName')}
          required
        />
        <TextBox
          label="Floor"
          placeholder="e.g., Ground"
          {...register('floor')}
        />
        <NumberBox label="Capacity" {...register('capacity')} required />
        <DropDownList
          label="Hall Type"
          data={HALL_TYPE_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="hallType"
          required
        />
        <Switch control={control} name="isActive" label="Is Active" />
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
