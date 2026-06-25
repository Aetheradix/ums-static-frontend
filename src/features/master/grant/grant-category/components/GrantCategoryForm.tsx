import SelectGrantType from 'features/components/SelectGrantType';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useGrantCategoryForm } from './form.hook';

interface GrantCategoryFormProps {
  onSubmit: (data: Master.Grant.GrantCategoryForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Grant.GrantCategoryForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function GrantCategoryForm(props: GrantCategoryFormProps) {
  const { register, handleSubmit, reset } = useGrantCategoryForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectGrantType {...register('grantTypeId')} />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Grant Category Name"
          {...register('name')}
          maxLength={100}
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
