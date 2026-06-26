import { ToastService } from 'services';
import { TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useEffect } from 'react';
import {
  useCreateModerationRuleMutation,
  useUpdateModerationRuleMutation,
  useModerationRulesQuery,
} from '../queries';

const TYPE_OPTIONS = [
  { label: 'Flat Add', value: 'FLAT_ADD' },
  { label: 'Percentage', value: 'PERCENTAGE' },
  { label: 'Normalize', value: 'NORMALIZE' },
];

const TARGET_OPTIONS = [
  { label: 'All Subjects', value: 'all' },
  { label: 'Theory Only', value: 'theory' },
  { label: 'Practical Only', value: 'practical' },
];

interface Props {
  id?: number;
  onClose: () => void;
}

const schema = validation.create<Examination.ModerationRuleForm>(o => ({
  rule: o.string().required().label('Rule Name').max(100),
  type: o
    .string()
    .required()
    .label('Formula Type')
    .valid('FLAT_ADD', 'PERCENTAGE', 'NORMALIZE'),
  target: o.string().required().label('Target').max(50),
}));

export default function ModerationRuleForm({ id, onClose }: Props) {
  const isEditMode = !!id;
  const { data: rules } = useModerationRulesQuery();
  const initialData = isEditMode ? rules?.find(r => r.id === id) : undefined;

  const { mutateAsync: create, isPending: isCreating } =
    useCreateModerationRuleMutation();
  const { mutateAsync: update, isPending: isUpdating } =
    useUpdateModerationRuleMutation(id!);
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ModerationRuleForm>({
      resolver: validation.resolver(schema),
      defaultValues: { rule: '', type: 'FLAT_ADD', target: 'all' },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        rule: initialData.rule,
        type: initialData.type as any,
        target: initialData.target,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Examination.ModerationRuleForm) => {
    if (isEditMode) {
      await update(data);
      ToastService.success('Moderation rule updated successfully.');
    } else {
      await create(data);
      ToastService.success('Moderation rule created successfully.');
    }
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Rule Name"
          placeholder="e.g., Grace Marks 5"
          {...register('rule')}
          required
        />
        <DropDownList
          label="Formula Type"
          data={TYPE_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="type"
          required
        />
        <DropDownList
          label="Target"
          data={TARGET_OPTIONS}
          textField="label"
          valueField="value"
          control={control}
          name="target"
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
