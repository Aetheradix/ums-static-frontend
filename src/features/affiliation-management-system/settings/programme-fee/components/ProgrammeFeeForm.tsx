import SelectProgramme from 'features/components/SelectProgramme';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useProgrammeFeeForm } from './form.hook';

interface ProgrammeFeeFormProps {
  onSubmit: (data: AffiliationMaster.ProgrammeFeeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<AffiliationMaster.ProgrammeFeeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ProgrammeFeeForm(props: ProgrammeFeeFormProps) {
  const { register, handleSubmit, reset } = useProgrammeFeeForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectProgramme {...register('programmeId')} />

        <TextBox
          label="Security Deposit Amount"
          placeholder="Enter Security Deposit Amount"
          {...register('securityDepositAmount')}
          required
        />

        <TextBox
          label="Affiliation Fee"
          placeholder="Enter Affiliation Fee"
          {...register('affiliationFee')}
          required
        />

        <TextBox
          label="Inspection Fee"
          placeholder="Enter Inspection Fee"
          {...register('inspectionFee')}
          required
        />

        <TextBox
          label="Other Fee"
          placeholder="Enter Other Fee"
          {...register('otherFee')}
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
