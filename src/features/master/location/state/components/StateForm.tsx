import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useStateForm } from './form.hook';

interface StateFormProps {
  onSubmit: (data: Master.StateForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.StateForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function StateForm(props: StateFormProps) {
  const { register, handleSubmit, reset } = useStateForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter State Name"
          {...register('name')}
          maxLength={50}
          required
        />
        <TextBox
          label="Code"
          placeholder="Enter State Code"
          {...register('code')}
          maxLength={5}
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
