import { ToastService } from 'services';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateEvaluatorMutation,
  useUpdateEvaluatorMutation,
  useEvaluatorsQuery,
} from '../queries';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

interface Props {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.EvaluatorForm>(o => ({
  name: o.string().required().label('Name').max(100),
  email: o.string().required().label('Email').email().max(100),
  role: o.string().required().label('Role').max(50),
  qualification: o.string().required().label('Qualification').max(100),
  subjects: o.number().required().label('Subjects Assigned').min(0).max(50),
  status: o.string().required().label('Status').valid('Active', 'Inactive'),
}));

export default function EvaluatorForm({ id, onClose }: Props) {
  const isEditMode = !!id;
  const { data: evaluators } = useEvaluatorsQuery();
  const initialData = isEditMode
    ? evaluators?.find(e => e.id === id)
    : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateEvaluatorMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateEvaluatorMutation(id!);
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.EvaluatorForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        name: '',
        email: '',
        role: '',
        qualification: '',
        subjects: 0,
        status: 'Active',
      },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        qualification: initialData.qualification,
        subjects: initialData.subjects,
        status: initialData.status as any,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.EvaluatorForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Evaluator updated successfully.');
    } else {
      await create(data);
      ToastService.success('Evaluator created successfully.');
    }
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          placeholder="e.g., Dr. Rajesh Kumar"
          {...register('name')}
          required
        />
        <TextBox
          label="Email"
          placeholder="rajesh@example.com"
          {...register('email')}
          required
        />
        <TextBox
          label="Role"
          placeholder="e.g., Senior Evaluator"
          {...register('role')}
          required
        />
        <TextBox
          label="Qualification"
          placeholder="e.g., Ph.D. in Mathematics"
          {...register('qualification')}
          required
        />
        <NumberBox
          label="Subjects Assigned"
          {...register('subjects')}
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
