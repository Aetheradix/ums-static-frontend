import SelectSchemeType from 'features/components/SelectSchemeType';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSchemeCategoryForm } from './form.hook';

interface SchemeCategoryFormProps {
  onSubmit: (data: Master.Scheme.SchemeCategoryForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Scheme.SchemeCategoryForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SchemeCategoryForm(props: SchemeCategoryFormProps) {
  const { register, handleSubmit, reset, control } = useSchemeCategoryForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectSchemeType {...register('schemeTypeId')} control={control} />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Scheme Category Name"
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
