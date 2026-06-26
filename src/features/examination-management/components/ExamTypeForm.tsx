import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import { TextBox, NumberBox } from 'shared/components/forms';
import {
  useCreateExamTypeMutation,
  useUpdateExamTypeMutation,
} from '../queries';
import { ToastService } from 'services';

interface ExamTypeFormProps {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.ExamTypeForm>(o => ({
  code: o.string().required().label('Code').max(30),
  name: o.string().required().label('Name').max(100),
  description: o.string().optional().allow('').max(500),
  sortOrder: o.number().required().label('Sort Order').min(0),
  isActive: o.boolean().optional(),
}));

export default function ExamTypeForm({ id, onClose }: ExamTypeFormProps) {
  const isEdit = !!id;
  const { mutateAsync: create, isPending: isCreating } =
    useCreateExamTypeMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateExamTypeMutation(id!);
  const isSaving = isCreating || isUpdating;

  const { register, handleSubmit, reset } =
    useAppForm<Examination.ExamTypeForm>({
      resolver: validation.resolver(schema),
      defaultValues: async () => {
        if (!id)
          return {
            code: '',
            name: '',
            description: '',
            sortOrder: 0,
            isActive: true,
          };
        const { getExamTypes } = await import('../apis');
        const items = await getExamTypes();
        const item = items.find(x => x.id === id);
        return (
          item ?? {
            code: '',
            name: '',
            description: '',
            sortOrder: 0,
            isActive: true,
          }
        );
      },
    });

  const onSubmit = async (data: Examination.ExamTypeForm) => {
    if (isEdit) {
      await update(data);
      ToastService.success('Exam type updated successfully.');
    } else {
      await create(data);
      ToastService.success('Exam type created successfully.');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="e.g., MID_SEM"
          {...register('code')}
          required
        />
        <TextBox
          label="Name"
          placeholder="e.g., Mid Semester Exam"
          {...register('name')}
          required
        />
        <TextBox
          label="Description"
          placeholder="Optional description"
          {...register('description')}
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
