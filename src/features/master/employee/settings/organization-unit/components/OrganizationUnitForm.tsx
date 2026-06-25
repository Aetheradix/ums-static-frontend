import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useOrganizationUnitForm } from './form.hook';

interface OrganizationUnitFormProps {
  onSubmit: (data: Master.Employee.OrganizationUnitForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.OrganizationUnitForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function OrganizationUnitForm(props: OrganizationUnitFormProps) {
  const { register, handleSubmit, reset } = useOrganizationUnitForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Organization Unit Name"
          subLabel="(In English)"
          placeholder="Enter Organization Unit Name"
          {...register('name')}
          maxLength={150}
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
