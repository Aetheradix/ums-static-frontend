import { ToastService } from 'services';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import {
  useCreateExamFeeMutation,
  useCycleOptionsQuery,
  useProgramOptionsQuery,
} from '../queries';

const TERM_TYPE_OPTIONS = [
  { label: 'Semester', value: 'Semester' },
  { label: 'Year', value: 'Year' },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Published', value: 'Published' },
];

interface ExamFeeFormProps {
  onClose: () => void;
}

const schema = validation.create<Examination.ExamFeeForm>(o => ({
  programId: o.number().required().label('Program'),
  termNo: o.number().required().label('Term No').min(1),
  termType: o.string().required().label('Term Type').valid('Semester', 'Year'),
  applicableFromYear: o
    .number()
    .required()
    .label('Applicable From Year')
    .min(2000)
    .max(2099),
  applicableCycleId: o.number().required().label('Applicable Cycle'),
  feeConfigJSON: o.string().required().label('Fee Configuration'),
  status: o.string().required().label('Status').valid('Published', 'Draft'),
}));

export default function ExamFeeForm({ onClose }: ExamFeeFormProps) {
  const { data: programs } = useProgramOptionsQuery();
  const { data: cycles } = useCycleOptionsQuery();
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamFeeMutation();
  const isSaving = isCreating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ExamFeeForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        programId: 0,
        termNo: 1,
        termType: 'Semester',
        applicableFromYear: new Date().getFullYear(),
        applicableCycleId: 0,
        feeConfigJSON: '',
        status: 'Draft',
      },
    });

  const onSubmit = async (data: Examination.ExamFeeForm) => {
    await create(data);
    ToastService.success('Exam fee configuration created successfully.');
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
        <NumberBox label="Term No" {...register('termNo')} required />
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
          label="Fees"
          placeholder="1500"
          {...register('feeConfigJSON')}
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
