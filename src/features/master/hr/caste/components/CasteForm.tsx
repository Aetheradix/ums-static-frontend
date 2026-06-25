import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useCasteForm } from './form.hook';

interface CasteFormProps {
  onSubmit: (data: Master.HR.CasteForm) => Promise<void>;
  fetchData?: Master.HR.CasteForm;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function CasteForm(props: CasteFormProps) {
  const { register, handleSubmit, reset } = useCasteForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          placeholder="Enter Caste Name"
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
