import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useProgrammeModeOfEducationForm } from './form.hook';

interface ProgrammeModeOfEducationFormProps {
  onSubmit: (
    data: Master.SubjectMaster.ProgrammeModeOfEducationForm
  ) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.SubjectMaster.ProgrammeModeOfEducationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ProgrammeModeOfEducationForm(
  props: ProgrammeModeOfEducationFormProps
) {
  const { register, handleSubmit, reset } = useProgrammeModeOfEducationForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="Enter Mode of Education Code"
          {...register('code')}
          maxLength={10}
          required
        />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Mode of Education Name"
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
