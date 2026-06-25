import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';

type Props = {
  fetchData: Cms.UniversityStatForm;
  isSaving?: boolean;
  onSubmit: (data: Cms.UniversityStatForm) => void;
};

const schema = validation.create<Cms.UniversityStatForm>(o => ({
  label: o.string().required().label('Label'),
  value: o.string().required().label('Value'),
  icon: o.string().optional().allow(''),
  displayOrder: o.number().optional().allow(null, 0),
}));

export default function StatForm({ fetchData, isSaving, onSubmit }: Props) {
  const { register, handleSubmit } = useAppForm<Cms.UniversityStatForm>({
    defaultValues: fetchData,
    resolver: validation.resolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <TextBox label="Label" required {...register('label')} />
        <TextBox label="Value" required {...register('value')} />
        <TextBox label="Icon (Material Icon)" {...register('icon')} />
        <TextBox label="Display Order" {...register('displayOrder')} />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Statistic"
        />
      </div>
    </form>
  );
}
