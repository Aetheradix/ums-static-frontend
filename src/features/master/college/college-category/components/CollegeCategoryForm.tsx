import SelectCollegeType from 'features/components/SelectCollegeType';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useCollegeCategoryForm } from './form.hook';

interface CollegeCategoryFormProps {
  onSubmit: (data: CollegeMaster.CollegeCategoryForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<CollegeMaster.CollegeCategoryForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function CollegeCategoryForm(props: CollegeCategoryFormProps) {
  const { register, handleSubmit, reset } = useCollegeCategoryForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectCollegeType {...register('collegeTypeId')} />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter College Category Name"
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
