import { TextBox } from 'shared/components/forms';
import FormActions from 'shared/new-components/FormActions';
import FormGrid from 'shared/new-components/FormGrid';
import { useNationalityForm } from './form.hook';

interface NationalityFormProps {
  onSubmit: (data: Master.Other.NationalityForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.NationalityForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function NationalityForm(props: NationalityFormProps) {
  const { register, handleSubmit, reset } = useNationalityForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={1}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Nationality Name"
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
