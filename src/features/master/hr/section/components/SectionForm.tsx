import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSectionForm } from './form.hook';

interface SectionFormProps {
  onSubmit: (data: Master.HR.SectionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.HR.SectionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SectionForm(props: SectionFormProps) {
  const { register, handleSubmit, reset } = useSectionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Section Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Code"
          subLabel="(Section Code)"
          placeholder="Enter Section Code"
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
