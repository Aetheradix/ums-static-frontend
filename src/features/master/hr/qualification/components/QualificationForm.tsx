import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useQualificationForm } from './form.hook';

interface QualificationFormProps {
  onSubmit: (data: Master.HR.QualificationForm) => Promise<void>;
  fetchData?: Master.HR.QualificationForm;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function QualificationForm(props: QualificationFormProps) {
  const { register, handleSubmit, reset } = useQualificationForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          placeholder="Enter Qualification Name"
          {...register('name')}
          maxLength={50}
          required
        />
        <TextBox
          label="Subject"
          placeholder="Enter Subject"
          {...register('subject')}
          maxLength={50}
          required
        />
        <TextBox
          label="Code"
          placeholder="Enter Code"
          {...register('code')}
          maxLength={10}
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
