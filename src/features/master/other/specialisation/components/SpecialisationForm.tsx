import SelectProgramme from 'features/components/SelectProgramme';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSpecialisationForm } from './form.hook';

interface SpecialisationFormProps {
  onSubmit: (data: Master.Other.SpecialisationForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.SpecialisationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SpecialisationForm(props: SpecialisationFormProps) {
  const { register, handleSubmit, reset } = useSpecialisationForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Specialisation Name"
          {...register('name')}
          maxLength={50}
          required
        />
        <SelectProgramme {...register('programmeId')} />
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
