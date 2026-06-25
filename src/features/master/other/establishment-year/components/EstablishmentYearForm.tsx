import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useEstablishmentYearForm } from './form.hook';

interface EstablishmentYearFormProps {
  onSubmit: (data: Master.Other.EstablishmentYearForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.EstablishmentYearForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function EstablishmentYearForm(
  props: EstablishmentYearFormProps
) {
  const { register, handleSubmit, reset } = useEstablishmentYearForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Establishment Year"
          subLabel="(In Numbers)"
          placeholder="Enter Year "
          {...register('name')}
          maxLength={4}
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
