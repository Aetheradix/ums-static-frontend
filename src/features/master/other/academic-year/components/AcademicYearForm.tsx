import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useAcademicYearForm } from './form.hook';

interface AcademicYearFormProps {
  onSubmit: (data: Master.Other.AcademicYearForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.AcademicYearForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function AcademicYearForm(props: AcademicYearFormProps) {
  const { register, handleSubmit, reset } = useAcademicYearForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Academic Year Name"
          {...register('name')}
          maxLength={4}
          required
        />

        <TextBox
          label="Session"
          subLabel="(In English)"
          placeholder="Enter Session"
          {...register('session')}
          maxLength={7}
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
