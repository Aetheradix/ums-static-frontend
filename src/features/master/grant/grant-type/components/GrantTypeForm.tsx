import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useGrantTypeForm } from './form.hook';

interface GrantTypeFormProps {
  onSubmit: (data: Master.Grant.GrantTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Grant.GrantTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function GrantTypeForm(props: GrantTypeFormProps) {
  const { register, handleSubmit, reset } = useGrantTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Grant Type Name"
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
