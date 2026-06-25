import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema =
  validation.create<Master.Grant.EligibilityApplicationProcessForm>(o => ({
    grantTypeId: o.number().required(),
    grantCategoryId: o.number().required(),
    eligibilityText: o.string().required().max(2000),
    applicationProcessText: o.string().required().max(2000),
    approvalProcessText: o.string().required().max(2000),
  }));

export function useEligibilityApplicationProcessForm(
  submitCallback: Forms.SubmitFunc<Master.Grant.EligibilityApplicationProcessForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Grant.EligibilityApplicationProcessForm>
) {
  const { register, handleSubmit, reset, watch } =
    useAppForm<Master.Grant.EligibilityApplicationProcessForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
  };
}
