import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, Switch } from 'shared/components/forms';
import {
  useCreateExamCenterMutation,
  useUpdateExamCenterMutation,
} from '../queries';
import { ToastService } from 'services';

interface CenterFormProps {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.ExamCenterForm>(o => ({
  centerCode: o.string().required().label('Center Code').max(20),
  centerName: o.string().required().label('Center Name').max(200),
  addressLine1: o.string().required().label('Address Line 1').max(200),
  addressLine2: o.string().optional().allow('').max(200),
  city: o.string().required().label('City').max(100),
  state: o.string().required().label('State').max(100),
  pincode: o.string().required().label('Pincode').max(10),
  contactPerson: o.string().optional().allow('').max(100),
  contactPhone: o.string().optional().allow('').max(20),
  totalCapacity: o.number().required().label('Total Capacity').min(1),
  isActive: o.boolean().optional(),
}));

export default function CenterForm({ id, onClose }: CenterFormProps) {
  const isEdit = !!id;
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamCenterMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateExamCenterMutation(id!);
  const isSaving = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ExamCenterForm>({
      resolver: validation.resolver(schema),
      defaultValues: async () => {
        if (!id)
          return {
            centerCode: '',
            centerName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            contactPerson: '',
            contactPhone: '',
            totalCapacity: 100,
            isActive: true,
          };
        const { getExamCenters } = await import('../apis');
        const items = await getExamCenters();
        const item = items.find(x => x.id === id);
        return (
          item ?? {
            centerCode: '',
            centerName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            contactPerson: '',
            contactPhone: '',
            totalCapacity: 100,
            isActive: true,
          }
        );
      },
    });

  const onSubmit = async (data: Examination.ExamCenterForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Exam center updated successfully.');
    } else {
      await create(data);
      ToastService.success('Exam center created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Center Code"
          placeholder="e.g., CEN-004"
          {...register('centerCode')}
          required
        />
        <TextBox
          label="Center Name"
          placeholder="e.g., New Campus Hall"
          {...register('centerName')}
          required
        />
        <TextBox
          label="Address Line 1"
          {...register('addressLine1')}
          required
        />
        <TextBox label="Address Line 2" {...register('addressLine2')} />
        <TextBox label="City" {...register('city')} required />
        <TextBox label="State" {...register('state')} required />
        <TextBox label="Pincode" {...register('pincode')} required />
        <NumberBox
          label="Total Capacity"
          {...register('totalCapacity')}
          required
        />
        <TextBox label="Contact Person" {...register('contactPerson')} />
        <TextBox label="Contact Phone" {...register('contactPhone')} />
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
