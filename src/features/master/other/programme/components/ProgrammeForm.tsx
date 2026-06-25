import SelectDegreeLevel from 'features/components/SelectDegreeLevel';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useProgrammeForm } from './form.hook';

interface ProgrammeFormProps {
  onSubmit: (data: Master.Other.ProgrammeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Other.ProgrammeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ProgrammeForm(props: ProgrammeFormProps) {
  const { register, handleSubmit, reset } = useProgrammeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Programme Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Programme Duration"
          placeholder="Enter Duration (e.g. 4 Years)"
          {...register('programmeDuration')}
          maxLength={20}
          required
        />
        <SelectDegreeLevel {...register('degreeLevelId')} />
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
