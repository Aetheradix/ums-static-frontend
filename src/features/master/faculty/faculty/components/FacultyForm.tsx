import SelectDepartment from 'features/components/SelectDepartment';
import SelectDesignation from 'features/components/SelectDesignation';
import SelectOfficeType from 'features/components/SelectOfficeType';
import { DatePicker, TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useFacultyForm } from './form.hook';

interface FacultyFormProps {
  onSubmit: (data: Master.FacultyForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.FacultyForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function FacultyForm(props: FacultyFormProps) {
  const { register, handleSubmit, reset, control } = useFacultyForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="Enter Faculty Code"
          {...register('code')}
          maxLength={10}
          required
        />
        <TextBox
          label="Name"
          placeholder="Enter Faculty Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <SelectOfficeType {...register('officeTypeId')} />
        <SelectDepartment {...register('departmentId')} />
        <SelectDesignation {...register('designationId')} />
        <DatePicker
          control={control}
          name="joiningDate"
          label="Joining Date"
          placeholder="Select Joining Date"
          required
        />
        <TextBox
          label="Mobile"
          placeholder="Enter Mobile Number"
          {...register('mobile')}
          maxLength={10}
          required
        />
        <TextBox
          label="Email"
          placeholder="Enter Email Address"
          {...register('email')}
          maxLength={100}
          required
        />
      </FormGrid>

      <FormActions
        isEditMode={props.isEditMode}
        isLoading={props.isSaving}
        onSave={handleSubmit}
        onReset={reset}
      />
    </form>
  );
}
