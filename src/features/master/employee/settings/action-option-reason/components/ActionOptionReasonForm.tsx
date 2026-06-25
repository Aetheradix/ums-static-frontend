import SelectActionOption from 'features/components/SelectActionOption';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useActionOptionReasonForm } from './form.hook';

interface ActionOptionReasonFormProps {
  onSubmit: (data: Master.Employee.ActionOptionReasonForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.ActionOptionReasonForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ActionOptionReasonForm(
  props: ActionOptionReasonFormProps
) {
  const { register, handleSubmit, reset } = useActionOptionReasonForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectActionOption {...register('actionOptionId')} />

        <TextBox
          label="Reason"
          subLabel="(In English)"
          placeholder="Enter Reason Name"
          {...register('name')}
          maxLength={100}
          required
        />

        <TextBox
          label="Description"
          subLabel="(In English)"
          placeholder="Enter Reason Description"
          {...register('description')}
          maxLength={250}
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
