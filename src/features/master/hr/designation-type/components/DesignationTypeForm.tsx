import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useDesignationTypeForm } from './form.hook';

interface DesignationTypeFormProps {
  onSubmit: (data: Master.HR.DesignationTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.HR.DesignationTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DesignationTypeForm(props: DesignationTypeFormProps) {
  const { register, handleSubmit, reset } = useDesignationTypeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Designation Type Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Code"
          subLabel="(Designation Type Code)"
          placeholder="Enter Designation Type Code"
          {...register('code')}
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
