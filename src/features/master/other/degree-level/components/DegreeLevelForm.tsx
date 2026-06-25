import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useDegreeLevelForm } from './form.hook';

interface DegreeLevelFormProps {
  onSubmit: (data: Master.Other.DegreeLevelForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.DegreeLevelForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DegreeLevelForm(props: DegreeLevelFormProps) {
  const { register, handleSubmit, reset } = useDegreeLevelForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={1}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Degree Level Name"
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
