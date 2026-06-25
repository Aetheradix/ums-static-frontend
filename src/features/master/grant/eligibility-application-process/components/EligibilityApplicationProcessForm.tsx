import SelectGrantCategory from 'features/components/SelectGrantCategory';
import SelectGrantType from 'features/components/SelectGrantType';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useEligibilityApplicationProcessForm } from './form.hook';

interface EligibilityApplicationProcessFormProps {
  onSubmit: (
    data: Master.Grant.EligibilityApplicationProcessForm
  ) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Grant.EligibilityApplicationProcessForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function EligibilityApplicationProcessForm(
  props: EligibilityApplicationProcessFormProps
) {
  const { register, handleSubmit, reset, watch } =
    useEligibilityApplicationProcessForm(props.onSubmit, props.fetchData);

  const grantTypeId = watch('grantTypeId');

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectGrantType {...register('grantTypeId')} />
        <SelectGrantCategory
          {...register('grantCategoryId')}
          grantTypeId={grantTypeId}
        />
      </FormGrid>
      <FormGrid columns={1}>
        <TextBox
          label="Eligibility Text"
          placeholder="Enter eligibility criteria"
          {...register('eligibilityText')}
          required
        />
      </FormGrid>
      <FormGrid columns={1}>
        <TextBox
          label="Application Process Text"
          placeholder="Enter application process steps"
          {...register('applicationProcessText')}
          required
        />
      </FormGrid>
      <FormGrid columns={1}>
        <TextBox
          label="Approval Process Text"
          placeholder="Enter approval process workflow"
          {...register('approvalProcessText')}
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
