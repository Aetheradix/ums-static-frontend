import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useEmploymentNatureForm } from './form.hook';

interface EmploymentNatureFormProps {
  onSubmit: (data: Master.Employee.EmploymentNatureForm) => Promise<void>;

  fetchData?: Forms.FetchDataFunc<Master.Employee.EmploymentNatureForm>;

  isSaving?: boolean;

  isEditMode?: boolean;
}

export default function NatureOfEmploymentForm(
  props: EmploymentNatureFormProps
) {
  const { register, handleSubmit, reset } = useEmploymentNatureForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Nature of Employment"
          subLabel="(In English)"
          placeholder="Enter Nature of Employment"
          {...register('name')}
          maxLength={50}
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
