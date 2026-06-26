import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, Switch } from 'shared/components/forms';
import {
  useCreateDutyTypeMutation,
  useUpdateDutyTypeMutation,
  useDutyTypesQuery,
} from '../queries';
import { ToastService } from 'services';

interface DutyTypeFormProps {
  id?: number;
  onClose: () => void;
}

const DEFAULT_VALUES: Examination.DutyTypeForm = {
  code: '',
  name: '',
  description: '',
  isActive: true,
};

const schema = validation.create<Examination.DutyTypeForm>(o => ({
  code: o.string().required().label('Code').max(30),
  name: o.string().required().label('Name').max(100),
  description: o.string().optional().allow('').max(500),
  maxPerSession: o.number().optional().allow('', 0).min(0),
  isActive: o.boolean().optional(),
}));

export default function DutyTypeForm({ id, onClose }: DutyTypeFormProps) {
  const isEdit = !!id;
  const { data: items } = useDutyTypesQuery();
  const { mutateAsync: create, isPending: isCreating } =
    useCreateDutyTypeMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateDutyTypeMutation(id!);
  const isSaving = isCreating || isUpdating;

  const editItem = isEdit && items ? items.find(x => x.id === id) : undefined;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.DutyTypeForm>({
      resolver: validation.resolver(schema),
      defaultValues: editItem ?? DEFAULT_VALUES,
    });

  const onSubmit = async (data: Examination.DutyTypeForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Duty type updated successfully.');
    } else {
      await create(data);
      ToastService.success('Duty type created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="e.g., CHIEF_SUPDT"
          {...register('code')}
          required
        />
        <TextBox
          label="Name"
          placeholder="e.g., Chief Superintendent"
          {...register('name')}
          required
        />
        <TextBox label="Description" {...register('description')} />
        <NumberBox label="Max Per Session" {...register('maxPerSession')} />
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
