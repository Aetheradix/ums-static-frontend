import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSeparationReasonTypeForm } from './form.hook';

interface SeparationReasonTypeFormProps {
  onSubmit: (data: Master.Employee.SeparationReasonTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.SeparationReasonTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SeparationReasonTypeForm(
  props: SeparationReasonTypeFormProps
) {
  const { register, handleSubmit, reset } = useSeparationReasonTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Separation Reason Name"
          subLabel="(In English)"
          placeholder="Enter Separation Reason Name"
          {...register('name')}
          maxLength={150}
          required
        />

        <TextBox
          label="Type"
          subLabel="(In English)"
          placeholder="Enter Type"
          {...register('type')}
          maxLength={20}
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
