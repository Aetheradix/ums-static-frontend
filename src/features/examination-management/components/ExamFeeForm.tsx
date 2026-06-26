import { ToastService } from 'services';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateExamFeeMutation,
  useUpdateExamFeeMutation,
  useExamFeesQuery,
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
  id?: number;
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

export default function ExamFeeForm({ id, onClose }: ExamFeeFormProps) {
  const isEditMode = !!id;
  const { data: fees } = useExamFeesQuery();
  const initialData = isEditMode ? fees?.find(f => f.id === id) : undefined;

  const { data: programs } = useProgramOptionsQuery();
  const { data: cycles } = useCycleOptionsQuery();
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamFeeMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateExamFeeMutation(id!);
  const isSaving = isCreating || isUpdating;

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

  useEffect(() => {
    if (initialData) {
      reset({
        programId: initialData.programId,
        termNo: initialData.termNo,
        termType: initialData.termType,
        applicableFromYear: initialData.applicableFromYear,
        applicableCycleId: initialData.applicableCycleId,
        feeConfigJSON: initialData.feeConfigJSON,
        status: initialData.status as any,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.ExamFeeForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Exam fee configuration updated successfully.');
    } else {
      await create(data);
      ToastService.success('Exam fee configuration created successfully.');
    }
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
        isEditMode={isEditMode}
        isLoading={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
