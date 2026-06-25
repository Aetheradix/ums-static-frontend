import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useDocumentOptionForm } from './form.hook';

interface DocumentOptionFormProps {
  onSubmit: (data: Master.Employee.DocumentOptionsForm) => Promise<void>;

  fetchData?: Forms.FetchDataFunc<Master.Employee.DocumentOptionsForm>;

  isSaving?: boolean;

  isEditMode?: boolean;
}

export default function DocumentOptionForm(props: DocumentOptionFormProps) {
  const { register, handleSubmit, reset } = useDocumentOptionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Document Option"
          subLabel="(In English)"
          placeholder="Enter Document Option"
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
