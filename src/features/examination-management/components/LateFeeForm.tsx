import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
import {
  useCreateLateFeeMutation,
  useProgramOptionsQuery,
  useCycleOptionsQuery,
} from '../queries';
import { ToastService } from 'services';

const TERM_TYPE_OPTIONS = [
  { label: 'Semester', value: 'Semester' },
  { label: 'Year', value: 'Year' },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Published', value: 'Published' },
];

interface LateFeeFormProps {
  onClose: () => void;
}

const schema = validation.create<Examination.LateFeeForm>(o => ({
  programId: o.number().required().label('Program'),
  termNo: o.number().required().label('Term No').min(0),
  termType: o.string().required().label('Term Type').valid('Semester', 'Year'),
  applicableFromYear: o
    .number()
    .required()
    .label('Applicable From Year')
    .min(2000)
    .max(2099),
  applicableCycleId: o.number().required().label('Applicable Cycle'),
  lateFeeConfigJSON: o.string().required().label('Late Fee Configuration'),
  status: o.string().required().label('Status').valid('Published', 'Draft'),
}));

export default function LateFeeForm({ onClose }: LateFeeFormProps) {
  const { data: programs } = useProgramOptionsQuery();
  const { data: cycles } = useCycleOptionsQuery();
  const { mutateAsync: create, isPending: isCreating } =
    useCreateLateFeeMutation();
  const isSaving = isCreating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.LateFeeForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        programId: 0,
        termNo: 0,
        termType: 'Semester',
        applicableFromYear: new Date().getFullYear(),
        applicableCycleId: 0,
        lateFeeConfigJSON: '{"perDay":100,"maxDays":15,"maxLateFee":1000}',
        status: 'Draft',
      },
    });

  const onSubmit = async (data: Examination.LateFeeForm) => {
    await create(data);
    ToastService.success('Late fee rule created successfully.');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <DropDownList
          label="Program"
          data={programs ?? []}
          textField="text"
          valueField="id"
          control={control}
          name="programId"
          required
        />
        <DropDownList
          label="Term Type"
          data={TERM_TYPE_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="termType"
          required
        />
        <NumberBox
          label="Term No (0 = All Terms)"
          {...register('termNo')}
          required
        />
        <NumberBox
          label="Applicable From Year"
          {...register('applicableFromYear')}
          required
        />
        <DropDownList
          label="Applicable Cycle"
          data={cycles ?? []}
          textField="text"
          valueField="id"
          control={control}
          name="applicableCycleId"
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
          label="Late Fee Config JSON"
          placeholder='{"perDay":100,"maxDays":15,"maxLateFee":1000}'
          {...register('lateFeeConfigJSON')}
          required
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
