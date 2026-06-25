import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<AffiliationMaster.ProgrammeFeeForm>(o => ({
  programmeId: o.number().required().label('Programme'),
  securityDepositAmount: o
    .number()
    .required()
    .min(0)
    .label('Security Deposit Amount'),
  affiliationFee: o.number().required().min(0).label('Affiliation Fee'),
  inspectionFee: o.number().required().min(0).label('Inspection Fee'),
  otherFee: o.number().required().min(0).label('Other Fee'),
  isActive: o.boolean(),
}));

export function useProgrammeFeeForm(
  submitCallback: Forms.SubmitFunc<AffiliationMaster.ProgrammeFeeForm>,
  defaultValues?: Forms.FetchDataFunc<AffiliationMaster.ProgrammeFeeForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<AffiliationMaster.ProgrammeFeeForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
