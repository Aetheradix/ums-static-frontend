import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSchemeTypeForm } from './form.hook';

interface SchemeTypeFormProps {
  onSubmit: (data: Master.Scheme.SchemeTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Scheme.SchemeTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SchemeTypeForm(props: SchemeTypeFormProps) {
  const { register, handleSubmit, reset } = useSchemeTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Scheme Type Name"
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
