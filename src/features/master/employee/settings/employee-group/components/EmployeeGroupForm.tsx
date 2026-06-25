import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useEmployeeGroupForm } from './form.hook';

interface EmployeeGroupFormProps {
  onSubmit: (data: Master.Employee.EmployeeGroupForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.EmployeeGroupForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function EmployeeGroupForm(props: EmployeeGroupFormProps) {
  const { register, handleSubmit, reset } = useEmployeeGroupForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Employee Group Name"
          subLabel="(In English)"
          placeholder="Enter Employee Group Name"
          {...register('name')}
          maxLength={100}
          required
        />

        <TextBox
          label="Description"
          subLabel="(In English)"
          placeholder="Enter Description"
          {...register('description')}
          maxLength={250}
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
