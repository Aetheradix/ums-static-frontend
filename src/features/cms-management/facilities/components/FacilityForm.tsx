import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox, Switch, TextArea } from 'shared/components/forms';

type Props = {
  fetchData?: Cms.FacilityForm;
  isSaving?: boolean;
  onSubmit: (data: Cms.FacilityForm) => void;
};

const DEFAULT_DATA: Cms.FacilityForm = {
  name: '',
  icon: 'business',
  description: '',
  isActive: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.FacilityForm>(o => ({
  name: o.string().required().label('Name'),
  icon: o.string().optional().allow(''),
  displayOrder: o.number().optional().allow(null, 0),
  description: o.string().optional().allow(''),
  isActive: o.boolean().optional(),
}));

export default function FacilityForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control } = useAppForm<Cms.FacilityForm>({
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
        <TextBox label="Name" required {...register('name')} />
        <TextBox label="Icon (Material Icon)" {...register('icon')} />
        <TextBox label="Display Order" {...register('displayOrder')} />
        <div className="col-span-2">
          <TextArea label="Description" {...register('description')} />
        </div>
        <Switch control={control} name="isActive" label="Is Active" />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Facility"
        />
      </div>
    </form>
  );
}
