import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useTravelPurposeForm } from './form.hook';

interface TravelPurposeFormProps {
  onSubmit: (data: Master.Employee.TravelPurposeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.TravelPurposeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function TravelPurposeForm(props: TravelPurposeFormProps) {
  const { register, handleSubmit, reset } = useTravelPurposeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Travel Purpose"
          subLabel="(In English)"
          placeholder="Enter Travel Purpose"
          {...register('name')}
          maxLength={255}
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
