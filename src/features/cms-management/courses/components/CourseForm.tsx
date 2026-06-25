import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  Switch,
  TextArea,
  DropDownList,
} from 'shared/components/forms';
import { useDepartmentsQuery } from '../../departments/queries';

type Props = {
  fetchData?: Cms.CourseForm;
  isSaving?: boolean;
  isEditMode?: boolean;
  onSubmit: (data: Cms.CourseForm) => void;
};

const DEFAULT_DATA: Cms.CourseForm = {
  name: '',
  icon: 'school',
  level: 'UG',
  departmentId: 0,
  duration: '',
  eligibilityCriteria: '',
  annualFees: 0,
  totalSeats: 0,
  badgeColor: 'badge-blue',
  description: '',
  isActive: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.CourseForm>(o => ({
  name: o.string().required().label('Name'),
  icon: o.string().optional().allow(''),
  level: o.string().required().label('Level'),
  departmentId: o.number().required().label('Department'),
  duration: o.string().optional().allow(''),
  eligibilityCriteria: o.string().optional().allow(''),
  annualFees: o.number().optional().allow(null, 0),
  totalSeats: o.number().optional().allow(null, 0),
  badgeColor: o.string().optional().allow(''),
  description: o.string().optional().allow(''),
  isActive: o.boolean().optional(),
  displayOrder: o.number().optional().allow(null, 0),
}));

export default function CourseForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { data: departments } = useDepartmentsQuery();

  const { register, handleSubmit, control } = useAppForm<Cms.CourseForm>({
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
          label="Level"
          data={[
            { label: 'UG', value: 'UG' },
            { label: 'PG', value: 'PG' },
            { label: 'PhD', value: 'PhD' },
            { label: 'Diploma', value: 'Diploma' },
          ]}
          required
          control={control}
          name="level"
        />
        <TextBox label="Duration (e.g., 4 Years)" {...register('duration')} />
        <TextBox label="Annual Fees (₹)" {...register('annualFees')} />
        <TextBox label="Total Seats" {...register('totalSeats')} />
        <TextBox label="Icon (Material Icon)" {...register('icon')} />
        <TextBox label="Badge Color CSS Class" {...register('badgeColor')} />
        <TextBox label="Display Order" {...register('displayOrder')} />
        <div className="col-span-2">
          <TextBox
            label="Eligibility Criteria"
            {...register('eligibilityCriteria')}
          />
        </div>
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
          label="Save Course"
        />
      </div>
    </form>
  );
}
