import SelectDistrict from 'features/components/SelectDistrict';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useTehsilForm } from './form.hook';

interface TehsilFormProps {
  onSubmit: (data: Master.TehsilForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.TehsilForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function TehsilForm(props: TehsilFormProps) {
  const { register, handleSubmit, reset } = useTehsilForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Tehsil Name"
          {...register('name')}
          maxLength={50}
          required
        />{' '}
        <TextBox
          label="Code"
          placeholder="Enter Tehsil Code"
          {...register('code')}
          maxLength={5}
          required
        />
        <SelectDistrict {...register('districtId')} />
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
