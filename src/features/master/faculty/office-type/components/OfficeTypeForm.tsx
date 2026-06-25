import { FormActions, FormGrid } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { useOfficeTypeForm } from './form.hook';

interface OfficeTypeFormProps {
  onSubmit: (data: Master.OfficeTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.OfficeTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function OfficeTypeForm(props: OfficeTypeFormProps) {
  const { register, handleSubmit, reset } = useOfficeTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="Enter Office Type Code"
          {...register('code')}
          maxLength={5}
          required
        />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Office Type Name"
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
