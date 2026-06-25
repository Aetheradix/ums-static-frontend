import SelectSubjectCategory from 'features/components/SelectSubjectCategory';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSubjectForm } from './form.hook';

interface SubjectFormProps {
  onSubmit: (data: Master.SubjectMaster.SubjectForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.SubjectMaster.SubjectForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SubjectForm(props: SubjectFormProps) {
  const { register, handleSubmit, reset } = useSubjectForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Subject Code"
          placeholder="Enter Subject Code"
          {...register('subjectCode')}
          maxLength={20}
          required
        />
        <TextBox
          label="Subject Name"
          subLabel="(In English)"
          placeholder="Enter Subject Name"
          {...register('subjectName')}
          maxLength={150}
          required
        />
        <SelectSubjectCategory {...register('categoryId')} />
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
