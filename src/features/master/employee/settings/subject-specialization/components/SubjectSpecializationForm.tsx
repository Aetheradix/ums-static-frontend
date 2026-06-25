import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSubjectSpecializationForm } from './form.hook';

interface SubjectSpecializationFormProps {
  onSubmit: (data: Master.Employee.SubjectSpecializationForm) => Promise<void>;

  fetchData?: Forms.FetchDataFunc<Master.Employee.SubjectSpecializationForm>;

  isSaving?: boolean;

  isEditMode?: boolean;
}

export default function SubjectSpecializationForm(
  props: SubjectSpecializationFormProps
) {
  const { register, handleSubmit, reset } = useSubjectSpecializationForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Subject Specialization"
          subLabel="(In English)"
          placeholder="Enter Subject Specialization"
          {...register('name')}
          maxLength={150}
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
