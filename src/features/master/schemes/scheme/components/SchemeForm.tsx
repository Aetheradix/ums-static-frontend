import SelectSchemeType from 'features/components/SelectSchemeType';
import SelectSchemeCategory from 'features/components/SelectSchemeCategory';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSchemeForm } from './form.hook';

interface SchemeFormProps {
  onSubmit: (data: Master.Scheme.SchemeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Scheme.SchemeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SchemeForm(props: SchemeFormProps) {
  const { register, handleSubmit, reset, control, watch } = useSchemeForm(
    props.onSubmit,
    props.fetchData
  );

  // Watch the schemeTypeId field to filter categories
  const selectedSchemeTypeId = watch('schemeTypeId');

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectSchemeType {...register('schemeTypeId')} control={control} />
        <SelectSchemeCategory
          {...register('schemeCategoryId')}
          control={control}
          schemeTypeId={selectedSchemeTypeId}
          disabled={!selectedSchemeTypeId}
          defaultOptionText={
            selectedSchemeTypeId
              ? 'Select Scheme Category'
              : 'Select Scheme Type First'
          }
        />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Scheme Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Code"
          subLabel="(In English)"
          placeholder="Enter Scheme Code"
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
