import SelectState from 'features/components/SelectState';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useDivisionForm } from './form.hook';

interface DivisionFormProps {
  onSubmit: (data: Master.DivisionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DivisionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DivisionForm(props: DivisionFormProps) {
  const { register, handleSubmit, reset } = useDivisionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Division Name"
          {...register('name')}
          maxLength={50}
          required
        />
        <TextBox
          label="Code"
          placeholder="Enter Division Code"
          {...register('code')}
          maxLength={5}
          required
        />
        <SelectState {...register('stateId')} />
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
