import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useAvailableFacilityForm } from './form.hook';

interface AvailableFacilityFormProps {
  onSubmit: (data: CollegeMaster.AvailableFacilityForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<CollegeMaster.AvailableFacilityForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function AvailableFacilityForm(
  props: AvailableFacilityFormProps
) {
  const { register, handleSubmit, reset } = useAvailableFacilityForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={1}>
        <TextBox
          label="Facility Name"
          subLabel="(In English)"
          placeholder="Enter Facility Name"
          {...register('facilityName')}
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
