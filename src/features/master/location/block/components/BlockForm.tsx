import SelectDistrict from 'features/components/SelectDistrict';
import SelectTehsil from 'features/components/SelectTehsil';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useBlockForm } from './form.hook';

interface BlockFormProps {
  onSubmit: (data: Master.BlockForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.BlockForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function BlockForm(props: BlockFormProps) {
  const { register, handleSubmit, reset } = useBlockForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Block Name"
          {...register('name')}
          maxLength={50}
          required
        />
        <TextBox
          label="Code"
          placeholder="Enter Block Code"
          {...register('code')}
          maxLength={5}
          required
        />
        <SelectDistrict {...register('districtId')} />
        <SelectTehsil {...register('tehsilId')} />
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
