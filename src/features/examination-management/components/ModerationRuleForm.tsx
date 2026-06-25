import { ToastService } from 'services';
import { TextBox, DropDownList } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import { FormActions, FormGrid } from 'shared/new-components';
import validation from 'shared/utils/validation';
import { useCreateModerationRuleMutation } from '../queries';

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

export default function ModerationRuleForm({ onClose }: Props) {
  const { mutateAsync: create, isPending } = useCreateModerationRuleMutation();
  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.ModerationRuleForm>({
      resolver: validation.resolver(schema),
      defaultValues: { rule: '', type: 'FLAT_ADD', target: 'all' },
    });
  const onSubmit = async (data: Examination.ModerationRuleForm) => {
    await create(data);
    ToastService.success('Moderation rule created successfully.');
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
        isEditMode={false}
        isLoading={isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
