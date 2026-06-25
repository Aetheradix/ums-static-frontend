import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSubjectCategoryForm } from './form.hook';

interface SubjectCategoryFormProps {
  onSubmit: (data: Master.SubjectMaster.SubjectCategoryForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.SubjectMaster.SubjectCategoryForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SubjectCategoryForm(props: SubjectCategoryFormProps) {
  const { register, handleSubmit, reset } = useSubjectCategoryForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="Enter Subject Category Code"
          {...register('code')}
          maxLength={10}
          required
        />
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Subject Category Name"
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
