import { ToastService } from 'services';
import { NumberBox, TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateSupplementarySessionMutation,
  useUpdateSupplementarySessionMutation,
  useSupplementarySetupsQuery,
} from '../queries';

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Active', value: 'Active' },
];

interface SupplementarySessionFormProps {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.SupplementarySessionForm>(o => ({
  sessionName: o.string().required().label('Session Name').max(100),
  maxSubjects: o
    .number()
    .required()
    .label('Max Backlog Subjects')
    .min(1)
    .max(20),
  feePerSubject: o.number().required().label('Fee per Subject').min(0),
  status: o.string().required().label('Status').valid('Draft', 'Active'),
}));

export default function SupplementarySessionForm({
  id,
  onClose,
}: SupplementarySessionFormProps) {
  const isEditMode = !!id;
  const { data: sessions } = useSupplementarySetupsQuery();
  const initialData = isEditMode ? sessions?.find(s => s.id === id) : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateSupplementarySessionMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateSupplementarySessionMutation(id!);
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.SupplementarySessionForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        sessionName: '',
        maxSubjects: 4,
        feePerSubject: 500,
        status: 'Draft',
      },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        sessionName: initialData.sessionName,
        maxSubjects: initialData.maxSubjects,
        feePerSubject: initialData.feePerSubject,
        status: initialData.status as any,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.SupplementarySessionForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Supplementary session updated successfully.');
    } else {
      await create(data);
      ToastService.success('Supplementary session created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Session Name"
          placeholder="e.g., Supplementary Exam Jan 2026"
          {...register('sessionName')}
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
        <NumberBox
          label="Max Backlog Subjects Allowed"
          {...register('maxSubjects')}
          required
        />
        <NumberBox
          label="Fee per Subject (INR)"
          {...register('feePerSubject')}
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
