import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useCollegeTypeForm } from './form.hook';

interface CollegeTypeFormProps {
  onSubmit: (data: CollegeMaster.CollegeTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<CollegeMaster.CollegeTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function CollegeTypeForm(props: CollegeTypeFormProps) {
  const { register, handleSubmit, reset } = useCollegeTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter College Type Name"
          {...register('name')}
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
