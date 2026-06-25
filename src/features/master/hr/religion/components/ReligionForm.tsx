import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useReligionForm } from './form.hook';

interface ReligionFormProps {
  onSubmit: (data: Master.HR.ReligionForm) => Promise<void>;
  fetchData?: Master.HR.ReligionForm;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ReligionForm(props: ReligionFormProps) {
  const { register, handleSubmit, reset } = useReligionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          placeholder="Enter Religion Name"
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
