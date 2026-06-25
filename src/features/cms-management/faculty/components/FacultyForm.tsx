import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  Switch,
  DropDownList,
  InputBlock,
} from 'shared/components/forms';
import { useDepartmentsQuery } from '../../departments/queries';

type Props = {
  fetchData?: Cms.FacultyForm;
  isSaving?: boolean;
  isEditMode?: boolean;
  onSubmit: (data: Cms.FacultyForm) => void;
};

const DEFAULT_DATA: Cms.FacultyForm = {
  fullName: '',
  initials: '',
  departmentId: 0,
  designation: 'Professor',
  qualification: '',
  experienceYears: 0,
  researchPapers: 0,
  email: '',
  profileImageUrl: '',
  avatarColorHex: '#0F4C81',
  isActive: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.FacultyForm>(o => ({
  fullName: o.string().required().label('Full Name'),
  initials: o.string().optional().allow(''),
  departmentId: o.number().required().label('Department'),
  designation: o.string().required().label('Designation'),
  qualification: o.string().optional().allow(''),
  email: o.string().email().optional().allow('', null),
  experienceYears: o.number().optional().allow(null, 0),
  researchPapers: o.number().optional().allow(null, 0),
  profileImageUrl: o.string().optional().allow('', null),
  avatarColorHex: o.string().optional().allow(''),
  displayOrder: o.number().optional().allow(null, 0),
  isActive: o.boolean().optional(),
}));

export default function FacultyForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { data: departments } = useDepartmentsQuery();

  const { register, handleSubmit, control } = useAppForm<Cms.FacultyForm>({
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
        <TextBox label="Full Name" required {...register('fullName')} />
        <TextBox label="Initials" {...register('initials')} />
        <DropDownList
          textField="label"
          valueField="value"
          label="Department"
          data={departments?.map(d => ({ label: d.name, value: d.id })) ?? []}
          required
          control={control}
          name="departmentId"
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Designation"
          data={[
            { label: 'Professor', value: 'Professor' },
            { label: 'Associate Professor', value: 'Associate Professor' },
            { label: 'Assistant Professor', value: 'Assistant Professor' },
            { label: 'Lecturer', value: 'Lecturer' },
          ]}
          required
          control={control}
          name="designation"
        />
        <TextBox
          label="Qualification (e.g., Ph.D., M.Tech)"
          {...register('qualification')}
        />
        <TextBox label="Email Address" {...register('email')} />
        <TextBox label="Experience (Years)" {...register('experienceYears')} />
        <TextBox label="Research Papers" {...register('researchPapers')} />
        <TextBox label="Profile Image URL" {...register('profileImageUrl')} />

        <InputBlock label="Avatar Background Color Hex" id="avatarColorHex">
          <input
            id="avatarColorHex"
            type="color"
            className="w-full h-10 p-1 border rounded-md cursor-pointer"
            {...register('avatarColorHex')}
          />
        </InputBlock>

        <TextBox label="Display Order" {...register('displayOrder')} />
        <Switch control={control} name="isActive" label="Is Active" />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Faculty Member"
        />
      </div>
    </form>
  );
}
