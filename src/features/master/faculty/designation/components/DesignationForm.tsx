import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useDesignationForm } from './form.hook';

interface DesignationFormProps {
  onSubmit: (data: Master.DesignationForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DesignationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DesignationForm(props: DesignationFormProps) {
  const { register, handleSubmit, reset } = useDesignationForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={1}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Designation Name"
          {...register('name')}
          maxLength={40}
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
