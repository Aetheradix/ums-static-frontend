import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox, Switch, TextArea, InputBlock } from 'shared/components/forms';

type Props = {
  fetchData?: Cms.DepartmentForm;
  isSaving?: boolean;
  isEditMode?: boolean;
  onSubmit: (data: Cms.DepartmentForm) => void;
};

const DEFAULT_DATA: Cms.DepartmentForm = {
  name: '',
  shortName: '',
  icon: 'domain',
  colorHex: '#0F4C81',
  totalCourses: 0,
  totalFaculty: 0,
  totalStudents: 0,
  description: '',
  isActive: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.DepartmentForm>(o => ({
  name: o.string().required().label('Name'),
  shortName: o.string().required().label('Short Name'),
  icon: o.string().optional().allow(''),
  colorHex: o.string().optional().allow(''),
  totalCourses: o.number().optional().allow(null, 0),
  totalFaculty: o.number().optional().allow(null, 0),
  totalStudents: o.number().optional().allow(null, 0),
  description: o.string().optional().allow(''),
  isActive: o.boolean().optional(),
  displayOrder: o.number().optional().allow(null, 0),
}));

export default function DepartmentForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control } = useAppForm<Cms.DepartmentForm>({
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
        <TextBox label="Short Name" required {...register('shortName')} />
        <TextBox label="Icon (Material Icon name)" {...register('icon')} />

        <InputBlock label="Color Hex" id="colorHex">
          <input
            id="colorHex"
            type="color"
            className="w-full h-10 p-1 border rounded-md cursor-pointer"
            {...register('colorHex')}
          />
        </InputBlock>

        <TextBox label="Total Courses" {...register('totalCourses')} />
        <TextBox label="Total Faculty" {...register('totalFaculty')} />
        <TextBox label="Total Students" {...register('totalStudents')} />
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
          label="Save Department"
        />
      </div>
    </form>
  );
}
